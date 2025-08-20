import { Routes } from '@angular/router';
import { InicioComponent } from './rutas/inicio/inicio.component';
import { ProveedoresComponent } from './rutas/proveedores/proveedores.component';
import { ClientesComponent } from './rutas/clientes/clientes.component';
import { LoginComponent } from './rutas/admin/login/login.component';
import { ApplicationComponent } from './application/application.component';
import { UsuariosComponent } from './rutas/admin/usuarios/usuarios.component';
import { loginGuard } from './guards/login.guard';
import { appGuard } from './guards/app.guard';
import { PerfilComponent } from './rutas/admin/perfil/perfil.component';

export const routes: Routes = [
  { path: 'login', component:LoginComponent, canActivate: [loginGuard]},
  {path:'', component:ApplicationComponent, children:[
    {path:'', redirectTo: 'inicio', pathMatch: 'full'},
    {path: 'inicio', component: InicioComponent},
    {path: 'proveedores', component: ProveedoresComponent},
    {path: 'clientes', component: ClientesComponent },
    {path: 'usuarios', component: UsuariosComponent },
    {path: 'perfil', component: PerfilComponent},
    {path: 'andamios', loadChildren: function() { return import('./rutas/andamios/andamios.routes').then(m => m.routes); }},
    {path: 'conten', loadChildren: function() { return import('./rutas/conten/conten.routes').then(m => m.routes); }},

  ], canActivate: [appGuard]}

];
