import { Component, OnInit } from '@angular/core';
import { ObjetosService, CATEGORIAS } from '../services/objetos.service';
import { Objeto } from '../models/objeto.model';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  categorias = CATEGORIAS;
  items: Objeto[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedItem: any = null;
  selectedItemInfo: any = null;

  constructor(private objetosService: ObjetosService) { }

  ngOnInit(): void {
    this.items = this.objetosService.getPorTipo('encontrado');
  }

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
  }

  hideDetails() {
    this.selectedItem = null;
    this.selectedItemInfo = null;
  }

  normalizeString(str: string) {
    return str
      .normalize('NFD')
      .split('')
      .filter(ch => ch.charCodeAt(0) < 0x0300 || ch.charCodeAt(0) > 0x036f)
      .join('')
      .toLowerCase();
  }
}
