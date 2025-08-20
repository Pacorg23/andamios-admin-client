import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formulario:FormGroup

  constructor(private fb:FormBuilder, private adminService:AdminService, private cookie:CookieService, private router:Router) {
    this.formulario = fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    })
   }

  login(){

    this.adminService.login(JSON.stringify(this.formulario.value)).subscribe((res)=>{
      this.cookie.set("token", res['token'])
      this.router.navigate(['/'])
    }, error =>{
      Swal.fire({
        title: 'Error!',
        text: error.error.message,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      })
    })

  }
}
