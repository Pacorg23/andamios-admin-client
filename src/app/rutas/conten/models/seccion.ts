export interface ImagesInput {
  id?: number; // Opcional porque es autoincremental
  name?: string; // Nombre de la imagen
  img?: string; // Imagen en formato Base64 o URL
}

export interface Seccion {
  id?: number; // Opcional porque es autoincremental
  title: string; // Nombre de la sección
  url?: string; // URL de la sección
  description: string; // Descripción de la sección
  img?: string; // Imagen en formato Base64 o URL -> Presentacion de la seccion
  file?: string; // Archivo en formato Base64 o URL -> Archivo para secciones de la categoria cerificaciones
  imgs: ImagesInput[]; // Arreglo de imágenes objeto ImagesInput -> {id, name, img}
  subSecciones?: Seccion[]; // Arreglo de subsecciones objeto Seccion -> {id, name, url}
  id_categoria?: number; // ID de la categoría a la que pertenece
  id_seccion?: number; // ID de la sección a la que pertenece -> para subsecciones
}

