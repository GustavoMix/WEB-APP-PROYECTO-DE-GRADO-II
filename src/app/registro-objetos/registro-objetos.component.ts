import { Component, ElementRef, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObjetosService, CATEGORIAS } from '../services/objetos.service';
import { MlService } from '../services/ml.service';
import { AuthService } from '../services/auth.service';
import { comprimirImagen } from '../services/imagen.util';
import { Coincidencia, TipoObjeto } from '../models/objeto.model';
import { Deteccion, interpretarPrediccion } from '../models/clasificacion';

@Component({
  selector: 'app-registro-objetos',
  templateUrl: './registro-objetos.component.html',
  styleUrls: ['./registro-objetos.component.css']
})
export class RegistroObjetosComponent implements OnInit {

  categorias = CATEGORIAS;

  itemName = '';
  itemDescription = '';
  itemCategory = '';
  itemTipo: TipoObjeto | '' = '';
  itemLocation = '';
  itemDate = '';
  contactoNombre = '';
  contactoTelefono = '';
  selectedFile: File = null;
  selectedFileUrl: any = null;

  deteccion: Deteccion = null;
  analizando = false;
  errorAnalisis = '';
  errorGuardado = '';
  /** Se activa al primer envío, para no marcar campos en rojo antes de tiempo. */
  intentoEnvio = false;
  featureVector: number[] = null;
  coincidencias: Coincidencia[] = [];

  constructor(
    private objetosService: ObjetosService,
    private mlService: MlService,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private host: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    // Si hay sesión iniciada, se precargan los datos de contacto.
    const usuario = this.authService.usuarioActual;
    if (usuario) {
      this.contactoNombre = `${usuario.nombre} ${usuario.apellido}`.trim();
      this.contactoTelefono = usuario.telefono;
    }
  }

  onSubmit(form) {
    this.errorGuardado = '';
    this.intentoEnvio = true;

    // Sin esta comprobación el formulario se podía enviar vacío y se
    // registraba un objeto sin nombre ni descripción.
    if (form.invalid) {
      this.errorGuardado = 'Faltan datos obligatorios. Revisa los campos marcados en rojo.';
      this.irAlPrimerCampoIncompleto();
      return;
    }

    try {
      this.objetosService.agregar({
        name: this.itemName,
        description: this.itemDescription,
        category: this.itemCategory,
        tipo: this.itemTipo as TipoObjeto,
        location: this.itemLocation,
        date: this.itemDate,
        image: this.selectedFileUrl || '',
        foundBy: this.contactoNombre || undefined,
        cellphone: this.contactoTelefono || undefined,
        predictionLabel: this.deteccion ? this.deteccion.nombre : undefined,
        predictionConfidence: this.deteccion ? this.deteccion.confianza : undefined,
        featureVector: this.featureVector || undefined
      });
    } catch (e) {
      this.errorGuardado = 'No hay espacio suficiente en el navegador para guardar más objetos con foto. ' +
        'Elimina algunos objetos registrados antes de continuar.';
      return;
    }

    const destino = this.itemTipo === 'perdido' ? '/perdidos' : '/course';

    form.reset();
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.deteccion = null;
    this.featureVector = null;
    this.coincidencias = [];
    this.errorAnalisis = '';
    this.intentoEnvio = false;

    this.router.navigate([destino]);
  }

  /**
   * Lleva la vista al primer campo que falta. Sin esto el aviso de error se
   * dibujaba junto al botón, fuera de la pantalla, y parecía que pulsar
   * "Registrar" no hacía absolutamente nada.
   */
  private irAlPrimerCampoIncompleto(): void {
    setTimeout(() => {
      const campo = this.host.nativeElement.querySelector<HTMLElement>('.form-control.ng-invalid');
      if (!campo) {
        return;
      }
      campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      campo.focus({ preventScroll: true });
    });
  }

  handleFileInput(event) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) {
      return;
    }

    this.deteccion = null;
    this.featureVector = null;
    this.coincidencias = [];
    this.errorAnalisis = '';
    this.errorGuardado = '';

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = async () => {
      // Se comprime antes de mostrarla y guardarla: la foto original de un
      // celular no cabe en localStorage.
      const comprimida = await comprimirImagen(reader.result as string);

      this.zone.run(() => {
        this.selectedFileUrl = comprimida;
      });

      this.analizarImagen(comprimida);
    };
  }

  /** Al cambiar perdido/encontrado se recalcula contra la lista contraria. */
  onTipoChange() {
    this.buscarCoincidencias();
  }

  /**
   * Analiza la imagen con MobileNet: primero identifica qué objeto es y
   * luego extrae su vector de características para poder compararla con
   * las fotos ya registradas.
   *
   * Los callbacks del modelo corren fuera de la zona de Angular, por eso
   * las actualizaciones de estado se hacen dentro de zone.run().
   */
  private async analizarImagen(dataUrl: string) {
    this.zone.run(() => this.analizando = true);

    try {
      const img = await this.mlService.cargarImagen(dataUrl);
      const resultado = await this.mlService.clasificar(img);

      this.zone.run(() => {
        this.deteccion = interpretarPrediccion(resultado.label, resultado.confidence);
        if (!this.itemCategory && this.deteccion.categoria) {
          this.itemCategory = this.deteccion.categoria;
        }
      });

      // La extracción del vector es opcional: si falla, la app sigue
      // funcionando con la clasificación y la coincidencia por categoría.
      try {
        const vector = await this.mlService.extraerVector(img);
        this.zone.run(() => {
          this.featureVector = vector;
        });
      } catch (e) {
        console.warn('No se pudo extraer el vector de características', e);
      }

      this.zone.run(() => {
        this.analizando = false;
        this.buscarCoincidencias();
      });
    } catch (e) {
      this.zone.run(() => {
        this.analizando = false;
        this.errorAnalisis = 'No se pudo analizar la imagen. Revisa tu conexión e inténtalo de nuevo.';
      });
    }
  }

  /**
   * Si registro algo perdido, las coincidencias útiles están entre lo
   * encontrado, y viceversa.
   */
  private buscarCoincidencias() {
    if (!this.deteccion && !this.featureVector) {
      this.coincidencias = [];
      return;
    }

    const tipoContrario: TipoObjeto = this.itemTipo === 'perdido' ? 'encontrado' : 'perdido';

    this.coincidencias = this.objetosService.buscarSimilares(
      this.featureVector,
      this.itemCategory,
      tipoContrario
    );
  }

  get tipoContrarioTexto(): string {
    return this.itemTipo === 'perdido' ? 'encontrados' : 'extraviados';
  }

  get confianzaPorcentaje(): number {
    return this.deteccion ? Math.round(this.deteccion.confianza * 100) : 0;
  }

  porcentaje(score: number): number {
    return Math.round(score * 100);
  }
}
