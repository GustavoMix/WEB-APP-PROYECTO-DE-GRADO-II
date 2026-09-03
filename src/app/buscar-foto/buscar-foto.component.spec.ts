import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BuscarFotoComponent } from './buscar-foto.component';
import { ObjetosService } from '../services/objetos.service';

describe('BuscarFotoComponent', () => {
  let component: BuscarFotoComponent;
  let fixture: ComponentFixture<BuscarFotoComponent>;

  beforeEach(async () => {
    localStorage.clear();
    // La plantilla enlaza a las listas con routerLink.
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BuscarFotoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => localStorage.clear());

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('empieza sin foto ni resultados', () => {
    expect(component.imagenUrl).toBeNull();
    expect(component.coincidencias.length).toBe(0);
    expect(component.yaBusco).toBe(false);
  });

  it('cuenta cuántos objetos tienen vector disponible para comparar', () => {
    // Los objetos de ejemplo no pasaron por el modelo, así que arrancan en 0.
    expect(component.totalDisponibles).toBe(0);

    TestBed.inject(ObjetosService).agregar({
      name: 'Mochila', description: 'x', category: 'MOCHILAS',
      tipo: 'perdido', image: 'data:image/jpeg;base64,xxx', featureVector: [1, 0, 0]
    });

    component.ngOnInit();
    expect(component.totalDisponibles).toBe(1);
  });

  it('convierte el parecido a porcentaje entero', () => {
    expect(component.porcentaje(0.8642)).toBe(86);
  });
});
