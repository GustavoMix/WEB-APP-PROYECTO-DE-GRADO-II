import { TestBed } from '@angular/core/testing';
import { AuthService, Usuario } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const datos: Usuario = {
    nombre: 'Ana',
    apellido: 'Pérez',
    email: 'Ana.Perez@Example.com',
    telefono: '70012345'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterAll(() => localStorage.clear());

  it('empieza sin sesión iniciada', () => {
    expect(service.estaAutenticado).toBe(false);
    expect(service.usuarioActual).toBeNull();
  });

  it('registra un usuario y deja la sesión abierta', () => {
    const resultado = service.registrar(datos, 'secreta123');

    expect(resultado.ok).toBe(true);
    expect(service.estaAutenticado).toBe(true);
    expect(service.usuarioActual.nombre).toBe('Ana');
  });

  it('nunca expone el hash de la contraseña en la sesión', () => {
    service.registrar(datos, 'secreta123');
    expect((service.usuarioActual as any).passwordHash).toBeUndefined();
  });

  it('rechaza contraseñas demasiado cortas', () => {
    const resultado = service.registrar(datos, '123');

    expect(resultado.ok).toBe(false);
    expect(service.estaAutenticado).toBe(false);
  });

  it('rechaza un correo ya registrado', () => {
    service.registrar(datos, 'secreta123');
    const repetido = service.registrar(datos, 'otraclave123');

    expect(repetido.ok).toBe(false);
  });

  it('permite iniciar sesión con las credenciales correctas', () => {
    service.registrar(datos, 'secreta123');
    service.logout();

    expect(service.login(datos.email, 'secreta123').ok).toBe(true);
    expect(service.estaAutenticado).toBe(true);
  });

  it('trata el correo sin distinguir mayúsculas ni espacios', () => {
    service.registrar(datos, 'secreta123');
    service.logout();

    expect(service.login('  ana.perez@example.com  ', 'secreta123').ok).toBe(true);
  });

  it('rechaza una contraseña incorrecta', () => {
    service.registrar(datos, 'secreta123');
    service.logout();

    expect(service.login(datos.email, 'equivocada').ok).toBe(false);
    expect(service.estaAutenticado).toBe(false);
  });

  it('rechaza un correo que no existe', () => {
    expect(service.login('nadie@example.com', 'loquesea').ok).toBe(false);
  });

  it('cierra la sesión', () => {
    service.registrar(datos, 'secreta123');
    service.logout();

    expect(service.estaAutenticado).toBe(false);
  });

  it('mantiene la sesión al volver a abrir la app', () => {
    service.registrar(datos, 'secreta123');

    const otraInstancia = new AuthService();

    expect(otraInstancia.estaAutenticado).toBe(true);
    expect(otraInstancia.usuarioActual.email).toBe('ana.perez@example.com');
  });
});
