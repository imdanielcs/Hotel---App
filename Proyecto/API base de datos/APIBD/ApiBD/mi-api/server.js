// server.js

const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const mailjetLib = require('node-mailjet');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const app = express();
const port = 3000;

// Cargar la configuración desde config.yaml
let config;
try {
  const configPath = path.join(__dirname, './config.yml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  config = yaml.load(fileContents);
  console.log('Configuración cargada correctamente desde config.yaml');
} catch (e) {
  console.error('Error al cargar config.yaml:', e);
  process.exit(1); // Salir si no se puede cargar la configuración
}

// Configuración de la conexión a la base de datos Oracle
const dbConfig = {
  user: config.database.user,
  password: config.database.password,
  connectString: config.database.connectString,
};

// Configuración de Mailjet
const mailjet = mailjetLib.connect(config.mailjet.apiKey, config.mailjet.apiSecret);

// Habilitar CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.options('*', cors());

// Middleware para JSON
app.use(express.json());

// Endpoint de prueba para Mailjet
app.get('/api/test-mailjet', (req, res) => {
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": config.emailSender.email,
            "Name": config.emailSender.name
          },
          "To": [
            {
              "Email": "MAILDEPRUEBA",
              "Name": "Cliente"
            }
          ],
          "Subject": "Prueba de Envío de Correo",
          "TextPart": "Este es un correo de prueba desde Mailjet.",
          "HTMLPart": "<h3>¡Prueba Exitosa!</h3><p>Este es un correo de prueba desde Mailjet.</p>"
        }
      ]
    });

  request
    .then((result) => {
      console.log('Correo enviado:', result.body);
      res.json({ message: 'Correo enviado correctamente' });
    })
    .catch((err) => {
      console.error('Error al enviar el correo:', err.statusCode);
      res.status(500).json({ error: 'Error al enviar el correo' });
    });
});

// Endpoint para validar usuario usando GET
app.get('/api/login', async (req, res) => {
  let connection;
  const { correo, contrasenia } = req.query;
  console.log('Entrando al endpoint /api/login');
  console.log(`Correo: ${correo}, Contraseña: ${contrasenia}`);

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log('Conectado a la base de datos Oracle');

    const result = await connection.execute(
      `SELECT id_cliente FROM cliente WHERE email_cliente = :correo_cliente AND contrasenia = :contrasenia`,
      { correo_cliente: correo, contrasenia: contrasenia }
    );

    if (result.rows.length > 0) {
      const idCliente = result.rows[0][0];
      res.json({ idCliente });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Conexión cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Endpoint para obtener datos
app.get('/api/datos', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log('Conectado a la base de datos Oracle');

    const result = await connection.execute('SELECT * FROM cliente');

    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Conexión cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Endpoint para realizar una reserva
app.get('/api/reservar', async (req, res) => {
  let connection;
  const { idCliente, idHabitacion, fechaReserva } = req.query;

  console.log('Entrando al endpoint /api/reservar');
  console.log(`idCliente: ${idCliente}, idHabitacion: ${idHabitacion}, fechaReserva: ${fechaReserva}`);

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log('Conectado a la base de datos Oracle');

    // Validar que el cliente existe y obtener su correo electrónico
    const clienteResult = await connection.execute(
      `SELECT id_cliente, email_cliente FROM cliente WHERE id_cliente = :id_cliente`,
      { id_cliente: idCliente }
    );

    if (clienteResult.rows.length === 0) {
      res.status(400).json({ message: 'El cliente no existe' });
      return;
    }

    const emailCliente = clienteResult.rows[0][1]; // Suponiendo que email_cliente está en la segunda columna

    // Validar que la habitación existe
    const habitacionResult = await connection.execute(
      `SELECT id_habitacion FROM habitacion WHERE id_habitacion = :id_habitacion`,
      { id_habitacion: idHabitacion }
    );

    if (habitacionResult.rows.length === 0) {
      res.status(400).json({ message: 'La habitación no existe' });
      return;
    }

    // Verificar disponibilidad de la habitación en la fecha dada
    const reservaExistente = await connection.execute(
      `SELECT 1 FROM reserva WHERE id_habitacion_fk = :id_habitacion AND fecha_reserva = TO_DATE(:fecha_reserva, 'YYYY-MM-DD')`,
      { id_habitacion: idHabitacion, fecha_reserva: fechaReserva }
    );

    if (reservaExistente.rows.length > 0) {
      return res.status(200).json({ message: 'La habitación no está disponible en esa fecha' });
    }

    // Insertar la reserva en la base de datos
    const insertResult = await connection.execute(
      `INSERT INTO reserva (id_cliente_fk, id_habitacion_fk, fecha_reserva)
       VALUES (:id_cliente_fk, :id_habitacion_fk, TO_DATE(:fecha_reserva, 'YYYY-MM-DD'))`,
      {
        id_cliente_fk: idCliente,
        id_habitacion_fk: idHabitacion,
        fecha_reserva: fechaReserva,
      },
      { autoCommit: true } // Confirmar la transacción automáticamente
    );

    console.log('Reserva insertada correctamente');

    // Obtener el ID de la reserva insertada (ajusta según tu configuración de Oracle DB)
    const reservaId = insertResult.lastRowid || '123456';

    // Enviar correo de confirmación
    const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": config.emailSender.email,
              "Name": config.emailSender.name
            },
            "To": [
              {
                "Email": emailCliente,
                "Name": "Cliente"
              }
            ],
            "Subject": "Confirmación de Reserva",
            "TextPart": `¡Hola!\n\nTu reserva para la habitación ID ${idHabitacion} en la fecha ${fechaReserva} ha sido realizada correctamente.\n\nGracias por confiar en nosotros.`,
            "HTMLPart": `
              <div style="font-family: Arial, sans-serif; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #007BFF; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                  <h2 style="color: #ffffff; margin: 0;">¡Reserva Confirmada!</h2>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-top: none; border-radius: 0 0 5px 5px;">
                  <p>Hola,</p>
                  <p>Nos complace informarte que tu reserva se ha realizado correctamente con los siguientes detalles:</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 8px; border: 1px solid #dddddd;"><strong>ID de Cliente:</strong></td>
                      <td style="padding: 8px; border: 1px solid #dddddd;">${idCliente}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border: 1px solid #dddddd;"><strong>ID de Habitación:</strong></td>
                      <td style="padding: 8px; border: 1px solid #dddddd;">${idHabitacion}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border: 1px solid #dddddd;"><strong>Fecha de Reserva:</strong></td>
                      <td style="padding: 8px; border: 1px solid #dddddd;">${fechaReserva}</td>
                    </tr>
                  </table>
                  <p>Por favor, presenta el siguiente código QR al momento de tu llegada para agilizar el proceso de check-in:</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?data=ReservaID:${reservaId}&size=150x150" alt="Código QR de Reserva" style="width: 150px; height: 150px;" />
                  </div>
                  <p>¡Esperamos que disfrutes tu estancia!</p>
                  <p>Saludos cordiales,<br/><strong>Equipo de Reservas</strong></p>
                </div>
                <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777777;">
                  <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                  <p>© ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
                </div>
              </div>
            `
          }
        ]
      });

    request
      .then((result) => {
        console.log('Correo enviado:', result.body);
      })
      .catch((err) => {
        console.error('Error al enviar el correo:', err.statusCode);
      });

    res.json({ message: 'Reserva realizada con éxito y correo de confirmación enviado' });
  } catch (err) {
    console.error('Error al realizar la reserva:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Conexión cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Endpoint para listar las habitaciones disponibles en una fecha específica
app.get('/api/habitacionesDisponibles', async (req, res) => {
  let connection;
  const { fecha } = req.query;

  try {
    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere el parámetro fecha en formato YYYY-MM-DD' });
    }

    connection = await oracledb.getConnection(dbConfig);
    console.log('Conectado a la base de datos Oracle');

    const result = await connection.execute(
      `SELECT h.id_habitacion, h.numero_habitacion, h.tipo_habitacion, h.precio_habitacion
       FROM habitacion h
       WHERE h.id_habitacion NOT IN (
         SELECT r.id_habitacion_fk FROM reserva r
         WHERE r.fecha_reserva = TO_DATE(:fecha, 'YYYY-MM-DD')
       )`,
      { fecha }
    );

    const habitaciones = result.rows.map(row => ({
      idHabitacion: row[0],
      numeroHabitacion: row[1],
      tipoHabitacion: row[2],
      precioHabitacion: row[3]
    }));

    res.json(habitaciones);

  } catch (err) {
    console.error('Error al obtener las habitaciones disponibles:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Conexión cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
