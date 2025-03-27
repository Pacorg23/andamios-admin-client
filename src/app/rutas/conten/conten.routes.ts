import { Routes } from "@angular/router";
import { SeccionesComponent } from "../Generales/secciones/secciones.component";
import { HomeContenComponent } from "./home-conten/home-conten.component";
import { SolicitudesComponent } from "../Generales/solicitudes/solicitudes.component";
import { ContactoComponent } from "../Generales/contacto/contacto.component";
import { SucursalesAndamiosComponent } from "../Generales/sucursales/sucursales-andamios.component";
import { ContenidoFormComponent } from "./contenido-form/contenido-form.component";
import { ContenedorContenComponent } from "./contenedor-conten/contenedor-conten.component";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full"},
  { path: "home", component: HomeContenComponent},
  { path: "secciones/:area", component:SeccionesComponent},
  { path: "solicitudes/:division", component: SolicitudesComponent },
  { path: "contacto/:area", component: ContactoComponent },
  { path: "sucursales/:division", component: SucursalesAndamiosComponent },
  { path: "editor", component: ContenedorContenComponent },
  { path: "categoria", component: ContenidoFormComponent },
  { path: "categoria/:name", component: ContenidoFormComponent }
]
