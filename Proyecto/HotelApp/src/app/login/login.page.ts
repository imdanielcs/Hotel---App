import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api.service'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo: string = '';
  contrasenia: string = '';
  idCliente: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService // Usamos ApiService en lugar de DbserviceService
  ) {}

  ngOnInit() {}

  async ingresar() {
    // Verifica si alguno de los campos está vacío
    if (!this.correo.trim() || !this.contrasenia.trim()) {
      this.mostrarAlerta('Error', 'Por favor completa todos los campos');
      return; // Detiene la ejecución si hay algún campo vacío
    }

    // Si los campos NO están vacíos, procede a verificar el usuario
    try {
      const response = await this.apiService.validarUsuario(this.correo, this.contrasenia).toPromise();

      if (response && response.idCliente) {
        // Si el usuario es válido, guardamos los valores en el localStorage
        this.idCliente = response.idCliente;
        localStorage.setItem('correo', this.correo);
        localStorage.setItem('contrasenia', this.contrasenia);
        localStorage.setItem('idCliente', this.idCliente.toString());
        this.mostrarAlerta('Éxito', 'Inicio de sesión exitoso ' + this.correo + response);
        this.router.navigate(['/home']); // Redirigir al menú
      } else {
        this.mostrarAlerta('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error: any) {
      this.mostrarAlerta('Error', 'Error al iniciar sesión: ' + error.message);
      console.error(error);
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  registrar() {
    this.router.navigate(['/register']); // Redirigir a registrarse
  }

  volverHome() {
    this.router.navigate(['/home']); // Redirigir al home
  }
}
