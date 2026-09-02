import { Injectable } from '@angular/core';

export interface ActividadEntry {
  id: number;
  accion: string;
  detalle: string;
  fecha: string;
}

const STORAGE_KEY = 'actividad_v1';
const MAX_ENTRADAS = 200;

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private entradas: ActividadEntry[];

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.entradas = stored ? JSON.parse(stored) : [];
  }

  registrar(accion: string, detalle: string): void {
    const entrada: ActividadEntry = {
      id: this.entradas.length ? Math.max(...this.entradas.map(e => e.id)) + 1 : 1,
      accion,
      detalle,
      fecha: new Date().toISOString()
    };

    this.entradas.unshift(entrada);
    this.entradas = this.entradas.slice(0, MAX_ENTRADAS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entradas));
  }

  listar(limite = 20): ActividadEntry[] {
    return this.entradas.slice(0, limite);
  }
}
