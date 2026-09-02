import { Injectable } from '@angular/core';
import { Coincidencia, Objeto, TipoObjeto } from '../models/objeto.model';
import { similitudCoseno } from './ml.service';
import { ActividadService } from './actividad.service';

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

  constructor(private actividadService: ActividadService) {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.objetos = stored ? JSON.parse(stored) : SEED;
    if (!stored) {
      this.persist();
    }
  }

  getPorTipo(tipo: TipoObjeto): Objeto[] {
    return this.objetos.filter(o => o.tipo === tipo);
  }

  getTodos(): Objeto[] {
    return this.objetos.filter(o => o.image);
  }

  getResumen(): { total: number; perdidos: number; encontrados: number; recuperados: number } {
    const perdidos = this.getPorTipo('perdido').length;
    const encontrados = this.getPorTipo('encontrado').length;
    const recuperados = this.objetos.filter(o => o.estado === 'recuperado').length;
    return { total: perdidos + encontrados, perdidos, encontrados, recuperados };
  }

  /** Cantidad de objetos por categoría, de mayor a menor. */
  getConteoPorCategoria(tipo: TipoObjeto): { categoria: string; cantidad: number }[] {
    const conteo: { [categoria: string]: number } = {};
    this.getPorTipo(tipo).forEach(o => {
      conteo[o.category] = (conteo[o.category] || 0) + 1;
    });

    return Object.keys(conteo)
      .map(categoria => ({ categoria, cantidad: conteo[categoria] }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  agregar(objeto: Omit<Objeto, 'id'>): Objeto {
    const nuevo: Objeto = { ...objeto, id: this.nextId(), estado: 'activo' };
    this.objetos.push(nuevo);
    this.persist();

    this.actividadService.registrar(
      objeto.tipo === 'perdido' ? 'Objeto extraviado registrado' : 'Objeto encontrado registrado',
      `${objeto.name} · ${objeto.category}`
    );

    return nuevo;
  }

  marcarRecuperado(id: number): void {
    const objeto = this.objetos.find(o => o.id === id);
    if (!objeto || objeto.estado === 'recuperado') {
      return;
    }

    objeto.estado = 'recuperado';
    this.persist();
    this.actividadService.registrar('Objeto recuperado', `${objeto.name} · ${objeto.category}`);
  }

  /** Busca coincidencias en toda la base (perdidos y encontrados), sin filtrar por tipo. */
  buscarSimilaresGlobal(vector: number[], limite = 8): Coincidencia[] {
    const candidatos = this.objetos.filter(o => o.image && o.featureVector && o.featureVector.length);

    return candidatos
      .map(objeto => ({
        objeto,
        score: similitudCoseno(vector, objeto.featureVector),
        porImagen: true
      }))
      .filter(c => c.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limite);
  }

  /**
   * Busca los objetos más parecidos a una imagen recién subida.
   *
   * Si el objeto guardado tiene vector de características se compara imagen
   * contra imagen (similitud del coseno). Los objetos de ejemplo no lo
   * tienen, así que para esos se usa una heurística por categoría y nombre,
   * que sirve de respaldo pero se marca como tal.
   */
  buscarSimilares(
    vector: number[],
    categoria: string,
    tipo: TipoObjeto,
    limite = 4
  ): Coincidencia[] {
    const candidatos = this.objetos.filter(o => o.tipo === tipo && o.image);

    const coincidencias: Coincidencia[] = candidatos.map(objeto => {
      if (vector && vector.length && objeto.featureVector && objeto.featureVector.length) {
        return {
          objeto,
          score: similitudCoseno(vector, objeto.featureVector),
          porImagen: true
        };
      }

      return {
        objeto,
        score: categoria && objeto.category === categoria ? 0.55 : 0.1,
        porImagen: false
      };
    });

    return coincidencias
      .filter(c => c.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limite);
  }

  private nextId(): number {
    return this.objetos.reduce((max, o) => Math.max(max, o.id), 0) + 1;
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.objetos));
  }
}
