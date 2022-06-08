const word = document.querySelector('.word')
const def = document.querySelector('.def')
const search_bar = document.querySelector('.search')
const search_button = document.querySelector('.search_button')

search_button.addEventListener('click', ()=> {loadData()})

async function loadData() {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+search_bar.value);
    const data = await response.json();
    another(data)
  }
  loadData();

  function another(data){
      console.log(data[0].meanings[0].definitions[0].definition)

      word.innerHTML = data[0].word
      def.innerHTML = data[0].meanings[0].definitions[0].definition
  }