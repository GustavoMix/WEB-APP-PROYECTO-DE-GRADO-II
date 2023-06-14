import { Component, OnInit } from '@angular/core';
import * as ml5 from 'ml5';
@Component({
  selector: 'app-registro-objetos',
  templateUrl: './registro-objetos.component.html',
  styleUrls: ['./registro-objetos.component.css']
})
export class RegistroObjetosComponent implements OnInit {



  ngOnInit(): void {
  }

  itemName: string = '';
  itemDescription: string = '';
  itemCategory: string = '';
  selectedFile: File = null;
  selectedFileUrl: any = null;
  predictionResult: any = null;
  constructor() { }

  onSubmit(form) {
    // Obtener los valores de los campos del formulario
    const name = this.itemName;
    const description = this.itemDescription;
    const category = this.itemCategory;
    const file = this.selectedFile;

    // Aquí podrías llamar a un servicio o API para procesar el registro del objeto

    // Limpiar el formulario
    form.reset();
    this.selectedFile = null;
    this.selectedFileUrl = null;
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


