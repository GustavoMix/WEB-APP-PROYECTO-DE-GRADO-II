import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as ml5 from 'ml5';
import { ObjetosService, CATEGORIAS } from '../services/objetos.service';
import { TipoObjeto } from '../models/objeto.model';

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
  predictionResult: any = null;

  constructor(private objetosService: ObjetosService, private router: Router) { }

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
      predictionLabel: this.predictionResult?.label,
      predictionConfidence: this.predictionResult?.confidence
    });

    const destino = this.itemTipo === 'perdido' ? '/perdidos' : '/course';

    form.reset();
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.predictionResult = null;

    this.router.navigate([destino]);
  }

  async handleFileInput(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = async () => {
        this.selectedFileUrl = reader.result as string;

        // Carga el modelo pre-entrenado de MobileNet
        const imageModel = await ml5.imageClassifier('MobileNet');

        // Crea un elemento HTML Image y carga la imagen seleccionada
        const img = new Image();
        img.src = this.selectedFileUrl;

        // Espera hasta que la imagen se cargue completamente
        await new Promise((resolve) => (img.onload = resolve));

        // Realiza una predicción sobre la imagen usando el modelo de ml5.js
        imageModel.classify(img, (err, results) => {
          if (err) {
            console.error(err);
            return;
          }

          // Asigna el resultado de la predicción a la variable predictionResult
          this.predictionResult = results[0];
        });
      };
    }
  }
}
