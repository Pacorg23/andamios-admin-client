export class Categoria {
  idCategoria: number;
  nombreCategoria: string;
  tipoCategoria: string;
  secciones: Seccion[];
}

export class Seccion {
  idSeccion: number;
  nombreSeccion: string;
  subsecciones: Subseccion[];
}

export class Subseccion {
  id?: number;
  nombre: string;
}
