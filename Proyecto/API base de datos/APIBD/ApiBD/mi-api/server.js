const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors'); // Importar el paquete cors
const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos Oracle
const dbConfig = {
    user: 'system', // Cambia esto por tu usuario
    password: 'sas', // Cambia esto por tu contraseña
    connectString: 'localhost:1521/ORCL' // Cambia esto por tu SID (nombre de servicio)
};

// Habilitar CORS para todas las solicitudes desde 'localhost:8100'
app.use(cors({
    origin: 'http://localhost:8100', // La URL de tu aplicación híbrida
    methods: ['GET', 'POST', 'OPTIONS'], // Permitir métodos
    allowedHeaders: ['Content-Type'] // Headers permitidos
}));

// Habilitar CORS para todas las solicitudes OPTIONS
app.options('*', cors());

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Endpoint para validar usuario usando GET
app.get('/api/login', async (req, res) => {
    let connection;
    const { correo, contrasenia } = req.query; // Obtiene los datos de los parámetros de la URL
    console.log('Entrando al endpoint /api/login');
    console.log(`Correo: ${correo}, Contraseña: ${contrasenia}`);

    try {
        // Establecer conexión
        connection = await oracledb.getConnection(dbConfig);
        console.log('Conectado a la base de datos Oracle');

        // Consulta SQL para validar usuario
        const result = await connection.execute(
            `SELECT id_cliente FROM cliente WHERE correo_cliente = :correo_cliente AND contrasenia = :contrasenia`,
            { correo_cliente: correo, contrasenia: contrasenia } // Parámetros de la consulta
        );

        // Verificar si se encontró el usuario
        if (result.rows.length > 0) {
            // Usuario encontrado, enviar respuesta con el idCliente
            const idCliente = result.rows[0][0]; // Suponiendo que el id_cliente está en la primera columna
            res.json({ idCliente }); // Devuelve el idCliente
        } else {
            // Usuario no encontrado
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: err.message });
    } finally {
        // Cerrar la conexión
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
        // Establecer conexión
        connection = await oracledb.getConnection(dbConfig);
        console.log('Conectado a la base de datos Oracle');

        // Consulta SQL
        const result = await connection.execute('SELECT * FROM cliente'); 

        // Enviar respuesta JSON
        res.json(result.rows);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: err.message });
    } finally {
        // Cerrar la conexión
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
app.get('/api/test', (req, res) => {
    res.json({ message: 'CORS está funcionando' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
