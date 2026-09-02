import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObjetosService, CATEGORIAS } from '../services/objetos.service';
import { MlService } from '../services/ml.service';
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
  selectedFile: File = null;
  selectedFileUrl: any = null;

  deteccion: Deteccion = null;
  analizando = false;
  errorAnalisis = '';
  featureVector: number[] = null;
  coincidencias: Coincidencia[] = [];

  constructor(
    private objetosService: ObjetosService,
    private mlService: MlService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form) {
    this.objetosService.agregar({
      name: this.itemName,
      description: this.itemDescription,
      category: this.itemCategory,
      tipo: this.itemTipo as TipoObjeto,
      location: this.itemLocation,
      date: this.itemDate,
      image: this.selectedFileUrl || '',
      predictionLabel: this.deteccion ? this.deteccion.nombre : undefined,
      predictionConfidence: this.deteccion ? this.deteccion.confianza : undefined,
      featureVector: this.featureVector || undefined
    });

    const destino = this.itemTipo === 'perdido' ? '/perdidos' : '/course';

    form.reset();
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.deteccion = null;
    this.featureVector = null;
    this.coincidencias = [];
    this.errorAnalisis = '';

    this.router.navigate([destino]);
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

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.selectedFileUrl = reader.result as string;
      this.analizarImagen(this.selectedFileUrl);
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
    this.analizando = true;

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
