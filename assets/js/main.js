const pokemonOl = document.getElementById('pokemonOl');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonStats = document.getElementById('pokemonStats');
const pokemonDetailsUl = document.getElementById('pokemonDetails');

const maxRecords = 151;
const limit = 6;
let offset = 0;
let liMoreDetails;

async function loadPokemonItems(offset, limit) {
    try {
        const pokemonNames = await pokeApi.getPokemons(offset, limit);
        const newHtml = pokemonNames.map((pokemon) => {
            return `
                <li id="${pokemon.number}" class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
                </li>
                `;
        }).join('');
        pokemonOl.innerHTML += newHtml;
    } catch {
        console.error("Erro ao carregar Pokémon:", error);
    }
}

async function loadPokemonDetails(id) {
    try {
        const pokemonStats = await pokeApi.getPokemonStats(id);

        
        const newHtmlDetailsPoke = `
            <div id="pokemonDetails" class="pokemon-stats ${pokemonStats.type}">
            <span id="arrow_back" class="material-symbols-outlined">arrow_back</span>
                <h1>${pokemonStats.namePokemon}</h1>
                <img src="${pokemonStats.photo}" alt="${pokemonStats.statName}">
                <h2>Status base:</h2>
                <ul class="pokemonDetails">
                    <li class="xp">experiência: </li><span class="statusNumber">${pokemonStats.xp}</span>
                    ${pokemonStats.statName.map((name, index) => {
                const number = pokemonStats.statNumber[index];
                return `
                        <li class="${name}">${name}: </li> <span class="statusNumber">${number}</span>
                        `
            }).join('')}
                </ul>
            </div>`;
        pokemonDetailsUl.innerHTML = newHtmlDetailsPoke;

    } catch (error) {
        console.error("Erro ao carregar detalhes do Pokémon:", error);
    }
}


loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const maxRecordNextPage = offset + limit;

    if (maxRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});
const interval = setInterval(() => {
    const pokemonLis = document.querySelectorAll('.pokemon')

    pokemonLis.forEach((pokemonLi) => {
        pokemonLi.addEventListener('click', () => {
            pokemonLi.classList.add('moreDetails');

            liMoreDetails = document.querySelector('.moreDetails');
            if (liMoreDetails) {
                const liId = liMoreDetails.id;

                const pokemonContent = document.getElementById('pokemonContent');
                pokemonContent.classList.add('hidden');

                pokemonStats.classList.remove('hidden');
                pokemonStats.classList.add('stats');

                loadPokemonDetails(liId);
            }
        })

        const backArrow = document.getElementById('arrow_back')
        if (backArrow) {
            backArrow.addEventListener('click', () => {
                const pokemonOl = document.getElementById('pokemonContent');
                pokemonOl.classList.remove('hidden');

                pokemonStats.classList.remove('stats');
                pokemonStats.classList.add('hidden');

                liMoreDetails.classList.remove('moreDetails');
            })
        }

    })
}, 500);