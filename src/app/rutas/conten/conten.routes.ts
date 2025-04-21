import { Routes } from "@angular/router";
import { SeccionesComponent } from "../Generales/secciones/secciones.component";
import { HomeContenComponent } from "./home-conten/home-conten.component";
import { SolicitudesComponent } from "../Generales/solicitudes/solicitudes.component";
import { ContactoComponent } from "../Generales/contacto/contacto.component";
import { ContenidoFormComponent } from "./contenido-form/contenido-form.component";
import { ContenedorContenComponent } from "./contenedor-conten/contenedor-conten.component";
import { SeccionFormComponent } from "./seccion-form/seccion-form.component";
import { SucursalComponent } from "./sucursal/sucursal.component";
import { CarruselContenComponent } from "./carrusel-conten/carrusel-conten.component";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full"},
  { path: "home", component: HomeContenComponent},
  { path: "secciones/:area", component:SeccionesComponent},
  { path: "solicitudes/:division", component: SolicitudesComponent },
  { path: "contacto/:area", component: ContactoComponent },
  { path: "sucursales", component: SucursalComponent },
  { path: "editor", component: ContenedorContenComponent },
  { path: "categoria", component: ContenidoFormComponent },
  { path: "categoria/:id", component: ContenidoFormComponent },
  { path: "seccion/:categoriaId", component: SeccionFormComponent },
  { path: "seccion/:categoriaId/:seccionName", component: SeccionFormComponent },
  { path: "carrusel", component: CarruselContenComponent },
]
