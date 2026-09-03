import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  afterAll(() => localStorage.clear());

  it('se crea correctamente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el nombre de la institución en la barra de navegación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const marca = fixture.nativeElement.querySelector('.navbar-brand').textContent;
    expect(marca).toContain('25 de Mayo');
  });

  it('muestra el botón de ingresar cuando no hay sesión', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.usuario).toBeNull();
    expect(fixture.nativeElement.querySelector('.usuario-link')).toBeNull();
  });

  it('muestra el usuario en la barra cuando hay sesión iniciada', () => {
    const auth = TestBed.inject(AuthService);
    auth.registrar({
      nombre: 'Ana', apellido: 'Pérez', email: 'ana@example.com', telefono: '70012345'
    }, 'secreta123');

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.usuario-link').textContent).toContain('Ana');
  });
});
