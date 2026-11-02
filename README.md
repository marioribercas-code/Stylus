# 👔 STYLUS — Moda Masculina & Armario Inteligente con IA

Aplicación de estilismo masculino, gestión de armario y asesoría de compras con IA, basada en ingeniería inversa de las mejores apps del mercado (Acloset, Cladwell, Whering, STY AI, StyleGenAI) combinadas con teoría sartorial (colorimetría 12 estaciones, morfología masculina, reglas de proporción y formalidad).

---

## 🚀 Cómo Iniciar la App en Desarrollo (Navegador / Móvil)

1. Abre una terminal en esta carpeta:
```bash
cd c:\Users\mario\Downloads\stylus-app
```

2. Arranca el servidor de desarrollo Vite:
```bash
npm run dev
```

3. Abre el enlace local en tu navegador (ej: `http://localhost:5173`).
   - Puedes abrirlo desde tu móvil en la misma red Wi-Fi introduciendo la IP local que muestra Vite (`http://192.168.x.x:5173`).
   - Puedes añadirla a la pantalla de inicio como PWA (icono directo como app nativa).

---

## 📱 Cómo Generar el APK para Instalar en Android

La app está preparada con **Capacitor Android**:

1. Compila la app y sincroniza con el proyecto Android:
```bash
npm run build
npx cap add android
npx cap sync android
```

2. Para generar el archivo `.apk` de depuración instalable:
   - **Opción A (Con Android Studio instalado)**:
     ```bash
     npx cap open android
     ```
     En Android Studio, ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)**. El APK resultante estará en `android/app/build/outputs/apk/debug/app-debug.apk`.
   
   - **Opción B (Línea de comandos con Gradle)**:
     ```bash
     cd android
     ./gradlew assembleDebug
     ```
     Y se genera directamente `app-debug.apk` listo para enviar por WhatsApp / Drive / Telegram a tu teléfono e instalarlo.

---

## ✨ Módulos y Funcionalidades Incluidas

### 1. 🏠 Inicio (Dashboard Diario & Look del Día)
- Saludo personalizado según hora y nombre.
- Integración meteorológica en vivo (Open-Meteo) con consejos de vestimenta por capas según temperatura y lluvia.
- **Look recomendado del día**: Algoritmo de rotación que selecciona un conjunto equilibrado de tu armario y calcula su puntuación de armonía de color.
- Botón **"Me lo pongo hoy"** que registra el outfit en el calendario y suma +1 al contador de puestas para amortizar el coste de la ropa.

### 2. 👕 Armario Digital (Wardrobe)
- Catálogo visual Dark Luxury de prendas masculinas (Superiores, Inferiores, Chaquetas/Capas, Calzado y Accesorios).
- Contador de usos y **Coste Por Uso (CPW)** en tiempo real (`Precio ÷ Puestas = €/uso`).
- Marcador de prendas en lavandería y favoritos.
- Modal de **Digitalización de Prenda con IA**: Permite subir fotos o capturar con cámara y calcula el color dominante mediante canvas.

### 3. 🎲 Generador de Looks & Ruleta Clueless
- Modo **Ruleta Tragamonedas (Cher Horowitz / Whering Style)**: 4 carretes horizontales (Chaqueta, Arriba, Pantalón, Calzado).
- **Botón de Candado (Lock)** en cada prenda: Permite fijar tu americana favorita y mezclar el resto hasta encontrar combinaciones inesperadas.
- Puntuación de Armonía de Color y compatibilidad de formalidades en tiempo real.
- Modo Galería de Looks guardados.

### 4. 🛍️ Personal Shopper IA (Fase 2 Completa)
- **Evaluador "¿Me lo compro?"**: Introduce cualquier prenda que veas en una tienda (nombre, precio, marca, color) y la IA evalúa:
  - Cuántos outfits nuevos desbloqueará con tu armario actual.
  - Compatibilidad con tu paleta estacional de colorimetría.
  - Rentabilidad proyectada (coste estimado por puesta).
  - Veredicto oficial (Compra Maestra, Buena Inversión, o Compra Redundante/Evitar).
- **Qué comprarte (Wardrobe Gap Analysis)**: Detecta las prendas esenciales que le faltan a tu armario cápsula (ej. mocasines penny loafers marrones, sobrecamisa beige de entretiempo, pantalón blanco roto) y calcula su impacto multiplicador.
- **Wishlist Evaluada**: Historial de prendas candidatas listas para cuando vayas de compras.

### 5. 🎨 Centro de Inteligencia de Estilo & Morfología
- **Colorimetría Personal de 12 Estaciones**: Análisis profundo (Otoño Oscuro, Invierno Frío, etc.) con Power Colors, neutros base y colores a evitar.
- **Simulador de Draping Digital**: Prueba diferentes tonalidades sobre un simulador facial para ver el impacto en tu piel.
- **Morfología Masculina**: Reglas de sastrería y proporciones según tu tipo de cuerpo (Trapecio, Triángulo Invertido, Rectángulo, Triángulo, Óvalo).
- **Stylus AI (Chat Conversacional)**: Estilista personal satorial para resolver cualquier duda de etiqueta, primera cita, boda o eventos específicos.
- **Calendario de Outfits**: Registro histórico de lo que has vestido cada día.
