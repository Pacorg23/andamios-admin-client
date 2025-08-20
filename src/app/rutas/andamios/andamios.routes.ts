import { Routes } from "@angular/router";
import { SeccionesComponent } from "../Generales/secciones/secciones.component";
import { HomeAndamiosComponent } from "./home-andamios/home-andamios.component";
import { ContactoComponent } from "../Generales/contacto/contacto.component";
import { SolicitudesComponent } from "../Generales/solicitudes/solicitudes.component";
import { CarruselAndamiosComponent } from "./carrusel-andamios/carrusel-andamios.component";
import { AnuncioComponent } from "./anuncio/anuncio.component";
import { SucursalesAndamiosComponent } from "../Generales/sucursales/sucursales-andamios.component";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full"},
  { path: "home", component: HomeAndamiosComponent},
  { path: "secciones/:area", component:SeccionesComponent},
  { path: "contacto/:area", component: ContactoComponent },
  { path: "solicitudes/:division", component: SolicitudesComponent },
  { path: "carrusel", component:CarruselAndamiosComponent },
  { path: "anuncio", component: AnuncioComponent},
  { path: "sucursales/:division", component: SucursalesAndamiosComponent },
  //{ path: "**", redirectTo: "home"}
];
