const express = require('express');
const app = express();
const fs = require('node:fs');

// Middleware para manejar datos JSON
app.use(express.json());

// Middleware para manejar datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

let noticias = [];

// Leer datos desde el archivo JSON
function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}

function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

app.get('/', (req, res) => {
  try {
    let response = leerDatos()
    res.json(response)
  } catch (error) {
    res.status(404).json({message: 'Not found'})
  }
});

app.post('/noticia', (req, res) => {
  const { titulo, descripcion, enlace, imagen } = req.body;
  let nuevaNoticia = {
    titulo: titulo,
    descripcion: descripcion,
    enlace: enlace, 
    imagen: imagen
  }
  noticias.push(nuevaNoticia)
  guardarDatos()
  res.json(noticias)
});

app.put('/noticia/:id', (req, res) => {
  const id = req.params.id
  leerDatos();

  if(id < noticias.length && id >= 0) {
    let cambioNoticia = req.body
    noticias[id] = cambioNoticia

    guardarDatos()
    res.status(200).json({message: 'Noticia actualizada'})
  } else {
    res.status(404).json({message: 'La noticia no existe'})
  }
});

app.delete('/noticia/:id', (req, res) => {
  const id = req.params.id
  leerDatos();

  if(id < noticias.length && id >= 0) {
    noticias.splice(id, 1)
    guardarDatos()
    res.status(200).json({message: 'Noticia eliminada'})
  } else {
    res.status(404).json({message: 'La noticia no existe'})
  }
})

app.listen(3001, () => {
  console.log('CRUD listening on port http://localhost:3001')
})