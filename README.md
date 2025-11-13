# App Frontend - Panel Administrativo

Panel administrativo web para gestionar el contenido de la aplicación educativa. Construido con React, TypeScript, TanStack Router, TanStack Query y Firebase Auth.

## 🚀 Características

- ✅ **Dashboard Administrativo**: Vista general con estadísticas y métricas clave
- ✅ **Gestión de Cursos**: CRUD completo de cursos con vistas en tarjetas
- ✅ **Gestión de Topics**: Organización de temas por curso con navegación jerárquica
- ✅ **Gestión de Subtopics**: Subtemas dentro de cada topic
- ✅ **Gestión de Lecciones**: Contenido educativo con tablas profesionales
- ✅ **Gestión de Usuarios**: Administración de usuarios del sistema
- ✅ **Gestión de Logros**: Sistema de achievements con rarezas
- ✅ **Autenticación**: Firebase Authentication (Google OAuth)
- ✅ **Autorización**: Control de acceso solo para administradores
- ✅ **UI Profesional**: Navegación jerárquica, búsqueda, filtros y paginación
- ✅ **Componentes Reutilizables**: DataTable, Cards, Modales y más

## 📋 Requisitos Previos

- **Node.js**: >= 18.17
- **npm**: >= 9
- **Backend**: El backend debe estar corriendo en `http://localhost:3000` (o configurar `VITE_API_URL`)

## 🛠️ Instalación

1. **Clonar el repositorio** (si aún no lo has hecho):
```bash
cd /Users/damian/Documents/SERVICIOS\ WEB/web-frontend/app-frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita el archivo `.env` con la URL de tu backend:
```env
VITE_API_URL=http://localhost:3000
```

4. **Configurar Firebase** (si aún no está configurado):
- Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilita Authentication con Google
- Copia las credenciales y actualiza `src/lib/firebase.ts`

## 🏃‍♂️ Ejecución

### Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: http://localhost:5173

### Build para Producción
```bash
npm run build
```

### Preview de Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── assets/              # Recursos estáticos
├── components/          # Componentes reutilizables
│   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   └── ui/             # UI components (Button, Card, Modal, etc.)
├── features/           # Features organizados por dominio
│   ├── achievements/   # Gestión de logros
│   ├── auth/          # Autenticación
│   ├── courses/       # Gestión de cursos
│   ├── exercises/     # Gestión de ejercicios
│   ├── learn/         # Vista de aprendizaje
│   ├── lessons/       # Gestión de lecciones
│   ├── subtopics/     # Gestión de subtopics
│   ├── topics/        # Gestión de topics
│   └── users/         # Gestión de usuarios
├── hooks/             # Custom React hooks
├── lib/               # Utilidades y configuraciones
│   ├── api.ts         # Configuración de Axios
│   ├── firebase.ts    # Configuración de Firebase
│   ├── queryClient.ts # TanStack Query client
│   └── utils.ts       # Utilidades generales
├── routes/            # Rutas de TanStack Router
├── store/             # Estado global (Zustand)
└── types/             # Tipos TypeScript globales
```

## 🔌 API Endpoints

El frontend se conecta al backend en los siguientes endpoints (todos bajo `/api`):

### Cursos
- `GET /courses` - Listar cursos
- `GET /courses/:id` - Obtener curso por ID
- `POST /courses` - Crear curso (admin)
- `PUT /courses/:id` - Actualizar curso (admin)
- `DELETE /courses/:id` - Eliminar curso (admin)

### Topics
- `GET /topics` - Listar topics
- `GET /topics/:id` - Obtener topic por ID
- `GET /courses/:courseId/topics` - Topics de un curso
- `POST /topics` - Crear topic (admin)
- `PUT /topics/:id` - Actualizar topic (admin)
- `DELETE /topics/:id` - Eliminar topic (admin)

### Subtopics
- `GET /subtopics` - Listar subtopics
- `GET /subtopics/:id` - Obtener subtopic por ID
- `GET /topics/:topicId/subtopics` - Subtopics de un topic
- `POST /subtopics` - Crear subtopic (admin)
- `PUT /subtopics/:id` - Actualizar subtopic (admin)
- `DELETE /subtopics/:id` - Eliminar subtopic (admin)

### Lecciones
- `GET /lessons` - Listar lecciones
- `GET /lessons/:id` - Obtener lección por ID
- `GET /topics/:topicId/lessons` - Lecciones de un topic
- `GET /topics/:topicId/subtopics/:subtopicId/lessons` - Lecciones de un subtopic
- `POST /lessons` - Crear lección (admin)
- `PUT /lessons/:id` - Actualizar lección (admin)
- `DELETE /lessons/:id` - Eliminar lección (admin)

### Ejercicios
- `GET /lessons/:lessonId/exercise` - Generar ejercicio
- `POST /lessons/:lessonId/exercise/validate` - Validar respuesta
- `POST /lessons/:lessonId/exercise/submit` - Enviar respuesta
- `GET /lessons/:lessonId/exercise/attempt-status` - Estado del intento

### Usuarios
- `POST /users` - Crear usuario
- `GET /users` - Listar usuarios (admin)
- `GET /users/:id` - Obtener usuario (owner/admin)
- `PUT /users/:id` - Actualizar usuario (owner/admin)
- `DELETE /users/:id` - Eliminar usuario (admin)
- `PATCH /users/:id/xp` - Actualizar XP (owner/admin)

### Logros
- `GET /achievements` - Listar logros
- `GET /achievements/:id` - Obtener logro por ID
- `GET /achievements/rarity/:rarity` - Logros por rareza
- `POST /achievements` - Crear logro (admin)
- `PUT /achievements/:id` - Actualizar logro (admin)
- `DELETE /achievements/:id` - Eliminar logro (admin)

## 🔐 Autenticación

El frontend usa **Firebase Authentication** para manejar la autenticación. El token de Firebase se envía automáticamente en todas las peticiones al backend mediante un interceptor de Axios.

### Flujo de Autenticación:
1. Usuario inicia sesión con Google OAuth
2. Firebase retorna un ID token
3. El frontend envía el token en el header `Authorization: Bearer <token>`
4. El backend valida el token y retorna los datos del usuario

## 🎨 Stack Tecnológico

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TanStack Router** - Enrutamiento type-safe
- **TanStack Query** - Data fetching y caching
- **Zustand** - Estado global ligero
- **Tailwind CSS** - Estilos utility-first
- **Shadcn UI** - Componentes UI accesibles
- **Firebase** - Autenticación
- **Axios** - HTTP client
- **React Hook Form + Zod** - Forms y validación
- **Lucide React** - Iconos

## 🔧 Configuración de Firebase

Actualiza `src/lib/firebase.ts` con tus credenciales de Firebase:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

## 🐛 Solución de Problemas

### El backend no responde
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Verifica la variable `VITE_API_URL` en `.env`

### Error de autenticación
- Verifica que Firebase esté configurado correctamente
- Verifica que el usuario tenga permisos (rol admin para operaciones administrativas)

### Error 401/403
- El token puede haber expirado, recarga la página
- Verifica que el usuario tenga el rol correcto

### Errores de TypeScript
- Ejecuta `npm run build` para ver errores completos
- Verifica que todas las dependencias estén instaladas

## 📝 Notas Adicionales

- **Backend**: Este proyecto requiere que el backend (`app-backend`) esté corriendo
- **Roles**: Solo usuarios con rol `admin` pueden crear/editar/eliminar contenido
- **Cache**: TanStack Query cachea automáticamente las peticiones (ver `src/lib/queryClient.ts`)
- **Logging**: Todos los servicios tienen logging detallado en consola para debugging

## 👥 Autores

- **PUPUENDO** - [GitHub](https://github.com/PUPUENDO)

## 📄 Licencia

Este proyecto es privado y de uso interno.
