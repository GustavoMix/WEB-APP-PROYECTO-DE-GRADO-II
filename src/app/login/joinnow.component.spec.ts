import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { JoinnowComponent } from './joinnow.component';
import { AuthService } from '../services/auth.service';

describe('JoinnowComponent', () => {
  let component: JoinnowComponent;
  let fixture: ComponentFixture<JoinnowComponent>;

  beforeEach(async () => {
    localStorage.clear();
    // La plantilla usa ngModel y routerLink.
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [JoinnowComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinnowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => localStorage.clear());

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('alterna entre el formulario de ingreso y el de registro', () => {
    component.showRegisterForm();
    expect(component.isRegisterFormVisible).toBe(true);
    expect(component.isLoginFormVisible).toBe(false);

    component.showLoginForm();
    expect(component.isLoginFormVisible).toBe(true);
    expect(component.isRegisterFormVisible).toBe(false);
  });

  it('avisa cuando las contraseñas no coinciden y no crea la cuenta', () => {
    component.registerFirstName = 'Ana';
    component.registerLastName = 'Pérez';
    component.registerEmail = 'ana@example.com';
    component.registerPhoneNumber = '70012345';
    component.registerPassword = 'secreta123';
    component.registerConfirmPassword = 'otracosa';

    component.onRegister();

    expect(component.error).toContain('no coinciden');
    expect(TestBed.inject(AuthService).estaAutenticado).toBe(false);
  });

  it('muestra el error cuando las credenciales son incorrectas', () => {
    component.loginEmail = 'nadie@example.com';
    component.loginPassword = 'loquesea';

    component.onLogin();

    expect(component.error).toBeTruthy();
  });

  it('inicia sesión con credenciales válidas', () => {
    TestBed.inject(AuthService).registrar({
      nombre: 'Ana', apellido: 'Pérez', email: 'ana@example.com', telefono: '70012345'
    }, 'secreta123');
    TestBed.inject(AuthService).logout();

    component.loginEmail = 'ana@example.com';
    component.loginPassword = 'secreta123';
    component.onLogin();

    expect(component.error).toBe('');
    expect(component.usuario.nombre).toBe('Ana');
  });

  it('cierra la sesión', () => {
    TestBed.inject(AuthService).registrar({
      nombre: 'Ana', apellido: 'Pérez', email: 'ana@example.com', telefono: '70012345'
    }, 'secreta123');

    component.cerrarSesion();

    expect(component.usuario).toBeNull();
    expect(TestBed.inject(AuthService).estaAutenticado).toBe(false);
  });
});
