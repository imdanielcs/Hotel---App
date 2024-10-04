import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private alertController:AlertController) {}

  navigateToHome( ) {
    
    this.router.navigate(['/home']);

  }

  navigateToLogin() {
  
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
  
    this.router.navigate(['/register']);

  }
  navigateToRoom() {
  
    this.router.navigate(['/rooms']);

  }

  navigateToCheckinCheckout() {
  
    this.router.navigate(['/checkin-checkout']);

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

}
