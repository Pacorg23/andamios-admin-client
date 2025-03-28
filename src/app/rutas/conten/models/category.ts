import { Seccion } from "../../../models/general/navbar";

export interface Category {
  id?: number; // Opcional porque es autoincremental
  title: string; // Nombre de la categoría *
  tipo: string; // Tipo de categoría (A, B, C, D) *
  is_active?: boolean; // Estado activo/inactivo // TODO  mostrar en la vista
  has_sections?: boolean; // Indica si tiene secciones -> tipo B default true
  url?: string; // URL de la categoría *
  is_default?: boolean; // Indica si es la categoría por defecto -> false para secciones creadas personalziadas
  description: string; // Descripción de la categoría *
  img?: string; // Imagen en formato Base64 o URL -> Banner de la categoría *
  sections?: Seccion[]; // Arreglo de secciones objeto Seccion -> {id, name, url}
}
