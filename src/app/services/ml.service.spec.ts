import { similitudCoseno } from './ml.service';

describe('similitudCoseno', () => {

  it('da 1 para dos vectores idénticos', () => {
    const v = [1, 2, 3, 4];
    expect(similitudCoseno(v, v)).toBeCloseTo(1, 5);
  });

  it('da 1 para vectores con la misma dirección aunque tengan distinta magnitud', () => {
    // Es la propiedad clave: el brillo o el tamaño de la foto no deberían
    // cambiar el parecido, solo el patrón de características.
    expect(similitudCoseno([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 5);
  });

  it('da 0 para vectores perpendiculares (sin relación)', () => {
    expect(similitudCoseno([1, 0], [0, 1])).toBeCloseTo(0, 5);
  });

  it('devuelve un valor mayor para el vector más parecido', () => {
    const consulta = [1, 0, 0];
    const parecido = similitudCoseno(consulta, [0.9, 0.1, 0]);
    const distinto = similitudCoseno(consulta, [0, 0.9, 0.1]);

    expect(parecido).toBeGreaterThan(distinto);
  });

  it('devuelve 0 si algún vector falta, está vacío o mide distinto', () => {
    expect(similitudCoseno(null, [1, 2])).toBe(0);
    expect(similitudCoseno([1, 2], null)).toBe(0);
    expect(similitudCoseno([], [])).toBe(0);
    expect(similitudCoseno([1, 2], [1, 2, 3])).toBe(0);
  });

  it('devuelve 0 ante un vector nulo en vez de dividir entre cero', () => {
    expect(similitudCoseno([0, 0, 0], [1, 2, 3])).toBe(0);
  });
});
