import { Component, OnInit } from '@angular/core';
import { ObjetosService, CATEGORIAS } from '../services/objetos.service';
import { Objeto } from '../models/objeto.model';

@Component({
  selector: 'app-objetos-extraviados',
  templateUrl: './objetos-extraviados.component.html',
  styleUrls: ['./objetos-extraviados.component.css']
})
export class ObjetosExtraviadosComponent implements OnInit {

  categorias = CATEGORIAS;
  items: Objeto[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedItem: any = null;
  selectedItemInfo: any = null;

  constructor(private objetosService: ObjetosService) { }

  ngOnInit(): void {
    this.items = this.objetosService.getPorTipo('perdido');
  }

  get filteredItems() {
    const normalizedSearchTerm = this.normalizeString(this.searchTerm);
    return this.items
      .filter(item => {
        const normalizedItemName = this.normalizeString(item.name);
        const normalizedItemDescription = this.normalizeString(item.description);
        const isMatch = normalizedItemName.includes(normalizedSearchTerm) || normalizedItemDescription.includes(normalizedSearchTerm);
        return this.selectedCategory ? item.category === this.selectedCategory && isMatch : isMatch;
      })
      .sort((a, b) => (a.estado === 'recuperado' ? 1 : 0) - (b.estado === 'recuperado' ? 1 : 0));
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

  marcarRecuperado(item: Objeto) {
    this.objetosService.marcarRecuperado(item.id);
    item.estado = 'recuperado';
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
