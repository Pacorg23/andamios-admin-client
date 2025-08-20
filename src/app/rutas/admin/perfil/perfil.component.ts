import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { JwtService } from '../../../services/jwt.service';
import { Usuario } from '../../../models/admin/usuario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '../../../effects/loading/loading.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIcon, LoadingComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  user:Usuario
  claims:any
  formulario: FormGroup
  loading:boolean = false

  constructor(private activatedroute:ActivatedRoute, private adminService:AdminService, private token:JwtService,
    private fb:FormBuilder, private router:Router) {
    this.claims = token.obtenerClaims()
    this.user = {
      id: this.claims.id,
      user:this.claims.user,
      email:this.claims.email,
      pass:undefined
    }

    this.formulario = this.fb.group({
      user: [this.user.user, Validators.required],
      email: [this.user.email, [Validators.email, Validators.required]],
      pass: ['']
    })
   }

   actualizar() {

    this.loading = true

    let user = {
      id: this.user.id,
      user: this.formulario.value.user,
      email: this.formulario.value.email,
      pass: this.formulario.value.pass
    }

    this.adminService.modificarUsuario(user).subscribe(res => {
      Swal.fire({
        title: "Usuario actualizado",
        text:"Tendras que volver a iniciar sesion",
        timer: 2000,
        icon: "success",
        showConfirmButton: false
      }).then(()=>{
        this.token.deleteToken()
        this.router.navigate(['/login'])
        this.loading = false
      })
    },err=>{
      Swal.fire({
        title: "Error al actualizar",
        confirmButtonColor: "#3085d6",
        text:err.error.message,
        icon: "error"
      }).then (()=>{
        this.loading = false
      })
    })
  }

  eliminar(){
    this.loading = true
    Swal.fire({
      title: '¿Estas seguro de eliminar tu cuenta?',
      text: "No podras recuperarla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.eliminarUsuario(this.user.id).subscribe(res=>{
          Swal.fire({
            title: "Usuario eliminado",
            text:"Tu cuenta ha sido eliminada, regresaras al login",
            timer: 2000,
            icon: "success",
            showConfirmButton: false
          }).then(()=>{
            this.token.deleteToken()
          this.router.navigate(['/login'])
          this.loading = false
          })
        },err=>{
          Swal.fire({
            title: "Error al eliminar",
            confirmButtonColor: "#3085d6",
            text:err.error.message,
            icon: "error"
          }).then (()=>{
            this.loading = false
          })
        })
      }
    })
  }





}
