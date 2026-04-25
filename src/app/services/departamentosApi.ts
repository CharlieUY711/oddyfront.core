import { supabase } from '../../utils/supabase/client';

export interface Departamento {
  id:         string;
  nombre:     string;
  color:      string;
  activo:     boolean;
  orden:      number;
  created_at?: string;
}

export async function fetchDepartamentos(activo?: boolean): Promise<Departamento[]> {
  let query = supabase.from('departamentos').select('*').order('orden', { ascending: true, nullsFirst: false });
  if (activo !== undefined) query = query.eq('activo', activo);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchDepartamentoById(id: string): Promise<Departamento | null> {
  const { data } = await supabase.from('departamentos').select('*').eq('id', id).single();
  return data;
}

export async function createDepartamento(d: Partial<Departamento>) {
  const { data, error } = await supabase.from('departamentos').insert(d).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateDepartamento(id: string, d: Partial<Departamento>) {
  const { data, error } = await supabase.from('departamentos').update(d).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDepartamento(id: string) {
  const { error } = await supabase.from('departamentos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
