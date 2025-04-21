#!/bin/bash

# Crear carpetas
mkdir -p hooks
mkdir -p routes
mkdir -p services
mkdir -p state
mkdir -p utils

# Crear archivos en la carpeta hooks
touch hooks/useAuth.ts            # useAuth.ts

# Crear archivos en la carpeta routes
touch routes/AppRoutes.tsx         # AppRoutes.tsx

# Crear archivos en la carpeta services
touch services/api.ts             # api.ts

# Crear archivos en la carpeta state
touch state/authStore.ts          # authStore.ts

# Crear archivos en la carpeta utils
touch utils/axiosConfig.ts        # axiosConfig.ts
touch utils/formValidation.ts     # formValidation.ts

echo "Estructura de carpetas y archivos creada con éxito."
