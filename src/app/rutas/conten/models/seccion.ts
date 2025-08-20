export interface FileInput {
  id?: number; // Opcional porque es autoincremental
  title?: string; // Nombre de la imagen
  data?: string; // Imagen en formato Base64 o URL
  Secciones_Conten_Id?: string; // Imagen en formato Base64 o URL
  Categorias_Conten_Id?: string; // Imagen en formato Base64 o URL
  Subsecciones_Conten_Id?: string; // Imagen en formato Base64 o URL
}

export interface Section {
  id?: number; // Opcional porque es autoincremental
  title: string; // Nombre de la sección
  url?: string; // URL de la sección
  description: string; // Descripción de la sección
  img?: string; // Imagen en formato Base64 o URL -> Presentacion de la seccion
  file?: string; // Archivo en formato Base64 o URL -> Archivo para secciones de la categoria cerificaciones
  imgs: FileInput[]; // Arreglo de imágenes objeto ImagesInput -> {id, name, img}
  subSecciones?: Section[]; // Arreglo de subsecciones objeto Seccion -> {id, name, url}
  id_categoria?: number; // ID de la categoría a la que pertenece
  id_seccion?: number; // ID de la sección a la que pertenece -> para subsecciones
}

