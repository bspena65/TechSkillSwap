#!/bin/bash

# Crear carpetas de Atomic Design
mkdir -p atoms
mkdir -p molecules
mkdir -p organisms
mkdir -p templates
mkdir -p pages

# Crear archivos en la carpeta atoms
touch atoms/Button.tsx      # Button.tsx
touch atoms/Input.tsx       # Input.tsx
touch atoms/Label.tsx       # Label.tsx
touch atoms/Icon.tsx        # Icon.tsx

# Crear archivos en la carpeta molecules
touch molecules/FormField.tsx    # FormField.tsx
touch molecules/InputGroup.tsx   # InputGroup.tsx
touch molecules/NavbarItem.tsx   # NavbarItem.tsx

# Crear archivos en la carpeta organisms
touch organisms/AuthForm.tsx     # AuthForm.tsx
touch organisms/Navbar.tsx       # Navbar.tsx
touch organisms/Footer.tsx       # Footer.tsx

# Crear archivos en la carpeta templates
touch templates/AuthTemplate.tsx # AuthTemplate.tsx
touch templates/MainTemplate.tsx # MainTemplate.tsx

# Crear archivos en la carpeta pages
touch pages/Login.tsx            # Login.tsx
touch pages/Register.tsx         # Register.tsx
touch pages/Home.tsx             # Home.tsx

echo "Estructura de carpetas y archivos creada con éxito."
