# Despliegue en Google Cloud 🚀

Guía completa para desplegar Business Case App en Google Cloud Platform.

## 🏗️ Arquitectura

- **Cloud Run**: Aloja la aplicación Node.js (serverless)
- **Cloud SQL**: Base de datos PostgreSQL
- **Secret Manager**: Almacena API keys de forma segura
- **Cloud Build**: CI/CD automatizado

---

## 📋 Prerrequisitos

1. Cuenta de Google Cloud (https://cloud.google.com/free - $300 créditos)
2. Google Cloud SDK instalado (`gcloud` CLI)
3. Proyecto de GCP creado

---

## 🚀 Opción 1: Despliegue Manual (Recomendada para empezar)

### Paso 1: Crear proyecto en GCP

```bash
# Login
gcloud auth login

# Crear proyecto (o usar existente)
gcloud projects create business-case-app-2025 --name="Business Case App"
gcloud config set project business-case-app-2025

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com cloudbuild.googleapis.com
```

### Paso 2: Crear base de datos PostgreSQL

```bash
# Crear instancia de Cloud SQL
gcloud sql instances create business-case-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=europe-west1 \
  --storage-size=10GB \
  --storage-auto-increase

# Crear base de datos
gcloud sql databases create businesscase --instance=business-case-db

# Crear usuario
gcloud sql users create postgres \
  --instance=business-case-db \
  --password=TU_PASSWORD_SEGURA

# Obtener la IP de conexión
gcloud sql instances describe business-case-db --format='value(connectionName)'
# Guarda este valor: TU_PROYECTO:europe-west1:business-case-db
```

### Paso 3: Guardar secretos

```bash
# Crear secreto para OpenAI API Key
echo -n "sk-tu-api-key-de-openai" | gcloud secrets create openai-api-key --data-file=-

# Dar permisos a Cloud Run para leer secretos
gcloud secrets add-iam-policy-binding openai-api-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Paso 4: Build y Deploy

```bash
# Build imagen Docker
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/business-case-app:latest

# Deploy en Cloud Run
gcloud run deploy business-case-app \
  --image gcr.io/$(gcloud config get-value project)/business-case-app:latest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-cloudsql-instances $(gcloud config get-value project):europe-west1:business-case-db \
  --set-secrets OPENAI_API_KEY=openai-api-key:latest \
  --set-env-vars NODE_ENV=production,DATABASE_URL="postgresql://postgres:TU_PASSWORD_SEGURA@localhost:5432/businesscase?host=/cloudsql/$(gcloud config get-value project):europe-west1:business-case-db" \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Paso 5: Run migrations

```bash
# Crear job para migraciones
gcloud run jobs create migrate-db \
  --image gcr.io/$(gcloud config get-value project)/business-case-app:latest \
  --region europe-west1 \
  --set-cloudsql-instances $(gcloud config get-value project):europe-west1:business-case-db \
  --set-secrets OPENAI_API_KEY=openai-api-key:latest \
  --set-env-vars NODE_ENV=production,DATABASE_URL="postgresql://postgres:TU_PASSWORD_SEGURA@localhost:5432/businesscase?host=/cloudsql/$(gcloud config get-value project):europe-west1:business-case-db" \
  --command npx \
  --args prisma,migrate,deploy

# Ejecutar migraciones
gcloud run jobs execute migrate-db --region europe-west1
```

---

## 🔄 Opción 2: CI/CD Automatizado con Cloud Build

### Configurar Trigger

1. Ve a https://console.cloud.google.com/cloud-build/triggers
2. Click **"Create Trigger"**
3. Configura:
   - **Name:** `business-case-app-deploy`
   - **Event:** Push to branch (main)
   - **Source:** GitHub (conecta tu repo)
   - **Configuration:** Cloud Build configuration file
   - **Location:** Repository
   - **Cloud Build configuration file location:** `/cloudbuild.yaml`

4. Añade variable de sustitución:
   - `_DATABASE_URL`: `postgresql://postgres:TU_PASSWORD@localhost:5432/businesscase?host=/cloudsql/PROJECT:europe-west1:business-case-db`

5. Click **"Create"**

Ahora cada push a `main` desplegará automáticamente.

---

## 💰 Costos Estimados (Mensuales)

| Servicio | Tier | Costo Estimado |
|----------|------|----------------|
| Cloud Run | 0-100K req/mes | **Gratis** |
| Cloud SQL | db-f1-micro | ~$7-10/mes |
| Secret Manager | 1 secreto | **Gratis** |
| Cloud Build | 120 min/día | **Gratis** |
| **Total** | | **~$7-10/mes** |

---

## 🔧 Comandos Útiles

```bash
# Ver logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=business-case-app" --limit=50

# Ver URL del servicio
gcloud run services describe business-case-app --region=europe-west1 --format='value(status.url)'

# Actualizar variables de entorno
gcloud run services update business-case-app \
  --region=europe-west1 \
  --set-env-vars "VARIABLE=nuevo_valor"

# Escalar manualmente
gcloud run services update business-case-app \
  --region=europe-west1 \
  --min-instances=2

# Conectar a base de datos localmente
gcloud sql connect business-case-db --user=postgres --database=businesscase
```

---

## 🌐 URL de tu App

Después del despliegue, tu app estará disponible en:
```
https://business-case-app-XXXXXXXXXX-ez.a.run.app
```

Endpoints:
- App: `https://tu-url/`
- API: `https://tu-url/api/health`
- Chat: `https://tu-url/api/chat`

---

## 🐛 Solución de Problemas

### Error: "Cloud SQL connection failed"
```bash
# Verificar que la instancia SQL está en la misma región
gcloud sql instances describe business-case-db --format='value(region)'

# Verificar que el servicio tiene permisos
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

### Error: "Secret not found"
```bash
# Verificar que el secreto existe
gcloud secrets list

# Verificar permisos
gcloud secrets get-iam-policy openai-api-key
```

### Error: "Prisma migrate failed"
```bash
# Conectar manualmente y verificar
gcloud sql connect business-case-db --user=postgres
dev# \l  # Listar bases de datos
```

---

## 📚 Recursos

- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Cloud SQL Docs](https://cloud.google.com/sql/docs/postgres)
- [Secret Manager Docs](https://cloud.google.com/secret-manager/docs)
- [Prisma with Cloud SQL](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-google-cloud-platform)

---

**¿Necesitas ayuda con algún paso específico?**
