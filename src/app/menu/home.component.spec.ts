import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';
import { ObjetosService } from '../services/objetos.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    localStorage.clear();
    // La plantilla usa routerLink, así que necesita el router de pruebas.
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => localStorage.clear());

  it('se crea correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el resumen real de objetos registrados', () => {
    const esperado = TestBed.inject(ObjetosService).getResumen();

    expect(component.resumen.total).toBe(esperado.total);
    expect(component.resumen.total).toBe(component.resumen.perdidos + component.resumen.encontrados);
  });

  it('enlaza a la búsqueda por foto', () => {
    const enlaces = Array.from(fixture.nativeElement.querySelectorAll('a'))
      .map((a: HTMLAnchorElement) => a.getAttribute('href'));

    expect(enlaces.some(href => href && href.includes('buscar'))).toBe(true);
  });
});
