const axios = require("axios");
const { Type, Pokemon } = require("../db");

const getApiData = async () => {  
    try {
      let pokeApi1 = await axios.get('https://pokeapi.co/api/v2/pokemon');
      
      let pokeApi2 = await axios.get(pokeApi1.data.next)
            
      let pokeApi = [pokeApi1.data.results,pokeApi2.data.results].flat()

      let pokeApiUrl = pokeApi.map((el) => axios.get(el.url));
      
      let pokeApiInfo = await axios.all(pokeApiUrl);
      
      
      let apiData = pokeApiInfo.map((el) => {
        let pokemon = el.data
        let obj = {
          id: pokemon.id.toString(),
          name: pokemon.name.toLowerCase(),
          life: pokemon.stats[0].base_stat,
          attack: pokemon.stats[1].base_stat,
          defense: pokemon.stats[2].base_stat,
          speed: pokemon.stats[5].base_stat,
          height: pokemon.height,
          weight: pokemon.weight,
          image: pokemon.sprites.other['dream_world'].front_default,
          image2: pokemon.sprites.other['official-artwork'].front_default,
          image3: pokemon.sprites.other['home'].front_default,
          Types: pokemon.types.map((t) => {
              return { name: t.type.name };
            }),
          create: false
        }
        return obj;
      })
      
      return apiData;
    
    } catch (e) {
       //console.log(e);
      return 'no se pudo cargar datos de api'
      }
};
      
const getDbData = async () => {
    const dbData = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ["name"],
      },
    });
    return dbData;
};

const allPokemons = async () => {
    const api = await getApiData();
    const db = await getDbData();  
    const all = [api,db].flat();
    return all;
};


const getTypes = async () => {
  let arrayOfTypes = [];
  try {
    await Type.sync({ force: true });
    let pokemonTypes = await axios.get("https://pokeapi.co/api/v2/type");
    let pokemonTypesData = [...pokemonTypes.data.results];
    pokemonTypesData.map((type) => {
      Type.create(type);
      arrayOfTypes.push(type.name);
    });
    return arrayOfTypes;
  } catch (error) {
    return "No se a podido cargar los types"
  }
}
let createPokemon = async (parametros) => {
  await getPokemonTypes();
  const { name, types } = parametros;
  if (parametros.image === "") {
    parametros.image =
      "https://vader.news/__export/1588965166057/sites/gadgets/img/2020/05/08/2-25193_pokemon-ball-transparent-background-transparent-background-pokeball-png.png_423682103.png";
  }
  if (!name) {
    throw new Error("Faltan datos necesarios para crear el pokemon");
  } else {
    parametros.name = parametros.name.toLowerCase();
    const newPokemon = await Pokemon.create(parametros);
    if (types) {
      types.forEach(async (type) => {
        let responseFromDB = await Type.findAll();
        responseFromDB.find((element) =>
          element.name == type ? newPokemon.addTypes(element.id) : false
        );
      });
    }
    return `El pokemon ${name} ha sido creado`;
  }
};


module.exports = {
  getApiData,
  getDbData,
  allPokemons,
  getTypes,
  createPokemon
};