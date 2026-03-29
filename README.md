# Business Case App 🤘

Web app con un asistente de IA con personalidad "ahuevada" que guía al usuario en la creación y seguimiento de business cases.

## Características

- 🤖 **Asistente IA Ahuevado**: Un asistente con personalidad, humor y actitud que te guía paso a paso
- 📊 **Business Case Manager**: Crea, edita y haz seguimiento de ítems de tu business case
- 📈 **Dashboard**: Visualiza el progreso y métricas clave
- 🎨 **UI Moderna**: Interfaz limpia y responsive con Tailwind CSS

## Stack Tecnológico

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: SQLite + Prisma ORM
- **IA**: OpenAI GPT-4 para el asistente

## Estructura del Proyecto

```
business-case-app/
├── client/          # Frontend React
├── server/          # Backend Express
├── prisma/          # Esquema de base de datos
└── README.md
```

## Instalación

```bash
# Instalar dependencias del proyecto raíz
npm install

# Instalar dependencias del servidor
cd server && npm install

# Instalar dependencias del cliente
cd ../client && npm install

# Configurar variables de entorno
cd ../server
cp .env.example .env
# Editar .env con tu OPENAI_API_KEY

# Inicializar base de datos
npx prisma migrate dev --name init
npx prisma generate

# Volver a la raíz y ejecutar en modo desarrollo
cd ..
npm run dev
```

## Desarrollo

```bash
# Ejecutar frontend y backend simultáneamente
npm run dev

# Ejecutar solo el servidor
npm run server

# Ejecutar solo el cliente
npm run client
```

## Variables de Entorno

Crea un archivo `.env` en la carpeta `server/` con:

```
PORT=3001
OPENAI_API_KEY=tu_api_key_aqui
DATABASE_URL="file:./dev.db"
```

## Licencia

MIT
