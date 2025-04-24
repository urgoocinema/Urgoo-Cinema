import { createPokemonCard } from './createPokemon.js';
import fetchPokemon from './fetch.js';
import randomNumGenerator from './randomNumGenerator.js';

async function displayUI(){
    const container = document.getElementById("pokedeck");
    for(let i=0; i<6; i++){
        const data = await fetchPokemon(randomNumGenerator(1, 151));
        container.appendChild(createPokemonCard(data));
    }
}

displayUI();