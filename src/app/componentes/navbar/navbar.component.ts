import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { JwtService } from '../../services/jwt.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIcon, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user: any
  iconoActual: string = "menu"

  constructor(private router: Router, private tokenService: JwtService,
    private jwtService: JwtService, private adminService: AdminService) {
    this.user = tokenService.obtenerClaims()
  }


  cerrarSesion() {
    this.adminService.cerrarSesion(this.user.id, this.user.id).subscribe(() => {
      Swal.fire({
        title: "Adiós..!",
        timerProgressBar: true,
        text: "Entraras al Login automaticamente",
        showConfirmButton: true,
        confirmButtonColor: "#B30000",
        confirmButtonText: "Salir"
      }).then(() => {
        this.jwtService.deleteToken()

      })
    })
    this.router.navigate(['/'])
  }

  mostrarMenu() {

    if (this.iconoActual == 'close') {
      this.iconoActual = 'menu'
    } else if (this.iconoActual == 'menu') {
      this.iconoActual = 'close'
    }

    document.getElementById("contenido").classList.toggle("show")
  }

}
