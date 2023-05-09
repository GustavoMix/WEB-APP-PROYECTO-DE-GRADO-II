import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroObjetosComponent } from './registro-objetos.component';

describe('RegistroObjetosComponent', () => {
  let component: RegistroObjetosComponent;
  let fixture: ComponentFixture<RegistroObjetosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroObjetosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroObjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
