export type TipoObjeto = 'perdido' | 'encontrado';

export interface Objeto {
  id: number;
  name: string;
  description: string;
  category: string;
  tipo: TipoObjeto;
  image: string;
  location?: string;
  date?: string;
  foundBy?: string;
  cellphone?: string;
  predictionLabel?: string;
  predictionConfidence?: number;
}
