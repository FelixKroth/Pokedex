function renderPokemonCardHTML(pokemonData, firstType) {
    return /*html*/ `
    <div id='poke-card-container'>
        <h3>#${pokemonData['id']} ${pokemonData['name'].toUpperCase()}</h3>
        <div class="pokemon-image pokemon-image-${firstType} type-space-images">
            <img id="pokemon-image" src='${pokemonData['sprites']['other']['official-artwork']['front_shiny']}' alt='${pokemonData.name}'>
        </div>
        <div class="types-container"></div>
    </div>
  `;
}


function renderPokemonsInModalHTML(pokemonData, firstType, abilityInfo) {
    return /*html*/ `<h3>#${pokemonData['id']} ${pokemonData['name'].toUpperCase()}</h3>
    <div class="modal-image-container pokemon-modal-image-${firstType} type-space-images-modal">
      <img class="modal-image" src='${pokemonData['sprites']['other']['official-artwork']['front_shiny']}'>
    </div>
    <div class="types-container"></div>
    <div class="categories-pokemon">
        <span id="first-category" class="stats-category" onclick="showMainCategory(${pokemonData['id']})">main</span>
        <span id="second-category" class="stats-category" onclick="showStatsCategory(${pokemonData['id']})">stats</span>
        <span id="third-category" class="evo-category" onclick="showEvoChainCategory(${pokemonData['id']})">evolution</span>
    </div>
    <div id="categories-pokemon-container">
        ${renderCategoryMainPokemonContainer(pokemonData, abilityInfo)}
        <div id="evochain-pokemon-container">
        </div>
    </div>
    `;
    
}

function renderCategoryMainPokemonContainer(pokemonData, abilityInfo) {
    let abilitiesHTML = '';
    if (abilityInfo.length > 0) {
        abilitiesHTML = abilityInfo[0]['ability']['name'];
        for (let i = 1; i < abilityInfo.length; i++) {
            abilitiesHTML += /*html*/ ` | ${abilityInfo[i]['ability']['name']}`;
        }
    } else {
        abilitiesHTML = 'Null';
    }
    return /*html*/ `
    <div class="categories-pokemon-row"><p>Height:</p><span>${pokemonData['height']}</span></div>
    <div class="categories-pokemon-row"><p>Weight:</p><span>${pokemonData['weight']}</span></div>
    <div class="categories-pokemon-row"><p>Base Experience:</p><span>${pokemonData['base_experience']}</span></div>
    <div class="categories-pokemon-row"><p>Abilities:</p><span>${abilitiesHTML}</span></div>`;
}


function renderCategoryStatsPokemonContainer(statsInfo) {
    return /*html*/ `
    <div class="categories-pokemon-row-stats"><p>HP</p><div class="stats-item"><div style="width: ${statsInfo[0]['base_stat']}px; background: #FFCB05; color: #202124; border-radius: 16px; padding: 0px 8px;">${statsInfo[0]['base_stat']}</div></div></div>
    <div class="categories-pokemon-row-stats"><p>Attack</p><div class="stats-item"><div style="width: ${statsInfo[1]['base_stat']}px; background: #FFCB05; color: #202124; border-radius: 16px; padding: 0px 8px;">${statsInfo[1]['base_stat']}</div></div></div>
    <div class="categories-pokemon-row-stats"><p>Defense</p><div class="stats-item"><div style="width: ${statsInfo[2]['base_stat']}px; background: #FFCB05; color: #202124; border-radius: 16px; padding: 0px 8px;">${statsInfo[2]['base_stat']}</div></div></div>
    <div class="categories-pokemon-row-stats"><p>Sp.-Attack</p><div class="stats-item"><div style="width: ${statsInfo[3]['base_stat']}px; background: #FFCB05; color: #202124; border-radius: 16px; padding: 0px 8px;">${statsInfo[3]['base_stat']}</div></div></div>
    <div class="categories-pokemon-row-stats"><p>Sp.-Defense</p><div class="stats-item"><div  style="width: ${statsInfo[4]['base_stat']}px; background: #FFCB05; color: #202124; border-radius: 16px; padding: 0px 8px;">${statsInfo[4]['base_stat']}</div></div></div>`;
}

function renderCategoryEvoChainPokemonContainer(pokemonName, pokemonImage) {
    return `
    <div class="evo-chain-container">
        <div class="categories-pokemon-row-evo-chain"><p>${pokemonName}</p><img class="evo-chain-image" src="${pokemonImage}"/></div>
    </div>`;
}


