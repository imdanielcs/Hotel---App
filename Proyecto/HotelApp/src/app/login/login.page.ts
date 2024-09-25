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
  usuario: any='';
  password: any='';
  idUsuario: any='';

  constructor(private router: Router, private alertController: AlertController,private dbService: DbserviceService) { }//se debe instanciar

  ngOnInit() {
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

}
