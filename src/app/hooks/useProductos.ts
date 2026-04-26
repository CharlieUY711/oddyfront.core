import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase/client';
import { fetchDepartamentos, type Departamento } from '../services/departamentosApi';

export interface ShProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  department?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeColor?: string;
  seller?: string;
  condition?: string;
}

interface DepartamentoConCats extends Departamento {
  categorias: { id: string; nombre: string; departamento_id: string }[];
}

export function useProductos() {
  const [productos, setProductos] = useState<ShProduct[]>([]);
  const [productosSecondHand, setProductosSecondHand] = useState<ShProduct[]>([]);
  const [departamentos, setDepartamentos] = useState<DepartamentoConCats[]>([]);
  const [deptColors, setDeptColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Cargar departamentos
        const depts = await fetchDepartamentos(true);

        // Traer categorias para el menu
        const { data: catsData } = await supabase
          .from('categorias')
          .select('id, nombre, departamento_id')
          .eq('activo', true)
          .order('nombre');

        // Anidar categorias en departamentos
        const deptsConCats: DepartamentoConCats[] = depts.map(function(d) {
          return {
            ...d,
            categorias: (catsData || []).filter(function(cat) {
              return cat.departamento_id === d.id;
            })
          };
        });
        setDepartamentos(deptsConCats);

        // Crear mapa de colores
        const colors: Record<string, string> = {};
        depts.forEach(function(dept) {
          colors[dept.nombre] = dept.color || '#C8C4BE';
        });
        setDeptColors(colors);

        // Cargar productos (mock por ahora)
        setProductos([]);
        setProductosSecondHand([]);

      } catch (err: any) {
        setError(err.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return {
    productos,
    productosSecondHand,
    departamentos,
    deptColors,
    loading,
    error,
  };
}
