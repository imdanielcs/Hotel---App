import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  opcion: string = '';
  fecha: string = '';
  count: number = 0;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService 
  ) { }

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

  

}
