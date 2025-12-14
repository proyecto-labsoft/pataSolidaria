#!/usr/bin/env bash

# Este script se ejecuta antes del build en EAS
# Copia el archivo google-services.json desde la variable de entorno

echo "🔍 Verificando GOOGLE_SERVICES_JSON..."

if [ -n "$GOOGLE_SERVICES_JSON" ]; then
  echo "📝 Creando google-services.json desde variable de entorno..."
  echo "$GOOGLE_SERVICES_JSON" > google-services.json
  echo "✅ google-services.json configurado correctamente"
  ls -la google-services.json
else
  echo "⚠️  Error: GOOGLE_SERVICES_JSON no está configurado"
  exit 1
fi
