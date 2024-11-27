import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos', error);
  });

const serieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  releaseYear: Number,
});

const Serie = mongoose.model('Serie', serieSchema, 'pelis.pelis');

app.use(bodyParser.json());

app.post('/series', async (req, res) => {
  try {
    const newSerie = await Serie.create(req.body);
    res.status(201).json(newSerie);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la serie.' });
  }
});

app.get('/series', async (req, res) => {
  try {
    console.log("Ruta /series llamada");
    const series = await Serie.find();
    console.log("Datos obtenidos de la base de datos:", series);
    res.json(series);
  } catch (error) {
    console.error("Error al obtener las series:", error);
    res.status(404).json({ error: 'Error al obtener las series.' });
  }
});

app.put('/series/:id', async (req, res) => {
  try {
    const updatedSerie = await Serie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSerie);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la serie.' });
  }
});

app.delete('/series/:id', async (req, res) => {
  try {
    const deletedSerie = await Serie.findByIdAndDelete(req.params.id);
    res.json(deletedSerie);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la serie.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
