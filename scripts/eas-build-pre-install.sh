#!/usr/bin/env bash

# Este script se ejecuta antes del build en EAS
# Copia el archivo google-services.json desde el secret

if [ -n "$GOOGLE_SERVICES_JSON" ]; then
  echo "Copiando google-services.json desde secret..."
  echo "$GOOGLE_SERVICES_JSON" > google-services.json
  echo "✓ google-services.json configurado"
else
  echo "⚠️  Warning: GOOGLE_SERVICES_JSON no está configurado"
fi
