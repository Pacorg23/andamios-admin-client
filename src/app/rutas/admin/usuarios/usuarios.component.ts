import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtService } from '../../../services/jwt.service';
import { Usuario } from '../../../models/admin/usuario';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { LoadingComponent } from '../../../effects/loading/loading.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIcon, LoadingComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  users: Usuario[] = []
  form: boolean = false
  formulario: FormGroup
  estadoForm: string = 'crear'
  tokenClaims: any
  idAux: number
  loading: boolean = false

  constructor(private userService:AdminService, private fb:FormBuilder,
    private tokenService:JwtService) {
      this.loading = true
      this.formulario = this.fb.group({
        user: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        pass: ['']
      })
      this.tokenClaims = tokenService.obtenerClaims()
      this.getUsers()
    }

    getUsers() {
      this.userService.obtenerUsuarios().subscribe(res => {
        const filterUsers = res.filter(user => user.id !== this.tokenClaims.id)
        this.users = filterUsers
        this.loading = false
      })
    }

    open() {
      this.estadoForm = 'crear'
      this.form = true
    }

    closeForm() {
      this.formulario.reset()
      document.getElementById('child').classList.add('outChild')
      document.getElementById('father').classList.add('outFather')
      setTimeout(() => {
        this.form = false
      }, 400);
    }

    editar(user: Usuario) {
      this.estadoForm = 'editar'
      this.formulario.setValue({
        user: user.user,
        email: user.email,
        pass: ''
      })
      this.idAux = user.id
      this.form = true
    }

    eliminar(id: number) {
      Swal.fire({
        title: '¿Estás seguro de eliminar este usuario?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Ingresa tu contraseña",
            input: 'password',
            inputLabel: 'Contraseña',
            inputPlaceholder: 'Ingresa tu contraseña',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
              if (!value) {
                return 'Debes ingresar tu contraseña'
              }
              return null;
            }
          }).then((result) => {
            if (result.isConfirmed) {
              let user = {
                id: this.tokenClaims.id,
                pass: result.value
              }
              this.loading = true
              this.userService.verificarPassword(JSON.stringify(user)).subscribe(res => {
                this.userService.eliminarUsuario(id).subscribe(res => {
                  Swal.fire({
                    title: "Usuario eliminado",
                    confirmButtonColor: "#3085d6",
                    timer: 2000,
                    icon: "success"
                  }).then(() => {
                    this.loading = false
                    this.getUsers()
                  })
                }, err => {
                  Swal.fire({
                    title: "Error",
                    confirmButtonColor: "#B30000",
                    timer: 2000,
                    text: "No se pudo eliminar el usuario",
                    icon: "error"
                  }).then(() => {
                    this.loading = false
                  })
                })
              }, err => {
                Swal.fire({
                  title: "Error",
                  confirmButtonColor: "#B30000",
                  timer: 2000,
                  text: "Contraseña incorrecta",
                  icon: "error"
                }).then(() => {
                  this.loading = false
                  this.closeForm()
                })
              })
            }
          })
        }
      })
    }

    subir() {
      if (this.formulario.valid) {
        if (this.estadoForm === 'crear') {

          Swal.fire({
            title: "Ingresa tu contraseña",
            input: 'password',
            inputLabel: 'Contraseña',
            inputPlaceholder: 'Ingresa tu contraseña',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
              if (!value) {
                return 'Debes ingresar tu contraseña'
              }
              return null;
            }
          }).then((result) => {
            if (result.isConfirmed) {
              let user = {
                id: this.tokenClaims.id,
                pass: result.value
              }
              this.loading = true
              this.userService.verificarPassword(JSON.stringify(user)).subscribe(res => {
                this.userService.crearUsuario(JSON.stringify(this.formulario.value)).subscribe(res => {
                  Swal.fire({
                    title: "Usuario creado",
                    confirmButtonColor: "#3085d6",
                    timer: 2000,
                    icon: "success"
                  }).then(() => {
                    this.loading = false
                    this.formulario.reset()
                    this.getUsers()
                    this.closeForm()
                  })

                }, err => {
                  Swal.fire({
                    title: "Error",
                    confirmButtonColor: "#B30000",
                    timer: 2000,
                    text: "No se pudo crear el usuario",
                    icon: "error"
                  }).then(() => {
                    this.loading = false
                  })
                })

              }, err => {
                Swal.fire({
                  title: "Error",
                  confirmButtonColor: "#B30000",
                  timer: 2000,
                  text: "Contraseña incorrecta",
                  icon: "error"
                }).then(() => {
                  this.loading = false
                  this.closeForm()
                })
              })
            }
          })

        } else if (this.estadoForm === 'editar') {
          Swal.fire({
            title: "Ingresa tu contraseña",
            input: 'password',
            inputLabel: 'Contraseña',
            inputPlaceholder: 'Ingresa tu contraseña',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
              if (!value) {
                return 'Debes ingresar tu contraseña'
              }
              return null;
            }
          }).then((result) => {
            if (result.isConfirmed) {
              let user = {
                id: this.tokenClaims.id,
                pass: result.value
              }
              this.loading = true
              this.userService.verificarPassword(JSON.stringify(user)).subscribe(res => {
                let updateUser = {
                  id: this.idAux,
                  user: this.formulario.value.user,
                  email: this.formulario.value.email,
                  pass: this.formulario.value.pass
                }
                this.userService.modificarUsuario(JSON.stringify(updateUser)).subscribe(res => {
                  Swal.fire({
                    title: "Usuario actualizado",
                    confirmButtonColor: "#3085d6",
                    timer: 2000,
                    icon: "success"
                  }).then(() => {
                    this.loading = false
                    this.formulario.reset()
                    this.getUsers()
                    this.closeForm()

                  })
                }, err => {
                  Swal.fire({
                    title: "Error",
                    confirmButtonColor: "#B30000",
                    timer: 2000,
                    text: "No se pudo actualizar el usuario",
                    icon: "error"
                  }).then(() => {
                    this.loading = false
                  })
                })
              }, err => {
                Swal.fire({
                  title: "Error",
                  confirmButtonColor: "#B30000",
                  timer: 2000,
                  text: "Contraseña incorrecta",
                  icon: "error"
                }).then(() => {
                  this.loading = false
                  this.closeForm()
                })
              })
            }
          })
        }
      } else {
        Swal.fire({
          title: "Error",
          confirmButtonColor: "#B30000",
          timer: 2000,
          text: "Faltan campos por llenar",
          icon: "error"
        }).then(() => {
          this.loading = false
        })
      }
    }

    cerrar(id) {

    }


}
