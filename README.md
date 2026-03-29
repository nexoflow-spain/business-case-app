# Business Case App 🤘

Web app con un asistente de IA con personalidad "ahuevada" que guía al usuario en la creación y seguimiento de business cases.

**🚀 Demo en vivo:** [https://business-case-app.up.railway.app](https://business-case-app.up.railway.app) (ejemplo)

## Características

- 🤖 **Asistente IA Ahuevado**: Un asistente con personalidad, humor y actitud que te guía paso a paso
- 📊 **Business Case Manager**: Crea, edita y haz seguimiento de ítems de tu business case
- 📈 **Dashboard**: Visualiza el progreso y métricas clave
- 🎨 **UI Moderna**: Interfaz limpia y responsive con Tailwind CSS

## Stack Tecnológico

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL + Prisma ORM
- **IA**: OpenAI GPT-4 para el asistente

## Despliegue Rápido

### Opción 1: Railway (Recomendada)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/xyz)

1. Cuenta en [Railway](https://railway.app)
2. Fork este repo
3. Deploy desde GitHub
4. Agrega PostgreSQL y variables de entorno

### Opción 2: Render
1. Cuenta en [Render](https://render.com)
2. New Web Service → conecta tu repo
3. Build: `npm install && cd client && npm install && npm run build`
4. Start: `cd server && npm start`

**📖 [Guía completa de despliegue](DEPLOY.md)**

## Instalación Local

```bash
# Clonar
git clone https://github.com/nexoflow-spain/business-case-app.git
cd business-case-app

# Instalar dependencias
npm install
cd server && npm install
cd ../client && npm install

# Configurar variables de entorno
cd ../server
cp .env.example .env
# Editar .env con tu OPENAI_API_KEY

# Inicializar base de datos
npx prisma migrate dev --name init
npx prisma generate

# Ejecutar
cd ..
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:3001

## Scripts disponibles

```bash
npm run dev      # Frontend + Backend
npm run server   # Solo backend
npm run client   # Solo frontend
npm run build    # Build de producción
```

## Variables de Entorno

Crea `.env` en la carpeta `server/`:

```
PORT=3001
OPENAI_API_KEY=sk-...
DATABASE_URL="postgresql://..."
NODE_ENV=development
```

## Estructura del Proyecto

```
business-case-app/
├── client/          # Frontend React + Vite
├── server/          # Backend Express
│   ├── src/
│   │   ├── routes/  # API routes
│   │   ├── index.ts # Entry point
│   └── prisma/      # Database schema
├── DEPLOY.md        # Guía de despliegue
└── README.md
```

## Screenshots

*(Próximamente)*

## Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

MIT © [nexoflow](https://github.com/nexoflow-spain)
