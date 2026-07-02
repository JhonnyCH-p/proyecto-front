import os

# ============================================
# CONFIGURACIÓN
# ============================================
# Cambia esta ruta si quieres que se cree en otro lado
# Ej: "." para la carpeta actual, o "alpha-inmobiliaria"
BASE_DIR = "alpha-inmobiliaria"

# ============================================
# ESTRUCTURA DE CARPETAS (SOLO DIRECTORIOS)
# ============================================
folders = [
    # Raíz y src
    f"{BASE_DIR}",
    f"{BASE_DIR}/src",
    
    # Domain
    f"{BASE_DIR}/src/domain",
    f"{BASE_DIR}/src/domain/entities",
    f"{BASE_DIR}/src/domain/ports",
    f"{BASE_DIR}/src/domain/value-objects",
    
    # Application
    f"{BASE_DIR}/src/application",
    f"{BASE_DIR}/src/application/store",
    f"{BASE_DIR}/src/application/hooks",
    f"{BASE_DIR}/src/application/dtos",
    f"{BASE_DIR}/src/application/use-cases",
    
    # Infrastructure
    f"{BASE_DIR}/src/infrastructure",
    f"{BASE_DIR}/src/infrastructure/api",
    f"{BASE_DIR}/src/infrastructure/mocks",
    f"{BASE_DIR}/src/infrastructure/repositories",
    f"{BASE_DIR}/src/infrastructure/services",
    f"{BASE_DIR}/src/infrastructure/config",
    
    # Presentation - Components
    f"{BASE_DIR}/src/presentation",
    f"{BASE_DIR}/src/presentation/components",
    f"{BASE_DIR}/src/presentation/components/ui",
    f"{BASE_DIR}/src/presentation/components/layout",
    f"{BASE_DIR}/src/presentation/components/shared",
    f"{BASE_DIR}/src/presentation/components/map",
    f"{BASE_DIR}/src/presentation/components/contact",
    f"{BASE_DIR}/src/presentation/components/chatbot",
    f"{BASE_DIR}/src/presentation/components/propiedad",
    f"{BASE_DIR}/src/presentation/components/filtros",
    
    # Presentation - Pages
    f"{BASE_DIR}/src/presentation/pages",
    f"{BASE_DIR}/src/presentation/pages/public",
    f"{BASE_DIR}/src/presentation/pages/auth",
    f"{BASE_DIR}/src/presentation/pages/asesor",
    f"{BASE_DIR}/src/presentation/pages/shared",
    
    # Presentation - Store (para el mapa)
    f"{BASE_DIR}/src/presentation/store",
    
    # Shared
    f"{BASE_DIR}/src/shared",
    f"{BASE_DIR}/src/shared/constants",
    f"{BASE_DIR}/src/shared/utils",
]

# ============================================
# EJECUCIÓN
# ============================================
print(f"📁 Creando estructura de carpetas en: {BASE_DIR}/")
print("-" * 50)

for folder in folders:
    try:
        os.makedirs(folder, exist_ok=True)
        print(f"  ✅ Creado: {folder}")
    except Exception as e:
        print(f"  ❌ Error en {folder}: {e}")

print("-" * 50)
print(f"✅ ¡Estructura de carpetas creada con éxito!")
print(f"📂 Ubicación: {os.path.abspath(BASE_DIR)}")