require('dotenv').config();

require('./database');

const express = require('express');
const cors = require('cors');

const usuarioRouter = require('./routes/usuarioRouter');
const filmeRouter = require('./routes/filmeRouter');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/usuario/', usuarioRouter);
app.use('/filme/', filmeRouter);

const port = process.env.EXPRESS_PORT || 3345;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});