let currentPokemon = 1;
let maxCountPokemon = 1024;
let loadCount = 20;
let indexPokemon = 0;
let allPokemons = [];

async function fetchPokemon(number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
  const pokemonData = await response.json();
  return pokemonData;
}

async function preloadAllPokemons() {
  let allPokemonData = [];
  for (let number = 1; number <= maxCountPokemon; number++) {
    let pokemonData = await fetchPokemon(number);
    allPokemonData.push(pokemonData);
  }
  return allPokemonData;
}

function renderPokemonCards() {
  let container = document.getElementById("poke-card-main-container");
  container.innerHTML = "";
  for (let i = 0; i < indexPokemon && i < allPokemons.length; i++) {
    let pokemonData = allPokemons[i];
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
    openModal(pokemonCard, i);
  }
}

function openModal(pokemonCard, index) {
  pokemonCard.addEventListener("click", () => {
    indexPokemon = index;
    showPokemonInModal(indexPokemon);
  });
}

function showPokemonInModal(index) {
  let pokemonData = allPokemons[index];
  let modal = document.getElementById("modal-gallery");
  let modalInfo = document.getElementById("modal-card");
  let firstType = pokemonData["types"][0]["type"]["name"];
  let abilityInfo = pokemonData["abilities"];
  modalInfo.innerHTML = renderPokemonsInModalHTML(
    pokemonData,
    firstType,
    abilityInfo
  );
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

function applyFlexRow() {
  let firstCategory = document.getElementById("first-category");
  let secondCategory = document.getElementById("second-category");
  let thirdCategory = document.getElementById("third-category");
  firstCategory.addEventListener("click", () => {
    if (
      document
        .getElementById("categories-pokemon-container")
        .classList.contains("flex-evenly")
    ) {
      document
        .getElementById("categories-pokemon-container")
        .classList.remove("flex-evenly");
    } else {
      return;
    }
  });
  secondCategory.addEventListener("click", () => {
    if (
      document
        .getElementById("categories-pokemon-container")
        .classList.contains("flex-evenly")
    ) {
      document
        .getElementById("categories-pokemon-container")
        .classList.remove("flex-evenly");
    } else {
      return;
    }
  });
  thirdCategory.addEventListener("click", () => {
    if (
      document
        .getElementById("categories-pokemon-container")
        .classList.contains("flex-evenly")
    ) {
      return;
    } else {
      document
        .getElementById("categories-pokemon-container")
        .classList.add("flex-evenly");
    }
  });
}

async function showEvoChainCategory(index) {
  let pokemonData = allPokemons.find((pokemon) => pokemon["id"] === index);
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

async function fetchEvolutionChain(evolutionChainURL) {
  const response = await fetch(evolutionChainURL);
  const evolutionChainData = await response.json();
  return evolutionChainData.chain;
}

async function displayEvolutionChain(chain) {
  let evoContainer = document.getElementById("categories-pokemon-container");
  evoContainer.innerHTML = "";
  await displayEvolutionStage(chain, evoContainer);
}

async function displayEvolutionStage(stage, evoContainer) {
  let pokemonData = await fetchPokemon(
    stage.species.url.split("/").slice(-2)[0]
  );
  let pokemonName = pokemonData.name;
  let pokemonImage =
    pokemonData.sprites.other["official-artwork"].front_default;
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

  if (stage.evolves_to.length > 0) {
    for (let nextStage of stage.evolves_to) {
      await displayEvolutionStage(nextStage, evoContainer);
    }
  }
}

function showMainCategory(index) {
  let pokemonData = allPokemons.find((pokemon) => pokemon["id"] === index);
  let abilityInfo = pokemonData["abilities"];
  document.getElementById("categories-pokemon-container").innerHTML =
    renderCategoryMainPokemonContainer(pokemonData, abilityInfo);
}

function showStatsCategory(index) {
  let pokemonData = allPokemons.find((pokemon) => pokemon["id"] === index);
  let statsInfo = pokemonData["stats"];
  document.getElementById("categories-pokemon-container").innerHTML =
    renderCategoryStatsPokemonContainer(statsInfo);
}

function closeModal() {
  let modal = document.getElementById("modal-gallery");
  modal.style.display = "none";
}

function showNextPokemon() {
  let currentIndex = indexPokemon;
  if (currentIndex < allPokemons.length - 1) {
    indexPokemon = currentIndex + 1;
  } else {
    indexPokemon = 0;
  }
  showPokemonInModal(indexPokemon);
}

function showPreviousPokemon() {
  let currentIndex = indexPokemon;
  if (currentIndex > 0) {
    indexPokemon = currentIndex - 1;
  } else {
    indexPokemon = allPokemons.length - 1;
  }
  showPokemonInModal(indexPokemon);
}

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
  } else {
    renderPokemonCards();
  }
}

async function loadPokemons() {
  let loadedPokemons = [];
  for (
    let i = 0;
    i < loadCount && currentPokemon <= maxCountPokemon;
    i++, currentPokemon++
  ) {
    let pokemonData = await fetchPokemon(currentPokemon);
    loadedPokemons.push(pokemonData);
  }
  let addedPokemons = await Promise.all(loadedPokemons);
  allPokemons = allPokemons.concat(addedPokemons);
  indexPokemon += loadCount;
  renderPokemonCards();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPokemons();
  document
    .getElementById("load-more-button")
    .addEventListener("click", loadPokemons);

  preloadAllPokemons().then((data) => {
    allPokemons = data;
  });
});

window.onload = function () {
  document
    .getElementById("poke-search-bar")
    .addEventListener("keyup", filterPokemons);
};

function clearLoadedPokemons() {
  location.reload();
}
