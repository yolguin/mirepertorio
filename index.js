const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());        
app.use(express.static('public'));  

// Ruta GET
app.get('/canciones', (req, res) => {
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
    res.json(repertorio);
});

// Ruta POST
app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
    repertorio.push(nuevaCancion);
    fs.writeFileSync('repertorio.json', JSON.stringify(repertorio, null, 2));
    res.send('Canción agregada con éxito');
});

// Ruta PUT
app.put('/canciones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nuevaCancion = req.body;
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
    const index = repertorio.findIndex(c => c.id === id);

    if (index !== -1) {
        repertorio[index] = { ...repertorio[index], ...nuevaCancion };
        fs.writeFileSync('repertorio.json', JSON.stringify(repertorio, null, 2));
        res.send('Canción actualizada con éxito');
    } else {
        res.status(404).send('Canción no encontrada');
    }
});

// Ruta DELETE
app.delete('/canciones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
    const nuevaLista = repertorio.filter(c => c.id !== id);

    if (repertorio.length !== nuevaLista.length) {
        fs.writeFileSync('repertorio.json', JSON.stringify(nuevaLista, null, 2));
        res.send('Canción eliminada con éxito');
    } else {
        res.status(404).send('Canción no encontrada');
    }
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor encendido en http://localhost:${PORT}`);
});
