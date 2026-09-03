import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObjetosService, CATEGORIAS } from '../services/objetos.service';
import { Objeto, TipoObjeto } from '../models/objeto.model';

/**
 * Listado de objetos, reutilizado por las rutas de extraviados y encontrados.
 *
 * Antes existían dos componentes (ObjetosExtraviadosComponent y
 * CourseComponent) con el mismo código duplicado; la única diferencia real
 * era el tipo de objeto que mostraban. Ahora el tipo y los textos llegan
 * desde la configuración de la ruta (data), en app-routing.module.ts.
 */
@Component({
  selector: 'app-listado-objetos',
  templateUrl: './listado-objetos.component.html',
  styleUrls: ['./listado-objetos.component.css']
})
export class ListadoObjetosComponent implements OnInit, OnDestroy {

  categorias = CATEGORIAS;
  items: Objeto[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedItem: Objeto = null;
  confirmandoEliminar = false;

  tipo: TipoObjeto = 'perdido';
  titulo = '';
  subtitulo = '';
  etiquetaContacto = 'Contacto';

  private rutaSub: Subscription;

  constructor(
    private objetosService: ObjetosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Se escucha data en lugar de leerla una sola vez porque Angular reutiliza
    // la instancia del componente al navegar entre /perdidos y /course: sin
    // esto, la segunda ruta seguiría mostrando los objetos de la primera.
    this.rutaSub = this.route.data.subscribe(data => {
      this.tipo = data.tipo;
      this.titulo = data.titulo;
      this.subtitulo = data.subtitulo;
      this.etiquetaContacto = data.etiquetaContacto;

      this.selectedCategory = '';
      this.searchTerm = '';
      this.hideDetails();
      this.items = this.objetosService.getPorTipo(this.tipo);
    });
  }

  ngOnDestroy(): void {
    if (this.rutaSub) {
      this.rutaSub.unsubscribe();
    }
  }

  get filteredItems(): Objeto[] {
    const termino = this.normalizeString(this.searchTerm);

    return this.items
      .filter(item => {
        const coincideTexto = this.normalizeString(item.name).includes(termino)
          || this.normalizeString(item.description).includes(termino);
        return this.selectedCategory
          ? item.category === this.selectedCategory && coincideTexto
          : coincideTexto;
      })
      // Los ya recuperados se muestran al final: siguen siendo consultables
      // pero no estorban a quien está buscando algo activo.
      .sort((a, b) => (a.estado === 'recuperado' ? 1 : 0) - (b.estado === 'recuperado' ? 1 : 0));
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }

  showDetails(item: Objeto): void {
    this.selectedItem = item;
    this.confirmandoEliminar = false;
  }

  hideDetails(): void {
    this.selectedItem = null;
    this.confirmandoEliminar = false;
  }

  marcarRecuperado(item: Objeto): void {
    this.objetosService.marcarRecuperado(item.id);
    item.estado = 'recuperado';
  }

  pedirConfirmacion(): void {
    this.confirmandoEliminar = true;
  }

  cancelarEliminar(): void {
    this.confirmandoEliminar = false;
  }

  eliminar(item: Objeto): void {
    this.objetosService.eliminar(item.id);
    this.items = this.items.filter(o => o.id !== item.id);
    this.hideDetails();
  }

  /** Quita acentos y pasa a minúsculas para que la búsqueda no dependa de tildes. */
  normalizeString(str: string): string {
    return (str || '')
      .normalize('NFD')
      .split('')
      .filter(ch => ch.charCodeAt(0) < 0x0300 || ch.charCodeAt(0) > 0x036f)
      .join('')
      .toLowerCase();
  }
}
