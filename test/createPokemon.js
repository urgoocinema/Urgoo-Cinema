export function createPokemonCard(pokemon){
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        `
    const btn = document.createElement('button');
    btn.innerText = 'remove';
    btn.addEventListener('click', () => {
        card.remove();
    });
    card.appendChild(btn);

    return card;
}