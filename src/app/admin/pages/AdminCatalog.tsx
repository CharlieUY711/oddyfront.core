import { useState } from "react";
import { useDepartments, useCategories, useSubcategories } from "../hooks/useCatalog";
import { catalogService, toSlug } from "../services/catalogService";
import { useToast } from "../../components/ToastProvider";

type Tab = "departments" | "categories" | "subcategories";

export default function AdminCatalog() {
  const [tab, setTab] = useState<Tab>("departments");
  const toast = useToast();

  const depts  = useDepartments();
  const cats   = useCategories();
  const subs   = useSubcategories();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>Catálogo</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", background: "#fff", borderRadius: "10px", padding: "4px", width: "fit-content", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {(["departments","categories","subcategories"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "0.5rem 1.25rem", borderRadius: "8px", border: "none", cursor: "pointer",
            fontWeight: tab === t ? 700 : 400, fontSize: "0.875rem",
            background: tab === t ? "#FF6835" : "transparent",
            color: tab === t ? "#fff" : "#666",
            transition: "all 0.15s",
          }}>
            {t === "departments" ? "🏢 Departamentos" : t === "categories" ? "📂 Categorías" : "📁 Subcategorías"}
          </button>
        ))}
      </div>

      {tab === "departments" && (
        <CatalogTable
          title="Departamentos"
          items={depts.data}
          loading={depts.loading}
          columns={["Nombre", "Slug", "Categorías", "Estado"]}
          renderRow={d => [d.name, d.slug, d.categories_count, d.is_active ? "✅ Activo" : "⏸ Inactivo"]}
          onToggle={async (item) => {
            await catalogService.updateDepartment(item.id, { p_is_active: !item.is_active });
            toast.success(`${item.name} ${item.is_active ? "pausado" : "activado"}`);
            depts.refetch();
          }}
          onDelete={async (item) => {
            const { error } = await catalogService.deleteDepartment(item.id);
            if (error) toast.error(error.message);
            else { toast.success("Departamento eliminado"); depts.refetch(); }
          }}
          onCreate={async (name) => {
            const { error } = await catalogService.createDepartment(name, toSlug(name));
            if (error) toast.error(error.message);
            else { toast.success("Departamento creado ✓"); depts.refetch(); }
          }}
        />
      )}

      {tab === "categories" && (
        <CatalogTable
          title="Categorías"
          items={cats.data}
          loading={cats.loading}
          columns={["Nombre", "Slug", "Departamento", "Subcats", "Estado"]}
          renderRow={c => [c.name, c.slug, c.department_name, c.subcategories_count, c.is_active ? "✅ Activo" : "⏸ Inactivo"]}
          onToggle={async (item) => {
            await catalogService.updateCategory(item.id, { p_is_active: !item.is_active });
            toast.success(`${item.name} actualizado`);
            cats.refetch();
          }}
          onDelete={async (item) => {
            const { error } = await catalogService.deleteCategory(item.id);
            if (error) toast.error(error.message);
            else { toast.success("Categoría eliminada"); cats.refetch(); }
          }}
          onCreate={async (name, parentId) => {
            if (!parentId) { toast.error("Seleccioná un departamento"); return; }
            const { error } = await catalogService.createCategory(parentId, name, toSlug(name));
            if (error) toast.error(error.message);
            else { toast.success("Categoría creada ✓"); cats.refetch(); }
          }}
          parentLabel="Departamento"
          parentOptions={depts.data.map(d => ({ id: d.id, name: d.name }))}
        />
      )}

      {tab === "subcategories" && (
        <CatalogTable
          title="Subcategorías"
          items={subs.data}
          loading={subs.loading}
          columns={["Nombre", "Slug", "Categoría", "Departamento", "Estado"]}
          renderRow={s => [s.name, s.slug, s.category_name, s.department_name, s.is_active ? "✅ Activo" : "⏸ Inactivo"]}
          onToggle={async (item) => {
            await catalogService.updateSubcategory(item.id, { p_is_active: !item.is_active });
            toast.success(`${item.name} actualizado`);
            subs.refetch();
          }}
          onDelete={async (item) => {
            const { error } = await catalogService.deleteSubcategory(item.id);
            if (error) toast.error(error.message);
            else { toast.success("Subcategoría eliminada"); subs.refetch(); }
          }}
          onCreate={async (name, parentId) => {
            if (!parentId) { toast.error("Seleccioná una categoría"); return; }
            const { error } = await catalogService.createSubcategory(parentId, name, toSlug(name));
            if (error) toast.error(error.message);
            else { toast.success("Subcategoría creada ✓"); subs.refetch(); }
          }}
          parentLabel="Categoría"
          parentOptions={cats.data.map(c => ({ id: c.id, name: `${c.department_name} → ${c.name}` }))}
        />
      )}
    </div>
  );
}

// ── Tabla genérica reutilizable
function CatalogTable({ title, items, loading, columns, renderRow, onToggle, onDelete, onCreate, parentLabel, parentOptions }: {
  title: string; items: any[]; loading: boolean;
  columns: string[]; renderRow: (item: any) => any[];
  onToggle: (item: any) => void; onDelete: (item: any) => void;
  onCreate: (name: string, parentId?: string) => void;
  parentLabel?: string; parentOptions?: { id: string; name: string }[];
}) {
  const [search,   setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName,  setNewName]  = useState("");
  const [parentId, setParentId] = useState("");
  const [delId,    setDelId]    = useState<string | null>(null);
  const [saving,   setSaving]   = useState(false);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await onCreate(newName.trim(), parentId || undefined);
    setNewName(""); setParentId(""); setShowForm(false);
    setSaving(false);
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: "52px", background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", borderRadius: "8px", animation: "shimmer 1.5s infinite" }} />
      ))}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Buscar ${title.toLowerCase()}...`}
          style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "0.875rem", outline: "none" }} />
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: "0.5rem 1.25rem", background: "#FF6835", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>
          {showForm ? "Cancelar" : `+ Nuevo`}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: "#fff", borderRadius: "12px", padding: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap", border: "2px solid #FF6835" }}>
          {parentOptions && (
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>{parentLabel}</label>
              <select value={parentId} onChange={e => setParentId(e.target.value)}
                style={{ padding: "0.5rem 0.75rem", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "0.875rem", minWidth: "200px" }}>
                <option value="">Seleccioná...</option>
                {parentOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", marginBottom: "4px" }}>Nombre</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre..."
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={handleCreate} disabled={saving || !newName.trim()}
            style={{ padding: "0.5rem 1.25rem", background: saving ? "#ccc" : "#6BB87A", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>
            {saving ? "Guardando..." : "Crear"}
          </button>
        </div>
      )}

      {/* Tabla */}
      <div style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
              {[...columns, ""].map(h => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.73rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ padding: "3rem", textAlign: "center", color: "#9CA3AF" }}>
                {search ? "Sin resultados" : `Sin ${title.toLowerCase()} aún`}
              </td></tr>
            )}
            {filtered.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #F3F4F6", background: idx % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                {renderRow(item).map((cell, ci) => (
                  <td key={ci} style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#374151" }}>{cell}</td>
                ))}
                <td style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button onClick={() => onToggle(item)}
                      style={{ padding: "3px 10px", background: "transparent", border: `1px solid ${item.is_active ? "#F59E0B" : "#6BB87A"}`, color: item.is_active ? "#F59E0B" : "#6BB87A", borderRadius: "6px", cursor: "pointer", fontSize: "0.73rem", fontWeight: 600 }}>
                      {item.is_active ? "Pausar" : "Activar"}
                    </button>
                    {delId === item.id ? (
                      <>
                        <button onClick={async () => { await onDelete(item); setDelId(null); }}
                          style={{ padding: "3px 10px", background: "#EF4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.73rem", fontWeight: 700 }}>
                          Confirmar
                        </button>
                        <button onClick={() => setDelId(null)}
                          style={{ padding: "3px 8px", background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.73rem" }}>
                          ✕
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setDelId(item.id)}
                        style={{ padding: "3px 10px", background: "transparent", border: "1px solid #EF4444", color: "#EF4444", borderRadius: "6px", cursor: "pointer", fontSize: "0.73rem", fontWeight: 600 }}>
                        Eliminar
      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
