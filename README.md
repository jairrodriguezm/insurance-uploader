# Multiriesgos de Colombia — Frontend Comparativo de Cotizaciones

Aplicación web desarrollada en **Next.js 14+ (App Router), TypeScript y Tailwind CSS** para la ingesta, análisis asistido por Inteligencia Artificial (**Google Gemini 3.6 Flash**) y consolidación automatizada de cotizaciones de seguros en documentos Word (.docx).

---

## Características Principales

* 📤 **Zona Drag & Drop:** Carga simultánea de múltiples cotizaciones en formato PDF o Word (`.docx`).
* ⚡ **Seguimiento en Vivo:** Stepper animado que consulta periódicamente (`polling`) el progreso del análisis sin recargar la página.
* 🛡️ **Indicador de Salud:** Monitoreo constante de la conectividad con el microservicio en Google Cloud Run.
* 💾 **Historial Local:** Almacenamiento en `localStorage` de comparativos recientes para descargas rápidas posteriores.
* 🎨 **Diseño Corporativo:** Estilizado profesional con la paleta de colores de Multiriesgos de Colombia (`#1F3864`).

---

## Requisitos Previos

* **Node.js** v18+ (recomendado v20 o v24).
* **NPM** o gestor de paquetes preferido.

---

## Configuración y Puesta en Marcha

### 1. Variables de Entorno

Crea o edita el archivo `.env.local` en la raíz de `frontend`:

```env
# Por defecto apunta al microservicio desplegado en Google Cloud Run:
NEXT_PUBLIC_API_URL=https://comparativo-seguros-api-972862829792.us-central1.run.app

# Si deseas conectar con tu backend local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre tu navegador en:
👉 **[http://localhost:3000](http://localhost:3000)**

### 3. Compilación para Producción

```bash
npm run build
npm run start
```

---

## Arquitectura de Carpetas

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css         # Estilos globales y paleta corporativa
│   │   ├── layout.tsx          # Layout principal con Header y Footer
│   │   └── page.tsx            # Dashboard y máquina de estados
│   ├── components/
│   │   ├── FileDropzone.tsx    # Carga de archivos y validación
│   │   ├── Header.tsx          # Cabecera con estado de la API
│   │   ├── JobHistory.tsx      # Historial de comparativos recientes
│   │   ├── JobProgress.tsx     # Stepper de avance y polling
│   │   └── JobSuccess.tsx      # Tarjeta de descarga de resultado
│   ├── lib/
│   │   └── api.ts              # Cliente HTTP para llamadas al backend
│   └── types/
│       └── index.ts            # Interfaces TypeScript
├── tailwind.config.ts          # Extensión de colores corporativos
└── package.json
```
