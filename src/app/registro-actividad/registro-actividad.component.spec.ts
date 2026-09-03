import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { RegistroActividadComponent } from './registro-actividad.component';
import { ActividadService } from '../services/actividad.service';

describe('RegistroActividadComponent', () => {
  let component: RegistroActividadComponent;
  let fixture: ComponentFixture<RegistroActividadComponent>;

  beforeEach(async () => {
    localStorage.clear();
    // La plantilla usa ngModel en el selector de cantidad.
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RegistroActividadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => localStorage.clear());

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('muestra un mensaje cuando todavía no hay actividad', () => {
    expect(component.actividades.length).toBe(0);
    expect(fixture.nativeElement.querySelector('.empty-card')).not.toBeNull();
  });

  it('lista la actividad registrada, de la más reciente a la más antigua', () => {
    const actividad = TestBed.inject(ActividadService);
    actividad.registrar('Primera acción', 'detalle 1');
    actividad.registrar('Segunda acción', 'detalle 2');

    component.cargar();

    expect(component.actividades.length).toBe(2);
    expect(component.actividades[0].accion).toBe('Segunda acción');
  });

  it('respeta el límite seleccionado', () => {
    const actividad = TestBed.inject(ActividadService);
    for (let i = 0; i < 15; i++) {
      actividad.registrar('Acción', `detalle ${i}`);
    }

    component.limite = 10;
    component.cargar();

    expect(component.actividades.length).toBe(10);
  });
});
