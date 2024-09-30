import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DbserviceService } from '../dbservice.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  contrasenia: string = '';
  nombre:string = '';
  apellido:string = '';
  correo:string = '';
  fecha:string = '';
  id: number = 0;
  telefono:string = '';
  recuperacionContrasenia:string = '';

  constructor(private router: Router,private alertController: AlertController,private dbService: DbserviceService) { }

  ngOnInit() {
  }
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async registrarse(){
    // Verifica si alguno de los campos está vacío
    if (!this.nombre.trim() || !this.contrasenia.trim()) {
      this.mostrarAlerta("Error", "Por favor completa todos los campos");
      return; // Detiene la ejecución si hay algún campo vacío y manda un mensaje
    }else{

      // Si los campos NO están vacíos, procede con la navegación          
      //ingrersar datos a la base de datos: 
      try {
        const success = await this.dbService.insertarUsuario(this.nombre, this.apellido, this.correo, this.telefono, this.contrasenia, this.recuperacionContrasenia);

        if (success) {
          this.id = success;
          this.mostrarAlerta("Correcto", "su usuario fue creado correctamente");
          //aquí  guardamos los valores en el localStorage de usuario y passwod
          localStorage.setItem('usuario',this.nombre);
          localStorage.setItem('password',this.contrasenia);
          localStorage.setItem('id',this.id.toString());

          //localStorage.setItem('id',this.id.toString());//para guardar el id del usuario
          //insertamos usuario en la segunda tabla

          
        } else {
          console.log('Hubo un error al registrar el usuario.');
        }
      } catch (error: any) {
        this.mostrarAlerta('Error', 'Error al registrar el usuario'+ error.message);
        console.error('Error al registrar el usuario:', error.message);
      }

       
    }
}
volverHome(){
  this.router.navigate(['/home']);//nos redirige al home
  console.log('voy a registrarme');
}

}
