/**
 * Las fotos de celular pesan varios MB y se guardan como data URL dentro de
 * localStorage, que tiene un límite aproximado de 5 MB en total. Sin reducirlas,
 * bastan tres o cuatro registros para llenar el almacenamiento y que la app
 * deje de guardar.
 *
 * Aquí se redimensiona la imagen a un lado máximo y se recomprime a JPEG antes
 * de guardarla. La imagen original nunca se persiste.
 */

const LADO_MAXIMO = 800;
const CALIDAD = 0.7;

export function comprimirImagen(dataUrl: string, ladoMaximo = LADO_MAXIMO, calidad = CALIDAD): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const escala = Math.min(1, ladoMaximo / Math.max(img.width, img.height));
      const ancho = Math.round(img.width * escala);
      const alto = Math.round(img.height * escala);

      const canvas = document.createElement('canvas');
      canvas.width = ancho;
      canvas.height = alto;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, ancho, alto);

      try {
        resolve(canvas.toDataURL('image/jpeg', calidad));
      } catch (e) {
        // Si el navegador bloquea la exportación del canvas, se usa la original.
        resolve(dataUrl);
      }
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
