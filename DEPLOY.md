# Guía de Despliegue 🚀

## Opción 1: Railway (Recomendada)

Railway es la forma más fácil de desplegar tu app completa (backend + base de datos).

### Paso 1: Crear cuenta
1. Ve a https://railway.app
2. Regístrate con GitHub

### Paso 2: Crear proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Elige `business-case-app`

### Paso 3: Agregar PostgreSQL
1. Click en "New" → "Database" → "Add PostgreSQL"
2. Railway creará automáticamente la variable `DATABASE_URL`

### Paso 4: Configurar variables de entorno
En el panel de tu proyecto, ve a "Variables" y agrega:

```
OPENAI_API_KEY=tu_api_key_de_openai
NODE_ENV=production
```

### Paso 5: Configurar dominio
1. Ve a "Settings" de tu servicio
2. En "Environment", selecciona "Generate Domain"
3. Railway te dará una URL como `https://business-case-app.up.railway.app`

### Paso 6: Deploy
Railway hará deploy automático cada vez que hagas push a GitHub.

---

## Opción 2: Render (Gratuito)

### Web Service (Backend + Frontend)
1. Ve a https://render.com
2. "New Web Service"
3. Conecta tu repo de GitHub
4. Configuración:
   - **Name:** business-case-app
   - **Environment:** Node
   - **Build Command:** `npm install && cd client && npm install && npm run build && cd ../server && npm install && npx prisma generate`
   - **Start Command:** `cd server && npm start`
5. Agrega variables de entorno:
   - `DATABASE_URL` (usar PostgreSQL de Render)
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`

### PostgreSQL en Render
1. "New PostgreSQL"
2. Copia la URL de conexión
3. Agrégala como variable `DATABASE_URL`

---

## Opción 3: Vercel (Frontend) + Railway/Render (Backend)

### Desplegar Frontend en Vercel
1. Ve a https://vercel.com
2. Importa tu repo
3. Configura:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
4. Agrega variable:
   - `VITE_API_URL=https://tu-backend.railway.app/api`

### Desplegar Backend en Railway/Render
Sigue los pasos de la Opción 1 u Opción 2 para el backend.

---

## Verificación post-deploy

Una vez desplegado, verifica que todo funciona:

1. **Health check:**
   ```
   GET https://tu-app.com/api/health
   ```
   Debe responder: `{"status":"ok","message":"¡Todo chido por aquí! 🚀"}`

2. **Crear un business case:**
   ```
   POST https://tu-app.com/api/business-cases
   {"title":"Test","description":"Probando"}
   ```

3. **Verificar base de datos:**
   Los datos deben persistir entre reinicios.

---

## Solución de problemas

### Error: "Cannot find module '@prisma/client'"
Solución: Agregar `npx prisma generate` al build command.

### Error: "Database does not exist"
Solución: Verificar que `DATABASE_URL` esté configurada correctamente.

### Error: "OpenAI API key invalid"
Solución: Verificar que `OPENAI_API_KEY` esté configurada y sea válida.

### Frontend no carga (404)
Solución: Verificar que `NODE_ENV=production` esté configurada para servir archivos estáticos.

---

## Costos estimados

| Plataforma | Tier Gratuito | Tier Pro |
|------------|--------------|----------|
| Railway | $5 crédito/mes | ~$20/mes |
| Render | Sí (duerme) | ~$7/mes |
| Vercel | Sí (hobby) | ~$20/mes |

Para un proyecto personal, el tier gratuito de Railway o Render es suficiente.
