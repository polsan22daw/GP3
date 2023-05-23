const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const cors = require('cors');
app.use(cors());
const port = 3000; // Puedes cambiar el puerto si es necesario
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'joc.html'));
});

// Configurar middleware para procesar JSON
app.use(express.json());
// Configurar conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/GP3', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexión exitosa a MongoDB');
}).catch(error => {
  console.error('Error al conectar a MongoDB', error);
});

const playerSchema = new mongoose.Schema({
  nickname: String,
  tiempo: Number
});

const Player = mongoose.model('Player', playerSchema);

app.post('/guardar-puntuacion', async (req, res) => {
  try {
    const player = new Player(req.body);
    console.log(req.body);
    await player.save();
    res.status(201).json({ message: 'Puntuación guardada exitosamente' });
  } catch (error) {
    console.error(error); // Imprimir el error en la consola del servidor
    res.status(500).json({ error: 'Error al guardar la puntuación' });
  }
});

app.get('/puntuaciones', async (req, res) => {
  try {
    const players = await Player.find().sort({ tiempo: 1 }).limit(10);
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las puntuaciones' });
  }
});





// Definir rutas y lógica de manejo de puntuaciones aquí

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});