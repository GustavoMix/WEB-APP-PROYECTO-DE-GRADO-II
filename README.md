# Sistema de Registro y Búsqueda de Objetos Perdidos

Aplicación web para la Unidad Educativa 25 de Mayo que permite registrar objetos
extraviados y encontrados, y **buscarlos comparando fotografías mediante
reconocimiento de imágenes**.

**Demo en línea:** https://gustavomix.github.io/WEB-APP-PROYECTO-DE-GRADO-II/

---

## 1. Qué problema resuelve

Cuando alguien pierde un objeto dentro de la institución, la búsqueda depende de
preguntar de boca en boca. Este sistema centraliza los reportes y agrega una
capa de reconocimiento visual: en lugar de describir con palabras lo que se
perdió, el usuario **sube una foto** y el sistema le muestra los objetos
registrados que más se le parecen.

## 2. Cómo funciona el reconocimiento de imágenes

Se usa **MobileNet** (una red neuronal convolucional preentrenada sobre
ImageNet) a través de la librería **ml5.js**, ejecutándose por completo en el
navegador. El modelo se aprovecha de dos formas distintas:

| Uso | Qué produce | Dónde se aplica |
|---|---|---|
| **Clasificación** | La etiqueta del objeto y su nivel de confianza | Al registrar: identifica el objeto y sugiere la categoría |
| **Extracción de características** | Un vector numérico que describe la imagen | Al buscar: permite comparar dos fotos entre sí |

### Clasificación y sugerencia de categoría

MobileNet devuelve etiquetas de ImageNet en inglés y muy específicas
(`"ballpoint, ballpoint pen, ballpen, Biro"`). Esas etiquetas se traducen a las
categorías del sistema mediante un mapeo de palabras clave
(`src/app/models/clasificacion.ts`), de modo que el usuario ve *"Bolígrafo,
92% de confianza"* y el formulario preselecciona la categoría `BOLIGRAFOS`.
Si la etiqueta no corresponde a ninguna categoría conocida, cae en `OTROS`.

### Búsqueda por similitud visual

Para comparar imágenes no se usa la etiqueta, sino el **vector de
características** que la red genera antes de la capa de clasificación. Dos fotos
del mismo objeto producen vectores cercanos aunque cambie la iluminación o el
encuadre.

La comparación se hace con **similitud del coseno**:

```
similitud(A, B) = (A · B) / (‖A‖ · ‖B‖)
```

El resultado va de 0 (sin relación) a 1 (idénticos). Se usa el coseno y no la
distancia euclidiana porque **solo interesa la dirección del vector, no su
magnitud**: así el brillo o el tamaño de la foto no alteran el parecido.

El vector se guarda junto al objeto, de modo que la comparación posterior es
solo aritmética y no requiere volver a ejecutar la red.

### Limitación importante y honesta

El sistema reconoce **el tipo de objeto**, no la identidad del objeto concreto:
distingue una mochila de un celular, pero no distingue *tu* mochila de otra
mochila del mismo modelo. La similitud visual ordena los candidatos por
parecido; la verificación final la hace una persona.

Además, los 30 objetos de ejemplo precargados **no tienen vector** (nunca
pasaron por el modelo). Para ellos el sistema cae en una coincidencia por
categoría, y la interfaz lo indica explícitamente ("por categoría" en vez de
"de parecido visual") para no aparentar un análisis que no ocurrió.

## 3. Arquitectura

```
src/app/
├── models/                     Tipos de datos y lógica pura
│   ├── objeto.model.ts         Objeto, Coincidencia, tipos y estados
│   └── clasificacion.ts        Traducción etiqueta ImageNet → categoría
├── services/                   Lógica de negocio (sin interfaz)
│   ├── objetos.service.ts      Fuente única de datos + búsqueda por similitud
│   ├── ml.service.ts           Carga de MobileNet, clasificación y vectores
│   ├── auth.service.ts         Sesión de usuario
│   ├── actividad.service.ts    Bitácora de acciones
│   └── imagen.util.ts          Compresión de fotos antes de almacenarlas
├── menu/                       Inicio
├── listado-objetos/            Listado (reutilizado por extraviados y encontrados)
├── registro-objetos/           Alta de objetos + detección por IA
├── buscar-foto/                Búsqueda por fotografía
├── estadisticas/               Métricas calculadas sobre los datos reales
├── registro-actividad/         Historial de acciones
├── login/                      Registro e inicio de sesión
└── contactos/                  Información institucional
```

**Decisiones de diseño relevantes:**

- **Fuente única de datos.** Todas las pantallas leen de `ObjetosService`. No hay
  listas duplicadas: registrar un objeto se refleja de inmediato en los listados
  y en las estadísticas.
- **Un solo componente de listado.** Las rutas `/perdidos` y `/course` usan el
  mismo `ListadoObjetosComponent`; el tipo de objeto y los textos viajan en la
  configuración de la ruta (`data`). Antes eran dos componentes con el mismo
  código duplicado.
- **La lógica pura vive fuera de los componentes.** La similitud del coseno y el
  mapeo de categorías son funciones puras, lo que permite probarlas sin navegador.
- **Compresión antes de almacenar.** Las fotos se redimensionan a 800 px y se
  recomprimen a JPEG. Sin esto, unas pocas fotos de celular llenan el
  almacenamiento del navegador (~5 MB) y los registros se pierden.

## 4. Persistencia: estado actual y siguiente paso

Los datos se guardan en el **`localStorage` del navegador**. Esto significa que
**cada dispositivo tiene su propia copia**: lo que se registra en un celular no
se ve desde otro.

Es suficiente para demostrar el funcionamiento completo, pero para un uso real
en la institución hace falta un backend (por ejemplo **Supabase**, que aportaría
base de datos compartida, autenticación real y almacenamiento de imágenes).

De igual forma, `AuthService` **no constituye seguridad real**: los usuarios se
guardan en el navegador y la contraseña solo lleva un hash simple que evita el
texto plano, pero no resiste un ataque. Está documentado así en el propio código.

## 5. Ejecutar el proyecto

Requisitos: **Node.js 14–18** y npm.

```bash
npm install --legacy-peer-deps
npm start
```

La aplicación queda en `http://localhost:4200/`.

> **Nota sobre versiones de Node.** El proyecto usa Angular 10 (webpack 4), que
> es incompatible con el proveedor criptográfico de Node 17+. Con versiones
> modernas de Node el build falla con `error:0308010C:digital envelope routines::unsupported`.
> Solución:
>
> ```bash
> export NODE_OPTIONS=--openssl-legacy-provider   # Windows: set NODE_OPTIONS=--openssl-legacy-provider
> ```

### Compilar para producción

```bash
npm run build -- --configuration production
```

### Pruebas unitarias

```bash
npm test                                  # Con navegador visible
npm test -- --watch=false --browsers=ChromeHeadlessCI   # Modo CI, sin interfaz
```

Las pruebas cubren la lógica central: similitud del coseno, mapeo de categorías,
`ObjetosService` (alta, baja, recuperación, búsqueda por similitud, persistencia),
`AuthService` y los componentes principales.

## 6. Despliegue

El despliegue es automático: cada cambio integrado a `main` dispara el workflow
`.github/workflows/deploy-gh-pages.yml`, que compila el proyecto y publica el
resultado en la rama `gh-pages`, servida por GitHub Pages.

El routing usa `useHash: true` porque GitHub Pages es hosting estático sin
reescritura de rutas: sin el hash, recargar la página en una ruta interna
devolvería un 404.

## 7. Tecnologías

| Componente | Tecnología |
|---|---|
| Framework | Angular 10 |
| Lenguaje | TypeScript |
| Estilos | CSS + Bootstrap 4 |
| Reconocimiento de imágenes | ml5.js sobre MobileNet (TensorFlow.js) |
| Persistencia | localStorage del navegador |
| Pruebas | Karma + Jasmine |
| Despliegue | GitHub Actions + GitHub Pages |
