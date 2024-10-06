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
  isCorreoExist: boolean = false;
  selectedDate: string;
  

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService ,
    private modalController: ModalController,

  ) {
    this.correo = localStorage.getItem('correo');
    this.contrasenia = localStorage.getItem('contrasenia');
    this.idCliente =Number(localStorage.getItem('idCliente')) ;
    this.selectedDate = '';
  
   }

 
  ngOnInit() {
    this.checkCorreo();
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

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<number>>;
    if (ev.detail.role === 'confirm') {
     this.message = `Hello, ${ev.detail.data}!`;
    }
  }


  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  
  onDateChange(event: any) {
    const fullDate = event.detail.value; // Capturamos el valor completo que incluye la hora
    this.selectedDate = fullDate.split('T')[0]; // Tomamos solo la parte de la fecha y descartamos la hora
    console.log('Fecha seleccionada sin hora:', this.selectedDate);
    this.mostrarAlerta('Fecha', 'A selecionado la fechas: '+ this.selectedDate);
  }

  confirm(fechaInt: Date, id: number, idCliente: number) {
    this.modalController.dismiss(null, 'confirm');
  }

  continuarReserva() {
    // Verificamos si el id está entre 1 y 4
    if (this.id >= 1 && this.id <= 4) {
      console.log('ID válido, proceder con la reserva');
      
      // Simulamos el clic en el botón que abre el modal (asegúrate de que exista en el HTML)
      const modalButton = document.getElementById('open-modal-depositar');
      if (modalButton) {
        modalButton.click(); // Dispara el modal si el ID es válido
      } else {
        console.log('Botón del modal no encontrado');
      }
    } else {
      console.log('ID no válido, no se puede continuar con la reserva');
      // Mostramos un mensaje de error al usuario
      this.mostrarAlerta('Error', 'Por favor, selecciona una habitación válida.');
    }
  }

  checkCorreo() {
    // Obtener el correo del localStorage
    this.correo = localStorage.getItem('correo');

    // Si el correo existe, permitir reservas
    if (this.correo) {
      this.isCorreoExist = true;
    } else {
      this.isCorreoExist = false;
    }
  }

  seleccionarHabitacion(nombreHabitacion: string, id: number, precio: string) {
    if (!this.isCorreoExist) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }else{
      this.habitacionSeleccionada = nombreHabitacion;
      this.id = id;
      this.precio = precio
    }

    // Lógica para seleccionar la habitación
    console.log('Habitación seleccionada:', nombreHabitacion, id, precio);
  }


  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  

}
