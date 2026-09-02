import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as ml5 from 'ml5';
import { ObjetosService, CATEGORIAS } from '../services/objetos.service';
import { TipoObjeto } from '../models/objeto.model';
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

  constructor(
    private objetosService: ObjetosService,
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
      predictionConfidence: this.deteccion ? this.deteccion.confianza : undefined
    });

    const destino = this.itemTipo === 'perdido' ? '/perdidos' : '/course';

    form.reset();
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.deteccion = null;
    this.errorAnalisis = '';

    this.router.navigate([destino]);
  }

  handleFileInput(event) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) {
      return;
    }

    this.deteccion = null;
    this.errorAnalisis = '';

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.selectedFileUrl = reader.result as string;
      this.analizarImagen(this.selectedFileUrl);
    };
  }

  /**
   * Clasifica la imagen con MobileNet (ml5) y traduce el resultado a una
   * categoría del sistema. Los callbacks de ml5 corren fuera de la zona de
   * Angular, por eso las actualizaciones se hacen dentro de zone.run().
   */
  private async analizarImagen(dataUrl: string) {
    this.analizando = true;

    try {
      const imageModel = await ml5.imageClassifier('MobileNet');

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      imageModel.classify(img, (err, results) => {
        this.zone.run(() => {
          this.analizando = false;

          if (err || !results || !results.length) {
            this.errorAnalisis = 'No se pudo analizar la imagen.';
            return;
          }

          this.deteccion = interpretarPrediccion(results[0].label, results[0].confidence);

          // Sugiere la categoría detectada solo si el usuario no eligió una.
          if (!this.itemCategory && this.deteccion.categoria) {
            this.itemCategory = this.deteccion.categoria;
          }
        });
      });
    } catch (e) {
      this.zone.run(() => {
        this.analizando = false;
        this.errorAnalisis = 'No se pudo cargar el modelo de reconocimiento.';
      });
    }
  }

  get confianzaPorcentaje(): number {
    return this.deteccion ? Math.round(this.deteccion.confianza * 100) : 0;
  }
}
