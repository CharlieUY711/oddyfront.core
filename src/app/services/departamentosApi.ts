import { supabase } from '../../utils/supabase/client';

export interface Departamento {
  id: string;
  nombre: string;
  color: string;
  icono?: string;
  orden?: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function fetchDepartamentos(activo?: boolean, search?: string): Promise<Departamento[]> {
  try {
    let query = supabase
      .from('departamentos')
      .select('*');
    
    if (activo !== undefined) {
      query = query.eq('activo', activo);
    }
    if (search) {
      query = query.ilike('nombre', `%${search}%`);
    }
    
    const { data, error } = await query.order('orden', { ascending: true, nullsFirst: false });
    
    if (error) {
      console.error('Error fetching departamentos:', error);
      throw new Error(error.message || 'Error cargando departamentos');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching departamentos:', error);
    throw error;
  }
}

export async function fetchDepartamentoById(id: string): Promise<Departamento | null> {
  try {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching departamento:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching departamento:', error);
    throw error;
  }
}

export async function createDepartamento(departamento: Partial<Departamento>): Promise<Departamento> {
  try {
    const { data, error } = await supabase
      .from('departamentos')
      .insert(departamento)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating departamento:', error);
      throw new Error(error.message || 'Error creando departamento');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating departamento:', error);
    throw error;
  }
}

export async function updateDepartamento(id: string, departamento: Partial<Departamento>): Promise<Departamento> {
  try {
    const { data, error } = await supabase
      .from('departamentos')
      .update({
        ...departamento,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating departamento:', error);
      throw new Error(error.message || 'Error actualizando departamento');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating departamento:', error);
    throw error;
  }
}

export async function deleteDepartamento(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('departamentos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting departamento:', error);
      throw new Error(error.message || 'Error eliminando departamento');
    }
  } catch (error) {
    console.error('Error deleting departamento:', error);
    throw error;
  }
}
