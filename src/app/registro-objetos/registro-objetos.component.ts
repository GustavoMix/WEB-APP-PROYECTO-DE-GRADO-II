import { Component, OnInit } from '@angular/core';

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

  handleFileInput(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.selectedFileUrl = reader.result;
      };
    }
  }
}


