/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  make-server-75638143  —  Supabase Edge Function
 *  Backend para ChecklistRoadmap
 *
 *  RUTAS:
 *    GET    /roadmap/modules              → Devuelve todos los módulos del KV
 *    POST   /roadmap/modules-bulk         → Guarda/sobreescribe todos los módulos
 *    POST   /roadmap/modules/:id          → Actualiza un módulo individual
 *    DELETE /roadmap/modules/reset        → Borra el KV (resync)
 *    GET    /roadmap/stats                → Estadísticas calculadas en el servidor
 *    GET    /health                       → Health check
 *
 *  ALMACENAMIENTO: Supabase KV  (Deno.openKv)
 *  AUTH:           Bearer token = SUPABASE_ANON_KEY  (validado)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type ModuleStatus =
  | "not-started"
  | "spec-ready"
  | "progress-10"
  | "progress-50"
  | "progress-80"
  | "ui-only"
  | "completed";

interface SubModule {
  id: string;
  name: string;
  status: ModuleStatus;
  estimatedHours?: number;
}

interface Module {
  id: string;
  name: string;
  category: string;
  status: ModuleStatus;
  priority: string;
  description: string;
  estimatedHours?: number;
  submodules?: SubModule[];
  execOrder?: number;
  updatedAt?: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const KV_NAMESPACE  = "roadmap";
const KV_MODULES_KEY = [KV_NAMESPACE, "modules"];   // lista completa
const KV_MODULE_KEY  = (id: string) => [KV_NAMESPACE, "module", id];

const STATUS_PERCENT: Record<ModuleStatus, number> = {
  "not-started":  0,
  "spec-ready":   15,
  "progress-10":  10,
  "progress-50":  50,
  "progress-80":  80,
  "ui-only":      80,
  "completed":    100,
};

// ─── CORS headers ─────────────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function err(msg: string, status = 400) {
  return json({ error: msg }, status);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function validateAuth(req: Request): boolean {
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!anonKey) return true; // dev mode sin env
  const auth = req.headers.get("Authorization") ?? "";
  return auth === `Bearer ${anonKey}`;
}

// ─── Helpers de KV ────────────────────────────────────────────────────────────
async function getModules(kv: Deno.Kv): Promise<Module[]> {
  const res = await kv.get<Module[]>(KV_MODULES_KEY);
  return res.value ?? [];
}

async function saveModules(kv: Deno.Kv, modules: Module[]): Promise<void> {
  // Guardamos la lista completa + cada módulo individualmente para acceso por ID
  const op = kv.atomic().set(KV_MODULES_KEY, modules);
  await op.commit();

  // Índice por ID en background (non-blocking)
  for (const m of modules) {
    kv.set(KV_MODULE_KEY(m.id), m).catch(() => {/* silent */});
  }
}

// ─── Estadísticas calculadas ──────────────────────────────────────────────────
function computeStats(modules: Module[]) {
  const total = modules.length;
  const completed = modules.filter(m => m.status === "completed").length;
  const inProgress = modules.filter(m =>
    ["progress-10","progress-50","progress-80","ui-only","spec-ready"].includes(m.status)
  ).length;
  const notStarted = modules.filter(m => m.status === "not-started").length;

  const totalHours  = modules.reduce((s, m) => s + (m.estimatedHours ?? 0), 0);
  const doneHours   = modules
    .filter(m => m.status === "completed")
    .reduce((s, m) => s + (m.estimatedHours ?? 0), 0);
  const pendingHours = totalHours - doneHours;

  // % global ponderado por horas
  const globalPct = totalHours === 0 ? 0 : Math.round(
    modules.reduce((sum, m) => {
      const pct = getEffectivePercent(m);
      return sum + pct * (m.estimatedHours ?? 1);
    }, 0) / totalHours
  );

  // Por categoría
  const byCategory: Record<string, {
    total: number; completed: number; inProgress: number;
    hours: number; pct: number;
  }> = {};

  for (const m of modules) {
    if (!byCategory[m.category]) {
      byCategory[m.category] = { total: 0, completed: 0, inProgress: 0, hours: 0, pct: 0 };
    }
    const cat = byCategory[m.category];
    cat.total++;
    cat.hours += m.estimatedHours ?? 0;
    if (m.status === "completed") cat.completed++;
    if (["progress-10","progress-50","progress-80","ui-only"].includes(m.status)) cat.inProgress++;
  }

  // Calcular pct por categoría
  for (const cat of Object.keys(byCategory)) {
    const mods = modules.filter(m => m.category === cat);
    const h = mods.reduce((s, m) => s + (m.estimatedHours ?? 1), 0);
    byCategory[cat].pct = h === 0 ? 0 : Math.round(
      mods.reduce((sum, m) => sum + getEffectivePercent(m) * (m.estimatedHours ?? 1), 0) / h
    );
  }

  // Cola de ejecución
  const queue = modules
    .filter(m => m.status === "spec-ready")
    .sort((a, b) => (a.execOrder ?? 999) - (b.execOrder ?? 999));

  return {
    summary: { total, completed, inProgress, notStarted, globalPct, totalHours, doneHours, pendingHours },
    byCategory,
    queue: queue.map(m => ({ id: m.id, name: m.name, execOrder: m.execOrder, estimatedHours: m.estimatedHours })),
    generatedAt: new Date().toISOString(),
  };
}

function getEffectivePercent(m: Module): number {
  if (!m.submodules || m.submodules.length === 0) {
    return STATUS_PERCENT[m.status] ?? 0;
  }
  const totalH = m.submodules.reduce((s, sub) => s + (sub.estimatedHours ?? 1), 0);
  return Math.round(
    m.submodules.reduce(
      (sum, sub) => sum + (STATUS_PERCENT[sub.status] ?? 0) * ((sub.estimatedHours ?? 1) / totalH),
      0
    )
  );
}

// ─── Router principal ─────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // Auth
  if (!validateAuth(req)) {
    return err("Unauthorized", 401);
  }

  const url    = new URL(req.url);
  const path   = url.pathname.replace(/\/+$/, ""); // trim trailing slash
  const method = req.method;

  // Extraer la parte relativa al módulo
  // path ejemplo: /roadmap/modules  |  /roadmap/modules/erp-inventory  |  /roadmap/stats
  const segments = path.split("/").filter(Boolean);
  // segments[0] = nombre de la función (make-server-75638143) — ignorar si viene en la URL
  // Supabase strip la función del path automáticamente, así que:
  //   /roadmap/modules           → ["roadmap", "modules"]
  //   /roadmap/modules/some-id   → ["roadmap", "modules", "some-id"]
  //   /roadmap/modules/reset     → ["roadmap", "modules", "reset"]
  //   /roadmap/stats             → ["roadmap", "stats"]
  //   /health                    → ["health"]

  const area   = segments[0]; // "roadmap" | "health"
  const entity = segments[1]; // "modules" | "stats"
  const id     = segments[2]; // id del módulo o "reset"

  // ── Health check ──────────────────────────────────────────────────────────
  if (area === "health") {
    return json({ status: "ok", ts: new Date().toISOString() });
  }

  if (area !== "roadmap") {
    return err("Not found", 404);
  }

  const kv = await Deno.openKv();

  try {
    // ── GET /roadmap/stats ───────────────────────────────────────────────────
    if (entity === "stats" && method === "GET") {
      const modules = await getModules(kv);
      return json(computeStats(modules));
    }

    // ── GET /roadmap/modules ─────────────────────────────────────────────────
    if (entity === "modules" && !id && method === "GET") {
      const modules = await getModules(kv);
      return json({ modules, count: modules.length });
    }

    // ── POST /roadmap/modules-bulk ───────────────────────────────────────────
    if (entity === "modules-bulk" && method === "POST") {
      let body: { modules?: Module[] };
      try { body = await req.json(); }
      catch { return err("Invalid JSON"); }

      const modules = body.modules;
      if (!Array.isArray(modules)) return err("modules must be an array");

      // Timestamp a cada módulo
      const stamped = modules.map(m => ({ ...m, updatedAt: new Date().toISOString() }));
      await saveModules(kv, stamped);

      return json({ ok: true, saved: stamped.length, ts: new Date().toISOString() });
    }

    // ── DELETE /roadmap/modules/reset ────────────────────────────────────────
    if (entity === "modules" && id === "reset" && method === "DELETE") {
      await kv.delete(KV_MODULES_KEY);
      return json({ ok: true, message: "KV cleared — ready for fresh sync" });
    }

    // ── POST /roadmap/modules/:id ────────────────────────────────────────────
    if (entity === "modules" && id && method === "POST") {
      let body: Module;
      try { body = await req.json(); }
      catch { return err("Invalid JSON"); }

      if (body.id !== id) return err("ID mismatch between URL and body");

      // Actualizar el módulo en la lista completa
      const modules = await getModules(kv);
      const idx = modules.findIndex(m => m.id === id);
      const updated = { ...body, updatedAt: new Date().toISOString() };

      if (idx === -1) {
        // Módulo nuevo — agregar
        modules.push(updated);
      } else {
        modules[idx] = updated;
      }

      await saveModules(kv, modules);
      return json({ ok: true, module: updated });
    }

    // ── GET /roadmap/modules/:id ─────────────────────────────────────────────
    if (entity === "modules" && id && method === "GET") {
      const res = await kv.get<Module>(KV_MODULE_KEY(id));
      if (!res.value) return err("Module not found", 404);
      return json(res.value);
    }

    return err("Route not found", 404);

  } finally {
    kv.close();
  }
});
