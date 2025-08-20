import { Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';

interface DecodedToken { //inetrfaz para jwt
  claims: JwtPayload;
  iat: number;
  // Otras propiedades según sea necesario
  // como la duracion etc
}

@Injectable({
  providedIn: 'root'
})

export class JwtService {

  decoded:DecodedToken

  constructor(private cookie:CookieService) { }

  obtenerClaims(){

    if(this.cookie.check("token")){
      let token = this.cookie.get("token")
      this.decoded= jwtDecode(token)
      return this.decoded.claims
    }

    return this.decoded
  }

  deleteToken(){
    this.cookie.delete("token")
    console.log("Token eliminado")
  }
}
