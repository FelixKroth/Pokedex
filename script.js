/**
 * @var {number} currentPokemon - The current Pokémon index for loading.
 * @var {number} maxCountPokemon - The maximum number of Pokémon to load.
 * @var {number} loadCount - The number of Pokémon to load per request.
 * @var {Array} allPokemons - Array storing all fetched Pokémon data.
 */
let currentPokemon = 1;
let maxCountPokemon = 1024;
let loadCount = 20;
let allPokemons = [];

/**
 * Fetches Pokémon data from the API.
 * @param {number} number - The Pokémon number to fetch.
 * @returns {Promise<Object|null>} The Pokémon data or null if the fetch fails or the Pokémon is skipped.
 */
async function fetchPokemon(number) {
    if (number === 278) {
        console.warn(`Skipping Pokémon #${number}`);
        return null;
    }
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pokemonData = await response.json();
        return pokemonData;
    } catch (error) {
        console.error(`Failed to fetch Pokémon ${number}:`, error);
        return null;
    }
}

/**
 * Renders Pokémon cards in the main container.
 * @returns {Promise<void>}
 */
async function renderPokemonCards() {
    let container = document.getElementById("poke-card-main-container");
    container.innerHTML = "";
    let sortedPokemons = allPokemons.slice(0, currentPokemon - 1).sort((a, b) => a.id - b.id);
    for (let i = 0; i < sortedPokemons.length; i++) {
        let pokemonData = sortedPokemons[i];
        if (pokemonData) {
            let firstType = pokemonData["types"][0]["type"]["name"];
            let pokemonCard = document.createElement("div");
            pokemonCard.className = "poke-card";
            pokemonCard.innerHTML = renderPokemonCardHTML(pokemonData, firstType);
            let typesContainer = pokemonCard.querySelector(".types-container");
            for (let j = 0; j < pokemonData["types"].length; j++) {
                let typeInfo = pokemonData["types"][j];
                let type = typeInfo["type"]["name"];
                let typeContainer = document.createElement("div");
                typeContainer.classList.add(type, "type-space");
                typeContainer.textContent = type;
                typesContainer.appendChild(typeContainer);
            }
            container.appendChild(pokemonCard);
            openModal(pokemonCard, allPokemons.indexOf(pokemonData));
        }
    }
}

/**
 * Attaches a click event listener to a Pokémon card to open a modal with detailed information.
 * @param {HTMLElement} pokemonCard - The Pokémon card element.
 * @param {number} index - The index of the Pokémon in `allPokemons`.
 */
function openModal(pokemonCard, index) {
    pokemonCard.addEventListener("click", () => {
        indexPokemon = index;
        showPokemonInModal(indexPokemon);
    });
}

/**
 * Displays detailed Pokémon information in a modal.
 * @param {number} index - The index of the Pokémon in `allPokemons`.
 */
function showPokemonInModal(index) {
    let pokemonData = allPokemons[index];
    if (pokemonData) {
        let modal = document.getElementById("modal-gallery");
        let modalInfo = document.getElementById("modal-card");
        let firstType = pokemonData["types"][0]["type"]["name"];
        let abilityInfo = pokemonData["abilities"];
        modalInfo.innerHTML = renderPokemonsInModalHTML(pokemonData, firstType, abilityInfo);
        let typesContainer = modalInfo.querySelector(".types-container");
        typesContainer.innerHTML = "";
        for (let j = 0; j < pokemonData["types"].length; j++) {
            let typeInfo = pokemonData["types"][j];
            let type = typeInfo["type"]["name"];
            let typeContainer = document.createElement("div");
            typeContainer.classList.add(type, "type-space");
            typeContainer.textContent = type;
            typesContainer.appendChild(typeContainer);
        }
        modal.style.cssText = `display: flex; justify-content: center; flex-direction: column;`;
        applyFlexRow();
    }
}

/**
 * Applies a flex row layout to category elements.
 */
function applyFlexRow() {
    let firstCategory = document.getElementById("first-category");
    let secondCategory = document.getElementById("second-category");
    let thirdCategory = document.getElementById("third-category");
    if (firstCategory) {
        firstCategory.addEventListener("click", () => {
            let container = document.getElementById("categories-pokemon-container");
            if (container) {
                container.classList.toggle("flex-evenly");
            }
        });
    }
    if (secondCategory) {
        secondCategory.addEventListener("click", () => {
            let container = document.getElementById("categories-pokemon-container");
            if (container) {
                container.classList.toggle("flex-evenly");
            }
        });
    }
    if (thirdCategory) {
        thirdCategory.addEventListener("click", () => {
            let container = document.getElementById("categories-pokemon-container");
            if (container) {
                container.classList.toggle("flex-evenly");
            }
        });
    }
}

/**
 * Shows the evolution chain category for a given Pokémon.
 * @param {number} index - The index of the Pokémon in `allPokemons`.
 * @returns {Promise<void>}
 */
async function showEvoChainCategory(index) {
    let pokemonData = allPokemons.find((pokemon) => pokemon["id"] === index);
    if (pokemonData && pokemonData.species && pokemonData.species.url) {
        let speciesURL = pokemonData.species.url;
        let speciesResponse = await fetch(speciesURL);
        let speciesData = await speciesResponse.json();
        let evolutionChainURL = speciesData.evolution_chain.url;
        let evolutionChainData = await fetchEvolutionChain(evolutionChainURL);
        if (evolutionChainData) {
            await displayEvolutionChain(evolutionChainData);
        } else {
            console.error("Evolution chain data not available");
        }
    }
}

/**
 * Fetches the evolution chain data from the API.
 * @param {string} evolutionChainURL - The URL to fetch the evolution chain data from.
 * @returns {Promise<Object>} The evolution chain data.
 */
async function fetchEvolutionChain(evolutionChainURL) {
    const response = await fetch(evolutionChainURL);
    const evolutionChainData = await response.json();
    return evolutionChainData.chain;
}

/**
 * Displays the evolution chain in the Pokémon container.
 * @param {Object} chain - The evolution chain data.
 * @returns {Promise<void>}
 */
async function displayEvolutionChain(chain) {
    let evoContainer = document.getElementById("categories-pokemon-container");
    evoContainer.innerHTML = "";
    await displayEvolutionStage(chain, evoContainer);
}

/**
 * Displays each stage of the evolution chain.
 * @param {Object} stage - The current stage of the evolution chain.
 * @param {HTMLElement} evoContainer - The container to append the evolution stage data to.
 * @returns {Promise<void>}
 */
async function displayEvolutionStage(stage, evoContainer) {
    let pokemonData = await fetchPokemon(stage.species.url.split("/").slice(-2)[0]);
    if (pokemonData) {
        let pokemonName = pokemonData.name;
        let pokemonImage = pokemonData.sprites.other["official-artwork"].front_default;
        let pokemonContainer = document.createElement("div");
        pokemonContainer.className = "evo-chain-container";
        let pokemonRow = document.createElement("div");
        pokemonRow.className = "categories-pokemon-row-evo-chain";
        let nameParagraph = document.createElement("p");
        nameParagraph.textContent = pokemonName;
        let image = document.createElement("img");
        image.className = "evo-chain-image";
        image.src = pokemonImage;
        pokemonRow.appendChild(nameParagraph);
        pokemonRow.appendChild(image);
        pokemonContainer.appendChild(pokemonRow);
        evoContainer.appendChild(pokemonContainer);
    }

    if (stage.evolves_to.length > 0) {
        for (let nextStage of stage.evolves_to) {
            await displayEvolutionStage(nextStage, evoContainer);
        }
    }
}

/**
 * Displays the main category information for a given Pokémon.
 * @param {number} index - The index of the Pokémon in `allPokemons`.
 */
function showMainCategory(index) {
    let pokemonData = allPokemons.find((pokemon) => pokemon["id"] === index);
    if (pokemonData) {
        let abilityInfo = pokemonData["abilities"];
        document.getElementById("categories-pokemon-container").innerHTML =
            renderCategoryMainPokemonContainer(pokemonData, abilityInfo);
    }
}

/**
 * Displays the statistics category for a given Pokémon.
 * @param {number} index - The index of the Pokémon in `allPokemons`.
 */
function showStatsCategory(index) {
    let pokemonData = allPokemons.find((pokemon) => pokemon["id"] === index);
    if (pokemonData) {
        let statsInfo = pokemonData["stats"];
        document.getElementById("categories-pokemon-container").innerHTML =
            renderCategoryStatsPokemonContainer(statsInfo);
    }
}

/**
 * Closes the modal gallery.
 */
function closeModal() {
    let modal = document.getElementById("modal-gallery");
    if (modal) {
        modal.style.display = "none";
    }
}

/**
 * Shows the next Pokémon in the modal.
 */
function showNextPokemon() {
    let currentIndex = indexPokemon;
    if (currentIndex < allPokemons.length - 1) {
        indexPokemon = currentIndex + 1;
    } else {
        indexPokemon = 0;
    }
    showPokemonInModal(indexPokemon);
}

/**
 * Shows the previous Pokémon in the modal.
 */
function showPreviousPokemon() {
    let currentIndex = indexPokemon;
    if (currentIndex > 0) {
        indexPokemon = currentIndex - 1;
    } else {
        indexPokemon = allPokemons.length - 1;
    }
    showPokemonInModal(indexPokemon);
}

/**
 * Filters Pokémon based on the search input and displays the results.
 * @param {Event} event - The input event triggered by the search bar.
 */
function filterPokemons(event) {
    let search = event.target.value.toLowerCase();
    let container = document.getElementById("poke-card-main-container");
    container.innerHTML = "";
    if (search.length >= 3) {
        let filteredPokemons = allPokemons.filter((pokemonData) =>
            pokemonData["name"].toLowerCase().includes(search)
        );
        for (let i = 0; i < filteredPokemons.length; i++) {
            let pokemonData = filteredPokemons[i];
            if (pokemonData) {
                let firstType = pokemonData["types"][0]["type"]["name"];
                let pokemonCard = document.createElement("div");
                pokemonCard.className = "poke-card";
                pokemonCard.innerHTML = renderPokemonCardHTML(pokemonData, firstType);
                let typesContainer = pokemonCard.querySelector(".types-container");
                for (let j = 0; j < pokemonData["types"].length; j++) {
                    let typeInfo = pokemonData["types"][j];
                    let type = typeInfo["type"]["name"];
                    let typeContainer = document.createElement("div");
                    typeContainer.classList.add(type, "type-space");
                    typeContainer.textContent = type;
                    typesContainer.appendChild(typeContainer);
                }
                container.appendChild(pokemonCard);
                openModal(pokemonCard, allPokemons.indexOf(pokemonData));
            }
        }
    } else {
        renderPokemonCards();
    }
}

/**
 * Loads Pokémon data and appends it to the existing list of Pokémon.
 * @returns {Promise<void>}
 */
async function loadPokemons() {
    let loadedPokemons = [];
    let startCount = currentPokemon;
    let endCount = Math.min(currentPokemon + loadCount, maxCountPokemon + 1);

    for (let i = startCount; i < endCount; i++) {
        let pokemonData = await fetchPokemon(i);
        if (pokemonData) {
            loadedPokemons.push(pokemonData);
        }
    }

    loadedPokemons.forEach((pokemon) => {
        if (pokemon && !allPokemons.some((existingPokemon) => existingPokemon.id === pokemon.id)) {
            allPokemons.push(pokemon);
        }
    });

    currentPokemon = endCount;
    renderPokemonCards();
}

/**
 * Initialize Pokémon data and event listeners on document load.
 */
document.addEventListener("DOMContentLoaded", async () => {
    await loadPokemons();
    document.getElementById("load-more-button").addEventListener("click", loadPokemons);
});

/**
 * Add event listener for filtering Pokémon on keyup in the search bar.
 */
window.onload = function () {
    document.getElementById("poke-search-bar").addEventListener("keyup", filterPokemons);
};

/**
 * Clears the loaded Pokémon data by reloading the page.

function clearLoadedPokemons() {
    location.reload();
}