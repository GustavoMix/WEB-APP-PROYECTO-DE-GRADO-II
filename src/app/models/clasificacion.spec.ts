import { interpretarPrediccion } from './clasificacion';

describe('interpretarPrediccion', () => {

  it('traduce una etiqueta de ImageNet a la categoría del sistema', () => {
    const deteccion = interpretarPrediccion('ballpoint, ballpoint pen, ballpen, Biro', 0.92);

    expect(deteccion.categoria).toBe('BOLIGRAFOS');
    expect(deteccion.nombre).toBe('Bolígrafo');
    expect(deteccion.confianza).toBe(0.92);
  });

  it('reconoce la etiqueta sin importar mayúsculas', () => {
    expect(interpretarPrediccion('BACKPACK', 0.5).categoria).toBe('MOCHILAS');
  });

  it('identifica la categoría aunque la palabra clave esté en medio de la etiqueta', () => {
    expect(interpretarPrediccion('cellular telephone, cellphone', 0.7).categoria).toBe('CELULARES');
  });

  it('cae en OTROS cuando la etiqueta no corresponde a ninguna categoría conocida', () => {
    const deteccion = interpretarPrediccion('golden retriever', 0.99);

    expect(deteccion.categoria).toBe('OTROS');
    expect(deteccion.nombre).toBe('Objeto no identificado');
  });

  it('conserva la etiqueta original para poder auditar la predicción', () => {
    expect(interpretarPrediccion('rubber eraser', 0.4).etiquetaOriginal).toBe('rubber eraser');
  });

  it('no falla si el modelo devuelve una etiqueta vacía', () => {
    expect(() => interpretarPrediccion('', 0)).not.toThrow();
    expect(interpretarPrediccion('', 0).categoria).toBe('OTROS');
  });
});
