import { Injectable } from '@angular/core';
import { Objeto, TipoObjeto } from '../models/objeto.model';

export const CATEGORIAS = [
  'CUADERNOS',
  'LAPICES',
  'BOLIGRAFOS',
  'GOMAS',
  'MOCHILAS',
  'CELULARES',
  'CREDENCIALES',
  'OTROS'
];

const STORAGE_KEY = 'objetos_v2';

const SEED: Objeto[] = [
  { id: 1, tipo: 'perdido', name: 'Cuaderno Extraviado', description: 'Se está buscando un cuaderno que fue extraviado en el salón de clase 204.', image: 'assets/objetos-perdidos/cuaderno.jfif', category: 'CUADERNOS' },
  { id: 2, tipo: 'perdido', name: 'Lápiz Extraviado', description: 'Estamos buscando un lápiz que se perdió cerca de la sección de ciencias en la biblioteca.', image: 'assets/objetos-perdidos/lapiz1.png', category: 'LAPICES' },
  { id: 3, tipo: 'perdido', name: 'Bolígrafo Extraviado', description: 'Se ha perdido un bolígrafo en la cafetería cerca de la máquina dispensadora de bebidas.', image: 'assets/objetos-perdidos/boligrafo.jpg', category: 'BOLIGRAFOS' },
  { id: 4, tipo: 'perdido', name: 'Goma Extraviada', description: 'Se busca una goma que fue extraviada en el pasillo del segundo piso cerca de la sala de conferencias.', image: 'assets/objetos-perdidos/goma.jfif', category: 'GOMAS' },
  { id: 5, tipo: 'perdido', name: 'Cuaderno Extraviado', description: 'Estamos tratando de encontrar un cuaderno que se extravió en la entrada principal del edificio.', image: 'assets/objetos-perdidos/cuaderno1.jfif', category: 'CUADERNOS' },
  { id: 6, tipo: 'perdido', name: 'Lápiz Extraviado', description: 'Se ha perdido un lápiz en los vestidores del gimnasio.', image: 'assets/objetos-perdidos/lapiz1.png', category: 'LAPICES' },
  { id: 7, tipo: 'perdido', name: 'Bolígrafo Extraviado', description: 'Se está buscando un bolígrafo que se perdió en la sala de espera del consultorio médico.', image: 'assets/objetos-perdidos/boligrafo.jpg', category: 'BOLIGRAFOS' },
  { id: 8, tipo: 'perdido', name: 'Goma Extraviada', description: 'Se busca una goma que fue extraviada en la sala de computación de la biblioteca.', image: 'assets/objetos-perdidos/goma.jfif', category: 'GOMAS' },
  { id: 9, tipo: 'perdido', name: 'Cuaderno Extraviado', description: 'Se ha extraviado un cuaderno en el estacionamiento frente al edificio.', image: 'assets/objetos-perdidos/cuaderno1.jfif', category: 'OTROS' },
  { id: 10, tipo: 'perdido', name: 'Lápiz Extraviado', description: 'Estamos buscando un lápiz que se perdió en el autobús escolar número 12.', image: 'assets/objetos-perdidos/lapiz1.png', category: 'OTROS' },
  { id: 11, tipo: 'perdido', name: 'Bolígrafo Extraviado', description: 'Se perdió un bolígrafo en la sala de espera del consultorio dental.', image: 'assets/objetos-perdidos/boligrafo.jpg', category: 'OTROS' },
  { id: 12, tipo: 'perdido', name: 'Goma Extraviada', description: 'Se busca una goma que fue extraviada en el parque cercano al edificio.', image: 'assets/objetos-perdidos/goma.jfif', category: 'OTROS' },
  { id: 13, tipo: 'perdido', name: 'Mochila Extraviada', description: 'Se está buscando una mochila que fue extraviada en la cancha de futbol.', image: 'assets/objetos-perdidos/mochila.jfif', category: 'MOCHILAS' },
  { id: 14, tipo: 'perdido', name: 'Credencial Extraviada', description: 'Se ha extraviado una credencial en el auditorio del edificio.', image: 'assets/objetos-perdidos/carnet.JPG', category: 'CREDENCIALES' },
  { id: 15, tipo: 'perdido', name: 'Celular Extraviado', description: 'Este celular fue extraviado en las escaleras del primer piso.', image: 'assets/objetos-perdidos/celular.jpg', category: 'CELULARES' },

  { id: 16, tipo: 'encontrado', name: 'Cuaderno Encontrado', description: 'Este cuaderno fue encontrado en el salón de clase 204.', image: 'assets/objetos-perdidos/cuaderno.jfif', category: 'CUADERNOS' },
  { id: 17, tipo: 'encontrado', name: 'Lápiz Encontrado', description: 'Este lápiz fue encontrado en la biblioteca cerca de la sección de ciencias.', image: 'assets/objetos-perdidos/lapiz1.png', category: 'LAPICES' },
  { id: 18, tipo: 'encontrado', name: 'Bolígrafo Encontrado', description: 'Este bolígrafo fue encontrado en la cafetería cerca de la máquina dispensadora de bebidas.', image: 'assets/objetos-perdidos/boligrafo.jpg', category: 'BOLIGRAFOS' },
  { id: 19, tipo: 'encontrado', name: 'Goma Encontrada', description: 'Esta goma fue encontrada en el pasillo del segundo piso cerca de la sala de conferencias.', image: 'assets/objetos-perdidos/goma.jfif', category: 'GOMAS' },
  { id: 20, tipo: 'encontrado', name: 'Cuaderno Encontrado', description: 'Este cuaderno fue encontrado en la entrada principal del edificio.', image: 'assets/objetos-perdidos/cuaderno1.jfif', category: 'CUADERNOS' },
  { id: 21, tipo: 'encontrado', name: 'Lápiz Encontrado', description: 'Este lápiz fue encontrado en los vestidores del gimnasio.', image: 'assets/objetos-perdidos/lapiz1.png', category: 'LAPICES' },
  { id: 22, tipo: 'encontrado', name: 'Bolígrafo Encontrado', description: 'Este bolígrafo fue encontrado en la sala de espera del consultorio médico.', image: 'assets/objetos-perdidos/boligrafo.jpg', category: 'BOLIGRAFOS' },
  { id: 23, tipo: 'encontrado', name: 'Goma Encontrada', description: 'Esta goma fue encontrada en la sala de computación de la biblioteca.', image: 'assets/objetos-perdidos/goma.jfif', category: 'GOMAS' },
  { id: 24, tipo: 'encontrado', name: 'Cuaderno Encontrado', description: 'Este cuaderno fue encontrado en el estacionamiento frente al edificio.', image: 'assets/objetos-perdidos/cuaderno1.jfif', category: 'OTROS' },
  { id: 25, tipo: 'encontrado', name: 'Lápiz Encontrado', description: 'Este lápiz fue encontrado en el autobús escolar número 12.', image: 'assets/objetos-perdidos/lapiz1.png', category: 'OTROS' },
  { id: 26, tipo: 'encontrado', name: 'Bolígrafo Encontrado', description: 'Este bolígrafo fue encontrado en la sala de espera del consultorio dental.', image: 'assets/objetos-perdidos/boligrafo.jpg', category: 'OTROS' },
  { id: 27, tipo: 'encontrado', name: 'Goma Encontrada', description: 'Esta goma fue encontrada en el parque cercano al edificio.', image: 'assets/objetos-perdidos/goma.jfif', category: 'OTROS' },
  { id: 28, tipo: 'encontrado', name: 'Mochila Encontrada', description: 'Esta mochila fue encontrada en la cancha de futbol.', image: 'assets/objetos-perdidos/mochila.jfif', category: 'MOCHILAS' },
  { id: 29, tipo: 'encontrado', name: 'Credencial Encontrada', description: 'Esta credencial fue encontrada en el auditorio del edificio.', image: 'assets/objetos-perdidos/carnet.JPG', category: 'CREDENCIALES' },
  { id: 30, tipo: 'encontrado', name: 'Celular Encontrado', description: 'Este celular fue encontrado en las escaleras del primer piso.', image: 'assets/objetos-perdidos/celular.jpg', category: 'CELULARES' },
];

@Injectable({
  providedIn: 'root'
})
export class ObjetosService {

  private objetos: Objeto[];

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.objetos = stored ? JSON.parse(stored) : SEED;
    if (!stored) {
      this.persist();
    }
  }

  getPorTipo(tipo: TipoObjeto): Objeto[] {
    return this.objetos.filter(o => o.tipo === tipo);
  }

  agregar(objeto: Omit<Objeto, 'id'>): Objeto {
    const nuevo: Objeto = { ...objeto, id: this.nextId() };
    this.objetos.push(nuevo);
    this.persist();
    return nuevo;
  }

  private nextId(): number {
    return this.objetos.reduce((max, o) => Math.max(max, o.id), 0) + 1;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.objetos));
  }
}
