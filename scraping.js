const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('node:fs');

// Middleware para manejar datos JSON
app.use(express.json());

// Middleware para manejar datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

const url = 'https://elpais.com/ultimas-noticias/'

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)
    
    let noticias = [];

    $('article').each((index, element) => {
      const titulo = $(element).find('h2').text();
      const descripcion = $(element).find('p').text();
      const enlace = $(element).find('a').attr('href');
      const imagen = $(element).find('img').attr('src');

      const noticia = {
        titulo: titulo,
        descripcion: descripcion,
        enlace: enlace,
        imagen: imagen,
      };
      noticias.push(noticia);
    });

    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    res.send('Scraping completado');

  } catch (error){
    res.status(404).json({message: error})
  }
})

app.listen(3000, () => {
  console.log('Scraping server listening http://localhost:3000')
});


