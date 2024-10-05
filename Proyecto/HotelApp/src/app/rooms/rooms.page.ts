import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController,ModalController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { OverlayEventDetail } from '@ionic/core/components';



@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  message = 'This modal example ';
  opcion: string = '';
  fecha: string = '';
  count: number = 0;
  precio: string = '';
  habitacionSeleccionada: string = '';
  id: number = 0;
  correo: any = '';
  contrasenia: any = '';
  idCliente: any = '';
  

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService ,
    private modalController: ModalController,

  ) {
    this.correo = localStorage.getItem('correo');
    this.contrasenia = localStorage.getItem('contrasenia');
    this.idCliente =Number(localStorage.getItem('idCliente')) ;
  
   }

 
  ngOnInit() {
  }

  volverHome() {
    this.router.navigate(['/home']); // Redirigir al home
  }
  // Método para incrementar el contador
  increment() {
    this.count++;
  }

  // Método para decrementar el contador
  decrement() {
    this.count--;
  }

  seleccionarHabitacion(habitacion: string, id: number, precio: string) {
    this.habitacionSeleccionada = habitacion;
    this.id = id;
    this.precio = precio
  }
  onWillDismissDepositarme(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<number>>;
    if (ev.detail.role === 'confirm') {
     this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  onWillDismissDepositar(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<number>>;
    if (ev.detail.role === 'confirm') {
     this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    this.modalController.dismiss(null, 'confirm');
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
  

}
