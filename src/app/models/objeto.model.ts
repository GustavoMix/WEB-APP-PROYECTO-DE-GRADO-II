export type TipoObjeto = 'perdido' | 'encontrado';
export type EstadoObjeto = 'activo' | 'recuperado';

export interface Objeto {
  id: number;
  name: string;
  description: string;
  category: string;
  tipo: TipoObjeto;
  image: string;
  estado?: EstadoObjeto;
  location?: string;
  date?: string;
  foundBy?: string;
  cellphone?: string;
  predictionLabel?: string;
  predictionConfidence?: number;
  /** Vector de características de la imagen, usado para buscar objetos parecidos. */
  featureVector?: number[];
}

/** Un objeto junto con qué tan parecido es a la imagen consultada. */
export interface Coincidencia {
  objeto: Objeto;
  score: number;
  /** true si el parecido se calculó comparando las imágenes con el modelo. */
  porImagen: boolean;
}
