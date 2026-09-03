import { TestBed } from '@angular/core/testing';
import { ObjetosService } from './objetos.service';
import { ActividadService } from './actividad.service';
import { Objeto } from '../models/objeto.model';

describe('ObjetosService', () => {
  let service: ObjetosService;

  const objetoBase: Omit<Objeto, 'id'> = {
    name: 'Mochila azul',
    description: 'Mochila azul con llavero',
    category: 'MOCHILAS',
    tipo: 'perdido',
    image: 'data:image/jpeg;base64,xxx'
  };

  beforeEach(() => {
    // Cada prueba parte de un almacenamiento limpio para no depender del orden.
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetosService);
  });

  afterAll(() => localStorage.clear());

  it('separa los objetos por tipo', () => {
    const perdidos = service.getPorTipo('perdido');
    const encontrados = service.getPorTipo('encontrado');

    expect(perdidos.length).toBeGreaterThan(0);
    expect(encontrados.length).toBeGreaterThan(0);
    expect(perdidos.every(o => o.tipo === 'perdido')).toBe(true);
    expect(encontrados.every(o => o.tipo === 'encontrado')).toBe(true);
  });

  it('agrega un objeto con id nuevo y estado activo', () => {
    const total = service.getResumen().total;
    const nuevo = service.agregar(objetoBase);

    expect(nuevo.id).toBeGreaterThan(0);
    expect(nuevo.estado).toBe('activo');
    expect(service.getResumen().total).toBe(total + 1);
  });

  it('nunca reutiliza un id, incluso después de eliminar el último', () => {
    const primero = service.agregar(objetoBase);
    service.eliminar(primero.id);
    const segundo = service.agregar(objetoBase);

    expect(segundo.id).not.toBe(primero.id);
  });

  it('persiste los objetos para que sobrevivan a una recarga', () => {
    const nuevo = service.agregar(objetoBase);

    // Una instancia nueva construida desde cero simula volver a abrir la app:
    // debe leer lo que quedó guardado en localStorage.
    const otraInstancia = new ObjetosService(TestBed.inject(ActividadService));

    expect(otraInstancia.getPorTipo('perdido').some(o => o.id === nuevo.id)).toBe(true);
  });

  it('marca como recuperado y lo refleja en el resumen', () => {
    const nuevo = service.agregar(objetoBase);
    expect(service.getResumen().recuperados).toBe(0);

    service.marcarRecuperado(nuevo.id);

    expect(service.getResumen().recuperados).toBe(1);
    expect(service.getPorTipo('perdido').find(o => o.id === nuevo.id).estado).toBe('recuperado');
  });

  it('ignora marcar como recuperado un id inexistente', () => {
    expect(() => service.marcarRecuperado(999999)).not.toThrow();
    expect(service.getResumen().recuperados).toBe(0);
  });

  it('elimina un objeto del listado', () => {
    const nuevo = service.agregar(objetoBase);
    service.eliminar(nuevo.id);

    expect(service.getPorTipo('perdido').some(o => o.id === nuevo.id)).toBe(false);
  });

  it('cuenta por categoría de mayor a menor', () => {
    const conteo = service.getConteoPorCategoria('perdido');

    expect(conteo.length).toBeGreaterThan(0);
    for (let i = 1; i < conteo.length; i++) {
      expect(conteo[i - 1].cantidad).toBeGreaterThanOrEqual(conteo[i].cantidad);
    }
  });

  describe('buscarSimilares', () => {

    it('ordena por parecido visual cuando hay vectores', () => {
      const consulta = [1, 0, 0];

      service.agregar({ ...objetoBase, name: 'Casi igual', tipo: 'encontrado', featureVector: [0.99, 0.01, 0] });
      service.agregar({ ...objetoBase, name: 'Distinto', tipo: 'encontrado', featureVector: [0, 0.2, 0.98] });

      const resultados = service.buscarSimilares(consulta, 'MOCHILAS', 'encontrado');

      expect(resultados.length).toBeGreaterThan(0);
      expect(resultados[0].objeto.name).toBe('Casi igual');
      expect(resultados[0].porImagen).toBe(true);
    });

    it('marca como no visual la coincidencia por categoría cuando no hay vector', () => {
      // Los objetos de ejemplo no pasaron por el modelo: no deben presentarse
      // como comparación visual.
      const resultados = service.buscarSimilares(null, 'MOCHILAS', 'encontrado');

      expect(resultados.every(c => c.porImagen === false)).toBe(true);
    });

    it('solo devuelve objetos del tipo pedido', () => {
      const resultados = service.buscarSimilares(null, 'MOCHILAS', 'encontrado');
      expect(resultados.every(c => c.objeto.tipo === 'encontrado')).toBe(true);
    });

    it('respeta el límite de resultados', () => {
      expect(service.buscarSimilares(null, 'CUADERNOS', 'encontrado', 1).length).toBeLessThanOrEqual(1);
    });
  });

  describe('buscarSimilaresGlobal', () => {

    it('busca en ambos tipos a la vez', () => {
      service.agregar({ ...objetoBase, name: 'Perdido con vector', tipo: 'perdido', featureVector: [1, 0, 0] });
      service.agregar({ ...objetoBase, name: 'Encontrado con vector', tipo: 'encontrado', featureVector: [0.98, 0.02, 0] });

      const tipos = service.buscarSimilaresGlobal([1, 0, 0]).map(c => c.objeto.tipo);

      expect(tipos).toContain('perdido');
      expect(tipos).toContain('encontrado');
    });

    it('omite los objetos sin vector porque no se pueden comparar visualmente', () => {
      const resultados = service.buscarSimilaresGlobal([1, 0, 0]);
      expect(resultados.every(c => !!c.objeto.featureVector)).toBe(true);
    });
  });
});
