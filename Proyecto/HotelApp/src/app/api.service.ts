import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/login';
  private apiReservaUrl = 'http://localhost:3000/api/reservar';

  constructor(private http: HttpClient) {}

  validarUsuario(correo: string, contrasenia: string): Observable<any> {
    // Prepara los parámetros de la solicitud
    const params = new HttpParams()
      .set('correo', correo)
      .set('contrasenia', contrasenia);

    // Realiza la solicitud GET con los parámetros en la URL
    return this.http.get<any>(this.apiUrl, { params });
  }

  enviaReserva(idCliente: string, idHabitacion: string, fechaReserva: string): Observable<any> {
    // Prepara los parámetros de la solicitud
    const params = new HttpParams()
      .set('idCliente', idCliente)
      .set('idHabitacion', idHabitacion)
      .set('fechaReserva', fechaReserva);

    // Realiza la solicitud GET con los parámetros en la URL
    return this.http.get<any>(this.apiReservaUrl, { params });
  }
}
