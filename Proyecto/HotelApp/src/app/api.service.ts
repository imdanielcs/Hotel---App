import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.0.107:3000/api/login'; // Cambia a la IP de tu máquina

  constructor(private http: HttpClient) {}

  validarUsuario(correo: string, contrasenia: string): Observable<any> {
    // Prepara los parámetros de la solicitud
    const params = new HttpParams()
      .set('correo', correo)
      .set('contrasenia', contrasenia);

    // Realiza la solicitud GET con los parámetros en la URL
    return this.http.get<any>(`http://192.168.0.107:3000/api/login`, { params });
  }
}
