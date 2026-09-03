import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasComponent } from './estadisticas.component';
import { ObjetosService } from '../services/objetos.service';

describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [EstadisticasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => localStorage.clear());

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('muestra conteos reales, no datos de ejemplo', () => {
    const esperado = TestBed.inject(ObjetosService).getResumen();
    expect(component.resumen.total).toBe(esperado.total);
  });

  it('ordena las categorías de mayor a menor', () => {
    const barras = component.porCategoriaPerdidos;

    for (let i = 1; i < barras.length; i++) {
      expect(barras[i - 1].cantidad).toBeGreaterThanOrEqual(barras[i].cantidad);
    }
  });

  it('da 100% de ancho a la categoría más frecuente', () => {
    expect(component.porCategoriaPerdidos[0].porcentaje).toBe(100);
  });

  it('calcula el porcentaje de recuperados sin dividir entre cero', () => {
    expect(component.porcentajeRecuperados).toBe(0);

    const objetos = TestBed.inject(ObjetosService);
    objetos.marcarRecuperado(objetos.getPorTipo('perdido')[0].id);
    component.ngOnInit();

    expect(component.porcentajeRecuperados).toBeGreaterThan(0);
  });
});
