import { Component } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {
  items = [
    {'id':1,'name':'Cuaderno Extraviado','description':'Este cuaderno fue encontrado en el salón de clase 204.','image':'../../assets/objetos-perdidos/cuaderno.jfif', 'category': 'CUADERNOS'},
    {'id':2,'name':'Lápiz Extraviado','description':'Este lápiz fue encontrado en la biblioteca cerca de la sección de ciencias.','image':'../../assets/objetos-perdidos/lapiz1.png', 'category': 'LAPICES'},
    {'id':3,'name':'Bolígrafo Extraviado','description':'Este bolígrafo fue encontrado en la cafetería cerca de la máquina dispensadora de bebidas.','image':'../../assets/objetos-perdidos/boligrafo.jpg', 'category': 'BOLIGRAFOS'},
    {'id':4,'name':'Goma Extraviada','description':'Esta goma fue encontrada en el pasillo del segundo piso cerca de la sala de conferencias.','image':'../../assets/objetos-perdidos/goma.jfif', 'category': 'GOMAS'},
    {'id':5,'name':'Cuaderno Extraviado','description':'Este cuaderno fue encontrado en la entrada principal del edificio.','image':'../../assets/objetos-perdidos/cuaderno1.jfif', 'category': 'CUADERNOS'},
    {'id':6,'name':'Lápiz Extraviado','description':'Este lápiz fue encontrado en los vestidores del gimnasio.','image':'../../assets/objetos-perdidos/lapiz1.png', 'category': 'LAPICES'},
    {'id':7,'name':'Bolígrafo Extraviado','description':'Este bolígrafo fue encontrado en la sala de espera del consultorio médico.','image':'../../assets/objetos-perdidos/boligrafo.jpg', 'category': 'BOLIGRAFOS'},
    {'id':8,'name':'Goma Extraviada','description':'Esta goma fue encontrada en la sala de computación de la biblioteca.','image':'../../assets/objetos-perdidos/goma.jfif', 'category': 'GOMAS'},
    {'id':9,'name':'Cuaderno Extraviado','description':'Este cuaderno fue encontrado en el estacionamiento frente al edificio.','image':'../../assets/objetos-perdidos/cuaderno1.jfif', 'category': 'OTROS'},
    {'id':10,'name':'Lápiz Extraviado','description':'Este lápiz fue encontrado en el autobús escolar número 12.','image':'../../assets/objetos-perdidos/lapiz1.png', 'category': 'OTROS'},
    {'id':11,'name':'Bolígrafo Extraviado','description':'Este bolígrafo fue encontrado en la sala de espera del consultorio dental.','image':'../../assets/objetos-perdidos/boligrafo.jpg', 'category': 'OTROS'},
    {'id':12,'name':'Goma Extraviada','description':'Esta goma fue encontrada en el parque cercano al edificio.','image':'../../assets/objetos-perdidos/goma.jfif', 'category': 'OTROS'},
    {'id':13,'name':'Mochila Extraviada','description':'Esta mochila fue encontrada en la cancha de futbol.','image':'../../assets/objetos-perdidos/mochila.jfif', 'category': 'MOCHILAS'},
    {'id':14,'name':'Credencial Extraviada','description':'Esta credencial fue encontrada en el auditorio del edificio.','image':'../../assets/objetos-perdidos/carnet.JPG',  'category': 'CREDENCIALES'},
    {'id':15,'name':'Celular Extraviado','description':'Este celular fue encontrado en las escaleras del primer piso.','image':'../../assets/objetos-perdidos//celular.jpg',  'category': 'CELULARES'}
  ];
  searchTerm = '';
  selectedCategory = '';
  selectedItem: any = null;
  selectedItemInfo: any = null

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