const {Router} = require('express')
const {getTypes} = require('../controllers/pokecontroller')

const server = Router()

server.get('/', async (req,res)=>{
  try {
    let getAllTypes = await getTypes()
    res.send(getAllTypes);
  } catch (error) {
    res.status(400).send(error.message);
  }

})

module.exports= server