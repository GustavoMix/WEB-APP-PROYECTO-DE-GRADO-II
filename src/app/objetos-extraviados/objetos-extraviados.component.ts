import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-objetos-extraviados',
  templateUrl: './objetos-extraviados.component.html',
  styleUrls: ['./objetos-extraviados.component.css']
})
export class ObjetosExtraviadosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  items = [
    {'id':1,'name':'Cuaderno Extraviado','description':'Se está buscando un cuaderno que fue extraviado en el salón de clase 204.','image':'../../assets/objetos-perdidos/cuaderno.jfif', 'category': 'CUADERNOS'},
    {'id':2,'name':'Lápiz Extraviado','description':'Estamos buscando un lápiz que se perdió cerca de la sección de ciencias en la biblioteca.','image':'../../assets/objetos-perdidos/lapiz1.png', 'category': 'LAPICES'},
    {'id':3,'name':'Bolígrafo Extraviado','description':'Se ha perdido un bolígrafo en la cafetería cerca de la máquina dispensadora de bebidas.','image':'../../assets/objetos-perdidos/boligrafo.jpg', 'category': 'BOLIGRAFOS'},
    {'id':4,'name':'Goma Extraviada','description':'Se busca una goma que fue extraviada en el pasillo del segundo piso cerca de la sala de conferencias.','image':'../../assets/objetos-perdidos/goma.jfif', 'category': 'GOMAS'},
    {'id':5,'name':'Cuaderno Extraviado','description':'Estamos tratando de encontrar un cuaderno que se extravió en la entrada principal del edificio.','image':'../../assets/objetos-perdidos/cuaderno1.jfif', 'category': 'CUADERNOS'},
    {'id':6,'name':'Lápiz Extraviado','description':'Se ha perdido un lápiz en los vestidores del gimnasio.','image':'../../assets/objetos-perdidos/lapiz1.png', 'category': 'LAPICES'},
    {'id':7,'name':'Bolígrafo Extraviado','description':'Se está buscando un bolígrafo que se perdió en la sala de espera del consultorio médico.','image':'../../assets/objetos-perdidos/boligrafo.jpg', 'category': 'BOLIGRAFOS'},
    {'id':8,'name':'Goma Extraviada','description':'Se busca una goma que fue extraviada en la sala de computación de la biblioteca.','image':'../../assets/objetos-perdidos/goma.jfif', 'category': 'GOMAS'},
    {'id':9,'name':'Cuaderno Extraviado','description':'Se ha extraviado un cuaderno en el estacionamiento frente al edificio.','image':'../../assets/objetos-perdidos/cuaderno1.jfif', 'category': 'OTROS'},
    {'id':10,'name':'Lápiz Extraviado','description':'Estamos buscando un lápiz que se perdió en el autobús escolar número 12.','image':'../../assets/objetos-perdidos/lapiz1.png', 'category': 'OTROS'},
    {'id':11,'name':'Bolígrafo Extraviado','description':'Se perdió un bolígrafo en la sala de espera del consultorio dental.','image':'../../assets/objetos-perdidos/boligrafo.jpg', 'category': 'OTROS'},
    {'id':12,'name':'Goma Extraviada','description':'Se busca una goma que fue extraviada en el parque cercano al edificio.','image':'../../assets/objetos-perdidos/goma.jfif', 'category': 'OTROS'},
    {'id':13,'name':'Mochila Extraviada','description':'Se está buscando una mochila que fue extraviada en la cancha de futbol.','image':'../../assets/objetos-perdidos/mochila.jfif', 'category': 'MOCHILAS'},
    {'id':14,'name':'Credencial Extraviada','description':'Se ha extraviado una credencial en el auditorio del edificio.','image':'../../assets/objetos-perdidos/carnet.JPG',  'category': 'CREDENCIALES'},
    {'id':15,'name':'Celular Extraviado','description':'Este celular fue encontrado en las escaleras del primer piso.','image':'../../assets/objetos-perdidos//celular.jpg',  'category': 'CELULARES'}
  ];
  searchTerm = '';
  selectedCategory = '';
  selectedItem: any = null;
  selectedItemInfo: any = null;

  get filteredItems() {
    const normalizedSearchTerm = this.normalizeString(this.searchTerm);
    return this.items.filter(item => {
      const normalizedItemName = this.normalizeString(item.name);
      const normalizedItemDescription = this.normalizeString(item.description);
      const isMatch = normalizedItemName.includes(normalizedSearchTerm) || normalizedItemDescription.includes(normalizedSearchTerm);
      return this.selectedCategory ? item.category === this.selectedCategory && isMatch : isMatch;
    });
  }
  
  setCategory(category: string) {
    this.selectedCategory = category;
  }
  
  showDetails(item: any) {
    this.selectedItem = item;
    this.selectedItemInfo = { foundBy: item.foundBy, cellphone: item.cellphone };
    document.getElementById("myModal").style.display = "block";
  }
  
  hideDetails() {
    document.getElementById("myModal").style.display = "none";
    this.selectedItem = null;
    this.selectedItemInfo = null;
  }
  
  normalizeString(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

}
