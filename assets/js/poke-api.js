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

pokeApi.getpokemonDetails = async (pokemon) => {
    try {
        const response = await fetch(pokemon.url);
        const pokemonDetail = await response.json();
        return convertPokeApiDetailToPokemon(pokemonDetail);
    } catch (error) {
        console.error("Erro ao buscar os detalhes do Pokemon: ", error);
    }
}

pokeApi.getPokemons = async (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
    try {
        const response = await fetch(url);
        const jsonBody = await response.json();
        const pokemons = jsonBody.results;
        const detailRequest = pokemons.map((pokemon) => pokeApi.getpokemonDetails(pokemon));
        const pokemonsDetail = await Promise.all(detailRequest);
        return pokemonsDetail;
    } catch (error) {
        return console.error(error);
    }
}

pokeApi.getPokemonStats = async (id) => {
    const statsUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`
    const response = await fetch(statsUrl);
    const stats = await response.json();
    return getAllStatus(stats);
}