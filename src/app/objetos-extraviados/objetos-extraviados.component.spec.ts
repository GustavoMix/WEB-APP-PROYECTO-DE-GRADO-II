import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetosExtraviadosComponent } from './objetos-extraviados.component';

describe('ObjetosExtraviadosComponent', () => {
  let component: ObjetosExtraviadosComponent;
  let fixture: ComponentFixture<ObjetosExtraviadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetosExtraviadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetosExtraviadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
