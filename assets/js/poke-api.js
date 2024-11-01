const pokeApi = {};

function convertPokeApiDetailToPokemon(pokemonDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokemonDetail.id;
    pokemon.name = pokemonDetail.name;

    pokemon.types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name);
    pokemon.type = pokemon.types[0];

    pokemon.photo = pokemonDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

function getAllStatus(stats) {
    const pokemonStats = new PokemonStats;

    pokemonStats.statNumber = stats.stats.map((statNumber) => statNumber.base_stat);
    pokemonStats.statName = stats.stats.map((statName) => statName.stat.name);
    pokemonStats.namePokemon = stats.name;
    console.log(stats)

    pokemonStats.photo = stats.sprites.other.dream_world.front_default;
    pokemonStats.types = stats.types.map((type) => type.type.name);
    pokemonStats.type = pokemonStats.types[0];
    pokemonStats.xp = stats.base_experience;

    return pokemonStats;
}

pokeApi.getpokemonDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map((pokemon) => pokeApi.getpokemonDetails(pokemon)))
        .then((detailRequest) => Promise.all(detailRequest))
        .then((pokemonsDetail) => pokemonsDetail)
        .catch((error) => console.error(error))
}

pokeApi.getPokemonStats = (id) => {
    const statsUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`
    return fetch(statsUrl)
        .then((response) => response.json())
        .then(getAllStatus)
}