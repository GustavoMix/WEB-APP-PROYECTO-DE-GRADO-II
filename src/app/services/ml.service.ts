import { Injectable } from '@angular/core';
import * as ml5 from 'ml5';

/**
 * Encapsula el uso de MobileNet (vía ml5) para:
 *  - clasificar una imagen (qué objeto es)
 *  - extraer su vector de características, que permite comparar dos
 *    imágenes entre sí y calcular qué tan parecidas son.
 *
 * El modelo se carga una sola vez y se reutiliza, porque la descarga
 * inicial pesa varios MB.
 */
@Injectable({
  providedIn: 'root'
})
export class MlService {

  private clasificadorPromise: Promise<any> = null;
  private extractorPromise: Promise<any> = null;

  private getClasificador(): Promise<any> {
    if (!this.clasificadorPromise) {
      this.clasificadorPromise = ml5.imageClassifier('MobileNet');
    }
    return this.clasificadorPromise;
  }

  private getExtractor(): Promise<any> {
    if (!this.extractorPromise) {
      this.extractorPromise = new Promise((resolve, reject) => {
        try {
          const extractor = ml5.featureExtractor('MobileNet', () => resolve(extractor));
        } catch (e) {
          reject(e);
        }
      });
    }
    return this.extractorPromise;
  }

  /** Carga una data URL en un elemento <img> ya renderizado en memoria. */
  cargarImagen(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.src = dataUrl;
    });
  }

  /** Devuelve la predicción principal de MobileNet para la imagen. */
  clasificar(img: HTMLImageElement): Promise<{ label: string, confidence: number }> {
    return this.getClasificador().then(modelo => new Promise<any>((resolve, reject) => {
      modelo.classify(img, (err, results) => {
        if (err || !results || !results.length) {
          reject(err || new Error('Sin resultados'));
          return;
        }
        resolve(results[0]);
      });
    }));
  }

  /**
   * Extrae el vector de características de la imagen. Se redondea a 4
   * decimales para que ocupe menos al guardarlo.
   */
  async extraerVector(img: HTMLImageElement): Promise<number[]> {
    const extractor = await this.getExtractor();
    const tensor = extractor.infer(img);
    try {
      const datos = await tensor.data();
      return Array.from(datos as Float32Array).map(v => Math.round(v * 10000) / 10000);
    } finally {
      if (tensor && typeof tensor.dispose === 'function') {
        tensor.dispose();
      }
    }
  }
}

/**
 * Similitud del coseno entre dos vectores: 1 = idénticos, 0 = sin relación.
 */
export function similitudCoseno(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || !a.length) {
    return 0;
  }

  let producto = 0;
  let normaA = 0;
  let normaB = 0;

  for (let i = 0; i < a.length; i++) {
    producto += a[i] * b[i];
    normaA += a[i] * a[i];
    normaB += b[i] * b[i];
  }

  if (normaA === 0 || normaB === 0) {
    return 0;
  }

  return producto / (Math.sqrt(normaA) * Math.sqrt(normaB));
}
