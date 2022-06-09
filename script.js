const word = document.querySelector('.word')
const def = document.querySelector('.def')
const search_bar = document.querySelector('.search')
const search_button = document.querySelector('.search_button')
const phonetic = document.querySelector('.phonetic')
const audio = document.querySelector('.audio')
const play_button = document.querySelector('.play_button')

search_button.addEventListener('click', ()=> {
    if(!search_bar.value==''){loadData()}
})

play_button.addEventListener('click', ()=>{audio.play()})

async function loadData() {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+search_bar.value);
    const data = await response.json();
    search(data)
  }

function search(data){
    word.innerHTML = data[0].word
    phonetic.innerHTML = data[0].phonetics[0].text
    audio.src = data[0].phonetics[1].audio
    def.innerHTML = data[0].meanings[0].definitions[0].definition
}