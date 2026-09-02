/**
 * MobileNet devuelve etiquetas de ImageNet en inglés (por ejemplo
 * "ballpoint, ballpoint pen, ballpen, Biro"). Aquí se traducen a las
 * categorías que maneja el sistema y a un nombre legible en español.
 */

export interface Deteccion {
  categoria: string;
  nombre: string;
  confianza: number;
  etiquetaOriginal: string;
}

interface ReglaCategoria {
  categoria: string;
  nombre: string;
  claves: string[];
}

const REGLAS: ReglaCategoria[] = [
  { categoria: 'CUADERNOS', nombre: 'Cuaderno', claves: ['notebook', 'binder', 'ring-binder', 'book jacket', 'comic book', 'menu', 'envelope', 'diary'] },
  { categoria: 'LAPICES', nombre: 'Lápiz', claves: ['pencil', 'pencil sharpener', 'pencil box', 'crayon'] },
  { categoria: 'BOLIGRAFOS', nombre: 'Bolígrafo', claves: ['ballpoint', 'fountain pen', 'quill', 'marker', 'biro'] },
  { categoria: 'GOMAS', nombre: 'Goma de borrar', claves: ['rubber eraser', 'eraser', 'rubber'] },
  { categoria: 'MOCHILAS', nombre: 'Mochila', claves: ['backpack', 'knapsack', 'rucksack', 'packsack', 'haversack', 'purse', 'sleeping bag', 'mailbag', 'plastic bag', 'shopping basket'] },
  { categoria: 'CELULARES', nombre: 'Celular', claves: ['cellular telephone', 'cellular phone', 'cellphone', 'mobile phone', 'ipod', 'hand-held computer', 'remote control', 'modem', 'dial telephone'] },
  { categoria: 'CREDENCIALES', nombre: 'Credencial', claves: ['wallet', 'billfold', 'notecase', 'pocketbook', 'credit card', 'identity card', 'badge', 'book cover'] },
];

/**
 * Traduce el resultado crudo de ml5/MobileNet a una detección utilizable.
 * Si la etiqueta no coincide con ninguna regla se cae a la categoría OTROS.
 */
export function interpretarPrediccion(label: string, confidence: number): Deteccion {
  const etiqueta = (label || '').toLowerCase();

  for (const regla of REGLAS) {
    if (regla.claves.some(clave => etiqueta.includes(clave))) {
      return {
        categoria: regla.categoria,
        nombre: regla.nombre,
        confianza: confidence,
        etiquetaOriginal: label
      };
    }
  }

  return {
    categoria: 'OTROS',
    nombre: 'Objeto no identificado',
    confianza: confidence,
    etiquetaOriginal: label
  };
}
