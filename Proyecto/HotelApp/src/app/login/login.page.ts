import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbserviceService } from '../dbservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo: any='';
  contrasenia: any='';
  idCliente: any='';

  constructor(private router: Router, private alertController: AlertController,private dbService: DbserviceService) { }//se debe instanciar

  ngOnInit() {
  }

  async ingresar() {//esta en el boton ingresar
    // Verifica si alguno de los campos está vacío
    if (!this.correo.trim() || !this.contrasenia.trim()) {
      this.mostrarAlerta("Error", "Por favor completa todos los campos");
      return; // Detiene la ejecución si hay algún campo vacío y manda un mensaje
    }else{
    // Si los campos NO están vacíos, procede con la navegación
    //verificar al usuario en la base de datos
      try {
        
        const user_id = await this.dbService.validarUsuario(this.correo, this.contrasenia);
        if (user_id) {
          //aquí  guardamos los valores en el localStorage de usuario y passwod
          this.idCliente=user_id;
          localStorage.setItem('correo',this.correo);
          localStorage.setItem('contrasenia',this.contrasenia);
          localStorage.setItem('idClienteo', this.idCliente.toString());
          this.mostrarAlerta('Éxito', 'Inicio de sesión exitoso '+ this.correo);
          this.router.navigate(['/menu/home']); // nos manda al menu
        } else {
          this.mostrarAlerta('Error', 'Usuario o contraseña incorrectos');
        }
      } catch (error:any) {
        this.mostrarAlerta('Error', 'Error al iniciar sesión'+error.message);
        console.error(error);
        
      }
    }
  }

  //esta es la ventana del mensaje en caso de error.
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
  
    await alert.present();
  }
  
    registrar(){
      this.router.navigate(['/register']);//nos redirige a registrarse
      console.log('voy a registrarme');
    }
    volverHome(){
      this.router.navigate(['/home']);//nos redirige al home
      console.log('voy a registrarme');
    }

}
