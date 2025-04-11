#!/bin/bash

# Verifica si el parámetro ha sido proporcionado
if [ -z "$1" ]; then
  echo "Error: Debes proporcionar un nombre para la migración."
  exit 1
fi

# Guarda el parámetro proporcionado en una variable
MIPARAMETRO=$1

# Ejecuta el comando npx con el parámetro
npx typeorm-ts-node-commonjs migration:generate ./src/infrastructure/persistence/migration/${MIPARAMETRO} -d ./src/infrastructure/persistence/typeormSource.ts
