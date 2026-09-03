import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { RegistroObjetosComponent } from './registro-objetos.component';
import { AuthService } from '../services/auth.service';
import { ObjetosService } from '../services/objetos.service';

describe('RegistroObjetosComponent', () => {
  let component: RegistroObjetosComponent;
  let fixture: ComponentFixture<RegistroObjetosComponent>;

  /** Formulario mínimo: el componente solo necesita poder resetearlo. */
  const formFalso = { reset: () => { } } as any;

  beforeEach(async () => {
    localStorage.clear();
    // La plantilla usa ngModel y el componente navega tras guardar.
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [RegistroObjetosComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroObjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => localStorage.clear());

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('deja el contacto vacío si no hay sesión iniciada', () => {
    expect(component.contactoNombre).toBe('');
    expect(component.contactoTelefono).toBe('');
  });

  it('precarga los datos de contacto del usuario con sesión iniciada', () => {
    TestBed.inject(AuthService).registrar({
      nombre: 'Ana', apellido: 'Pérez', email: 'ana@example.com', telefono: '70012345'
    }, 'secreta123');

    const otra = TestBed.createComponent(RegistroObjetosComponent);
    otra.detectChanges();

    expect(otra.componentInstance.contactoNombre).toBe('Ana Pérez');
    expect(otra.componentInstance.contactoTelefono).toBe('70012345');
  });

  it('guarda el objeto con sus datos de contacto', () => {
    component.itemName = 'Mochila azul';
    component.itemDescription = 'Con llavero';
    component.itemCategory = 'MOCHILAS';
    component.itemTipo = 'perdido';
    component.itemLocation = 'Cancha';
    component.itemDate = '2026-09-01';
    component.contactoNombre = 'Ana Pérez';
    component.contactoTelefono = '70012345';

    component.onSubmit(formFalso);

    const guardado = TestBed.inject(ObjetosService)
      .getPorTipo('perdido').find(o => o.name === 'Mochila azul');

    expect(guardado).toBeDefined();
    expect(guardado.foundBy).toBe('Ana Pérez');
    expect(guardado.cellphone).toBe('70012345');
    expect(component.errorGuardado).toBe('');
  });

  it('avisa en pantalla si el almacenamiento está lleno, sin perder el aviso', () => {
    spyOn(TestBed.inject(ObjetosService), 'agregar').and.throwError('ALMACENAMIENTO_LLENO');

    component.itemTipo = 'perdido';
    component.onSubmit(formFalso);

    expect(component.errorGuardado).toContain('espacio');
  });

  it('calcula el porcentaje de confianza de la detección', () => {
    expect(component.confianzaPorcentaje).toBe(0);

    component.deteccion = { categoria: 'MOCHILAS', nombre: 'Mochila', confianza: 0.876, etiquetaOriginal: 'backpack' };

    expect(component.confianzaPorcentaje).toBe(88);
  });

  it('describe el tipo contrario para el texto de coincidencias', () => {
    component.itemTipo = 'perdido';
    expect(component.tipoContrarioTexto).toBe('encontrados');

    component.itemTipo = 'encontrado';
    expect(component.tipoContrarioTexto).toBe('extraviados');
  });
});
