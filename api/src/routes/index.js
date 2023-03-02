const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const Pokeruta = require ('./pokeruta')
const Type = require ('./type')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/pokemons/',Pokeruta)
router.use('/type',Type)


module.exports = router;
