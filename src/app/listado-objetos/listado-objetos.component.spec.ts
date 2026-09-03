import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ListadoObjetosComponent } from './listado-objetos.component';
import { ObjetosService } from '../services/objetos.service';
import { Objeto } from '../models/objeto.model';

describe('ListadoObjetosComponent', () => {
  let component: ListadoObjetosComponent;
  let fixture: ComponentFixture<ListadoObjetosComponent>;
  let objetosService: ObjetosService;

  const datosRuta = {
    tipo: 'perdido',
    titulo: 'Objetos Extraviados',
    subtitulo: 'Objetos que otras personas están buscando.',
    etiquetaContacto: 'Contacto'
  };

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ListadoObjetosComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of(datosRuta) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoObjetosComponent);
    component = fixture.componentInstance;
    objetosService = TestBed.inject(ObjetosService);
    fixture.detectChanges();
  });

  afterAll(() => localStorage.clear());

  it('toma el tipo y los textos desde la configuración de la ruta', () => {
    expect(component.tipo).toBe('perdido');
    expect(component.titulo).toBe('Objetos Extraviados');
    expect(fixture.nativeElement.querySelector('.page-title').textContent).toContain('Objetos Extraviados');
  });

  it('solo carga objetos del tipo de la ruta', () => {
    expect(component.items.length).toBeGreaterThan(0);
    expect(component.items.every(o => o.tipo === 'perdido')).toBe(true);
  });

  it('filtra por texto sin distinguir acentos ni mayúsculas', () => {
    component.searchTerm = 'LAPIZ';
    const resultados = component.filteredItems;

    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados.every(o => component.normalizeString(o.name + o.description).includes('lapiz'))).toBe(true);
  });

  it('filtra por categoría', () => {
    component.setCategory('MOCHILAS');
    expect(component.filteredItems.every(o => o.category === 'MOCHILAS')).toBe(true);
  });

  it('combina búsqueda por texto y categoría', () => {
    component.setCategory('CUADERNOS');
    component.searchTerm = 'biblioteca';

    expect(component.filteredItems.every(o =>
      o.category === 'CUADERNOS' && component.normalizeString(o.description).includes('biblioteca')
    )).toBe(true);
  });

  it('muestra los objetos recuperados al final de la lista', () => {
    const primero = component.items[0];
    component.marcarRecuperado(primero);

    const orden = component.filteredItems;
    expect(orden[orden.length - 1].id).toBe(primero.id);
  });

  it('abre y cierra el detalle de un objeto', () => {
    const item = component.items[0];

    component.showDetails(item);
    expect(component.selectedItem).toBe(item);

    component.hideDetails();
    expect(component.selectedItem).toBeNull();
  });

  it('pide confirmación antes de eliminar', () => {
    component.showDetails(component.items[0]);
    expect(component.confirmandoEliminar).toBe(false);

    component.pedirConfirmacion();
    expect(component.confirmandoEliminar).toBe(true);

    component.cancelarEliminar();
    expect(component.confirmandoEliminar).toBe(false);
  });

  it('elimina el objeto de la lista y del servicio', () => {
    const item = component.items[0];

    component.eliminar(item);

    expect(component.items.some(o => o.id === item.id)).toBe(false);
    expect(objetosService.getPorTipo('perdido').some(o => o.id === item.id)).toBe(false);
    expect(component.selectedItem).toBeNull();
  });

  it('marca como recuperado a través del servicio', () => {
    const item = component.items[0];

    component.marcarRecuperado(item);

    expect(item.estado).toBe('recuperado');
    expect(objetosService.getResumen().recuperados).toBe(1);
  });

  it('normalizeString no falla con valores vacíos', () => {
    expect(component.normalizeString(null)).toBe('');
    expect(component.normalizeString('')).toBe('');
  });
});
