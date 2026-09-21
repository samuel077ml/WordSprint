# Fichero

App de vocabulario en inglés organizada por categorías (Deportes, Comida, Formal, Negocios, Estudios), con 4 tipos de reto (opción múltiple, escribir, escuchar, ordenar) y una ronda de emparejar al cierre.

## Cómo abrirlo

1. Descomprime esta carpeta donde quieras (ej: Escritorio).
2. Ábrela en VS Code (`Archivo > Abrir carpeta`).
3. En la terminal de VS Code, instala las dependencias (esto regenera `node_modules`, que nunca se sube a Git):
   ```
   npm install
   ```
4. Levanta el servidor local:
   ```
   npm run dev
   ```
5. Abre `http://localhost:3000` en tu navegador.

## Estructura

- `app/page.tsx` — pantalla principal con las tarjetas de categoría
- `app/components/Challenge.tsx` — motor de retos (opción múltiple, escribir, escuchar, ordenar)
- `app/components/MatchingRound.tsx` — mini-juego de emparejar al terminar una categoría
- `app/lib/vocabData.ts` — todas las palabras, traducciones y oraciones de ejemplo
- `app/globals.css` — paleta de colores del tema oscuro
