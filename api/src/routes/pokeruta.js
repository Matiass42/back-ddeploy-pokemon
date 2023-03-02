const {Router} = require ('express')
const {allPokemons} = require('../controllers/pokecontroller')
const {createPokemon} = require('../controllers/pokecontroller')
const server = Router()




server.get('/',async (req, res) => { 
    try {
  
      const { name } = req.query;
      const pokemons = await allPokemons()
      
      if (name) {

        const pokemonsFilterByName = pokemons.filter((r) =>
          r.name.toLowerCase() === name.toLowerCase());

        pokemonsFilterByName.length > 0  ? res.send(pokemonsFilterByName) 
                                      : res.status(404).send( "No se encontro pokemon con ese nombre" );

      
      } else { 
        return res.send(pokemons) }

    } catch (error) { 
      res.status(400).send(error.message)
     }
})


//server.get('/?name',async (req, res) => {  // pokemons/?name=pikachu
//  try {
//
//    const  name = req.query.name
//    const pokemons = await allPokemons()
//    
//    if (name) {
//
//      const pokemonsFilterByName = pokemons.filter((r) =>
//        r.name.toLowerCase().includes(name.toLowerCase()))
//          res.send(pokemonsFilterByName)    
//    } else { 
//      res.status(404).send( "el no es valido" )
//     }
//
//  } catch (error) { 
//    res.status(400).send(error.message)
//   }
//})

server.get('/:id', async (req, res) => {
      
      const { id } = req.params;
      const pokemons = await allPokemons();
      
      if (id) {
      
        const pokemonsById = pokemons.filter((p) => (p.id) === (id));
        
        pokemonsById.length   ? res.send(pokemonsById)
                              : res.send('no se encontro pokemon con ese nombre');

      } else {
        res.status(404).send({ msg: "Should enter a valid ID" });
      }
  })

  server.post("/", async (req, res) => {
    try {
      let CreatePokemon= await createPokemon(req.body);
      res.send(CreatePokemon);
    } catch (error) {
      res.status(400).send(error.message);
    }
  })


module.exports = server