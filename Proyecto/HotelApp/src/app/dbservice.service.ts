import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx';
import {ToastController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import { ActivatedRoute,Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
    //variable publica con ! para no tener que inicializarla
    public db!: SQLiteObject;

    // observable
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false); // maneja el estado de la BD y los usuarios

  // crear objetos dentro del constructor
  // 1 sqlt
  // 2 toast controller
  constructor(
    private sqlite: SQLite,
    private toastController: ToastController,
    private activerouter: ActivatedRoute,
    private router: Router) {
    this.initDatabase(); // inicializar la base de datos
  }

  async initDatabase() {
    try {
      const db = await this.sqlite.create({
        name: 'mydb.db', // nombre BD
        location: 'default' // lugar donde esta guardada por defecto
      });
      this.db = db;
      // si no se cae, va a crear las tablas y va a mandar el mensaje
      await this.crearTablaCliente();
      this.isDBReady.next(true); // muestra true cuando la base de datos está lista
      await this.mostrarAlerta('Felicidades!', 'Base de datos y tabla creadas con éxito');
    } catch (error: any) {
      await this.mostrarAlerta('Error', 'Error al crear la tabla: ' + error.message);
    }
  }

  // crear tablas
  async crearTablaCliente() {
    try {
      await this.sqlite.create({ name: 'mydb.db', location: 'default' })
        .then((db: SQLiteObject) => {
          return db.executeSql(`
            CREATE TABLE IF NOT EXISTS cliente (
              id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
              nombre_cliente TEXT,
              apellido_cliente TEXT,
              correo_cliente TEXT,
              telefono_cliente TEXT,
              contrasenia TEXT,
              recuperacion_contrasenia TEXT,             
            )
          `, [])
            .then(async () => {
              // Verifica si la tabla usuarios se creó correctamente
              const result = await db.executeSql(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='cliente';
              `, []);
              if (result.rows.length > 0) {
                await this.mostrarAlerta('Felicidades!', 'Tabla cliente fue creada correctamente');
              } else {
                await this.mostrarAlerta('Error', 'No se pudo crear la tabla cliente');
              }
            })
            .catch(e => console.error('Error al crear la tabla cliente', e));
        });
    } catch (error:any) {
      console.error('Error en crearTablaCliente', error.message);
    }
  }
  

  // insertar los datos a la tabla cliente
  async insertarUsuario(nombre: string, apellido: string, correo: string, telefono: string, contrasenia: string, recuperacionContrasenia: string) {
    try {
      const result = await this.db.executeSql(`INSERT INTO cliente(nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, contrasenia, recuperacion_contrasenia) VALUES(?,?,?,?,?,?)`, [nombre, apellido, correo, telefono, contrasenia, recuperacionContrasenia]);
      
      if (result.rowsAffected > 0) {
        // Obtener el ID del cliente recién insertado
        const id = await this.db.executeSql(`SELECT id_cliente FROM cliente WHERE correo_cliente = ? AND contrasenia = ?`, [correo, contrasenia]);

        return id; // Retorna el ID del cliente insertado si la inserción fue exitosa
      } else {
        console.log('Hubo un error al ingresar el cliente.');
        return false; // Retorna false si la inserción falló
      }
    } catch (error: any) {
      console.error('Error al ingresar cliente:', error.message);
      throw error; // Lanza el error para ser capturado por el componente
    }
  }

  // mostrar mensaje
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.toastController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

}
