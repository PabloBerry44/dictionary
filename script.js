const wordTag = document.querySelector('.word')
const search_bar = document.querySelector('.search')
const search_button = document.querySelector('.search_button')
const phoneticTag = document.querySelector('.phonetic')
const audioTag = document.querySelector('.audio')
const play_button = document.querySelector('.play_button')
const definitionsTag = document.querySelector('.definitionsTag')



search_button.addEventListener('click', ()=> {
    if(!search_bar.value==''){loadData()}
})
search_bar.addEventListener('keypress', function(event){
    if(event.key==='Enter'){
        loadData()
    }
})

play_button.addEventListener('click', ()=>{audioTag.play()})

async function loadData() {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+search_bar.value);
    const data = await response.json();
    search(data)
  }

function search(data){

    let audioUrl = ''
    let phoneticText = ''
    // go through all phonetics indexes
    for(i=0; i<data[0].phonetics.length; i++){
        
        //find audioURL
        if(data[0].phonetics[i].audio && !audioUrl){
            audioUrl=data[0].phonetics[i].audio
            play_button.style.display = 'block'
        }
        else if(!data[0].phonetics[i].audio && !audioUrl){
            play_button.style.display = 'none'
        }

        //find phonetics text
        if(data[0].phonetics[i].text && !phoneticText){
            phoneticText=data[0].phonetics[i].text
            phoneticTag.style.display = 'block'
        }
        else if(!data[0].phonetics[i].audio && !phoneticText){
            phoneticTag.style.display = 'none'
        }
    }

    while(definitionsTag.firstChild){
        definitionsTag.removeChild(definitionsTag.lastChild);
      }
    //grab all definitions
    for(i=0; i<data[0].meanings.length; i++){

        //create div and add class to it
        const meaningDiv = document.createElement('div')
        meaningDiv.classList.add(data[0].meanings[i].partOfSpeech)
        definitionsTag.appendChild(meaningDiv)

        // create paragraph and insert text into it
        const partOfSpeech = document.createElement('p')
        meaningDiv.appendChild(partOfSpeech)
        partOfSpeech.innerHTML = meaningDiv.className

        let meaning = data[0].meanings[i]
        //create paragraphs and add definitions to them
        for(i=0; i<meaning.definitions.length; i++){

            const definitionText = document.createElement('p')
            meaningDiv.appendChild(definitionText)

            definitionText.innerHTML = meaning.definitions[i].definition + '<br><br>'
        }




    }


    wordTag.innerHTML = data[0].word
    phoneticTag.innerHTML = phoneticText
    audioTag.src = audioUrl

    search_bar.value = ''
}