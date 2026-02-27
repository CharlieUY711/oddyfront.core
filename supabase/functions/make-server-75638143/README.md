# make-server-75638143 — Backend del ChecklistRoadmap

Edge Function de Supabase que persiste y sirve el estado del roadmap de módulos.

---

## 📁 Estructura

```
supabase/
└── functions/
    └── make-server-75638143/
        ├── index.ts       ← función principal
        └── config.json    ← configuración
```

---

## 🚀 Deploy

### 1. Prerequisitos
```bash
npm install -g supabase
supabase login
```

### 2. Vincular tu proyecto
```bash
supabase link --project-ref TU_PROJECT_ID
```

### 3. Deploy de la función
```bash
supabase functions deploy make-server-75638143 --no-verify-jwt
```

> `--no-verify-jwt` permite que el frontend use el `anonKey` directamente sin
> pasar por el middleware de JWT de Supabase (la función valida el token internamente).

---

## 🔌 Endpoints

| Método   | Ruta                              | Descripción                              |
|----------|-----------------------------------|------------------------------------------|
| `GET`    | `/roadmap/modules`                | Todos los módulos guardados en KV        |
| `POST`   | `/roadmap/modules-bulk`           | Guardar/reemplazar todos los módulos     |
| `POST`   | `/roadmap/modules/:id`            | Actualizar un módulo individual          |
| `DELETE` | `/roadmap/modules/reset`          | Limpiar KV (resync desde manifest)       |
| `GET`    | `/roadmap/stats`                  | Estadísticas calculadas en el servidor   |
| `GET`    | `/health`                         | Health check                             |

---

## 🔐 Autenticación

Todas las peticiones requieren el header:
```
Authorization: Bearer SUPABASE_ANON_KEY
```

La función lee `SUPABASE_ANON_KEY` del entorno de Supabase automáticamente.

---

## 🗄️ Almacenamiento

Usa **Deno KV** (integrado en Supabase Edge Functions):

- `["roadmap", "modules"]` → Array completo de módulos
- `["roadmap", "module", ":id"]` → Índice individual por ID

No necesitás crear tablas en PostgreSQL. El KV es suficiente para este caso de uso.

---

## 📊 Respuesta de `/roadmap/stats`

```json
{
  "summary": {
    "total": 71,
    "completed": 8,
    "inProgress": 12,
    "notStarted": 51,
    "globalPct": 14,
    "totalHours": 1614,
    "doneHours": 180,
    "pendingHours": 1434
  },
  "byCategory": {
    "ecommerce": { "total": 3, "completed": 0, "inProgress": 0, "hours": 88, "pct": 0 },
    "...": "..."
  },
  "queue": [
    { "id": "erp-inventory", "name": "Inventario", "execOrder": 1, "estimatedHours": 48 }
  ],
  "generatedAt": "2025-02-27T12:00:00.000Z"
}
```

---

## 🧪 Test local

```bash
supabase functions serve make-server-75638143

# Health check
curl http://localhost:54321/functions/v1/make-server-75638143/health

# Obtener módulos
curl http://localhost:54321/functions/v1/make-server-75638143/roadmap/modules \
  -H "Authorization: Bearer TU_ANON_KEY"

# Guardar módulos
curl -X POST http://localhost:54321/functions/v1/make-server-75638143/roadmap/modules-bulk \
  -H "Authorization: Bearer TU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"modules": [{"id": "erp-inventory", "name": "Inventario", "status": "progress-50", ...}]}'

# Stats
curl http://localhost:54321/functions/v1/make-server-75638143/roadmap/stats \
  -H "Authorization: Bearer TU_ANON_KEY"
```

---

## ⚠️ Variables de entorno requeridas

Supabase inyecta estas automáticamente en el entorno de la función:
- `SUPABASE_ANON_KEY` — clave pública del proyecto
- `SUPABASE_URL` — URL del proyecto

No necesitás configurar nada extra.

---

## 🔄 Flujo de datos (frontend ↔ backend)

```
ChecklistRoadmap.tsx
       │
       ├── GET /roadmap/modules       → carga estado inicial
       ├── POST /roadmap/modules/:id  → guarda cambio individual (updateModuleStatus)
       ├── POST /roadmap/modules-bulk → guarda todo (saveAllProgress / resync)
       ├── DELETE /roadmap/modules/reset → limpia KV (forceResyncFromManifest)
       └── GET /roadmap/stats         → [opcional] dashboard de métricas
```
