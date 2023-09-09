fetch('starwars.json')
  .then( response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then( json => initialize(json) )
  .catch( err => console.error(`Fetch problem: ${err.message}`) );

  function initialize(characters) {
    const category = document.querySelector('#category');
    const searchTerm = document.querySelector('#searchTerm');
    const searchBtn = document.querySelector('button');
    const main = document.querySelector('main');
  
    let lastCategory = category.value;
    let lastSearch = '';
    let categoryGroup;
    let finalGroup;
  
    finalGroup = characters;
    updateDisplay();
  
    categoryGroup = [];
    finalGroup = [];
  
    searchBtn.addEventListener('click', selectCategory);
  
    function selectCategory(e) {
      e.preventDefault();
      categoryGroup = [];
      finalGroup = [];

      if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
        return;
      } else {
        lastCategory = category.value;
        lastSearch = searchTerm.value.trim();

        if (category.value === 'Todos') {
          categoryGroup = characters;
          selectCharacters();
        } else {
          const lowerCaseType = category.value.toLowerCase();
          categoryGroup = characters.filter( character => character.type === lowerCaseType );
  
          selectCharacters();
        }
      }
    }
  
    function selectCharacters() {
      if (searchTerm.value.trim() === '') {
        finalGroup = categoryGroup;
      } else {
        const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
        finalGroup = categoryGroup.filter( character => character.name.includes(lowerCaseSearchTerm));
      }
      updateDisplay();
    }
  
    function updateDisplay() {
      while (main.firstChild) {
        main.removeChild(main.firstChild);
      }
  
      if (finalGroup.length === 0) {
        const para = document.createElement('p');
        para.textContent = 'No results to display!';
        main.appendChild(para);
      } else {
        for (const character of finalGroup) {
          fetchBlob(character);
        }
      }
    }
  
    function fetchBlob(character) {
      const url = `images/${character.image}`;
      fetch(url)
        .then( response => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.blob();
        })
        .then( blob => showCharacter(blob, character) )
        .catch( err => console.error(`Fetch problem: ${err.message}`) );
    }
  
    function showCharacter(blob, character) {
      const objectURL = URL.createObjectURL(blob);
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      const para = document.createElement('p');
      const image = document.createElement('img');
  
      section.setAttribute('class', character.type);
  
      heading.textContent = character.name.replace(character.name.charAt(0), character.name.charAt(0).toUpperCase());
  
      para.textContent = `Birth Year: ${character.birth_year}`;
  
      image.src = objectURL;
      image.alt = character.name;
  
      main.appendChild(section);
      section.appendChild(heading);
      section.appendChild(para);
      section.appendChild(image);
    }
  }