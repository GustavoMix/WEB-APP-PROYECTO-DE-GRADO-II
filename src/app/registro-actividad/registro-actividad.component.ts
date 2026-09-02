import { Component, OnInit } from '@angular/core';
import { ActividadEntry, ActividadService } from '../services/actividad.service';

@Component({
  selector: 'app-registro-actividad',
  templateUrl: './registro-actividad.component.html',
  styleUrls: ['./registro-actividad.component.css']
})
export class RegistroActividadComponent implements OnInit {

  limite = 10;
  actividades: ActividadEntry[] = [];

  constructor(private actividadService: ActividadService) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.actividades = this.actividadService.listar(this.limite);
  }
}
