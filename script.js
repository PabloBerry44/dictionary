const wordTag = document.querySelector('.word')
const search_bar = document.querySelector('.search')
const search_button = document.querySelector('.search_button')
const phoneticTag = document.querySelector('.phonetic')
const audioTag = document.querySelector('.audio')
const play_button = document.querySelector('.play_button')
const definitionsTag = document.querySelector('.definitionsTag')
const definitionsContainer = document.querySelector('.definitionsContainer')
const books = document.querySelector('.books')


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
    books.style.display='none'

    while(definitionsContainer.firstChild){
        definitionsContainer.removeChild(definitionsContainer.lastChild)
    }

    for(j=0; j<data.length; j++){
        currentData = data[j]

        let audioUrl = ''
        let phoneticText = ''
        // go through all phonetics indexes
        for(i=0; i<currentData.phonetics.length; i++){
        
            //find audioURL
            if(currentData.phonetics[i].audio && !audioUrl){
                audioUrl=currentData.phonetics[i].audio
                play_button.style.display = 'block'
            }
            else if(!currentData.phonetics[i].audio && !audioUrl){
                play_button.style.display = 'none'
            }

            //find phonetics text
            if(currentData.phonetics[i].text && !phoneticText){
                phoneticText=currentData.phonetics[i].text
                phoneticTag.style.display = 'block'
            }
            else if(!currentData.phonetics[i].audio && !phoneticText){
                phoneticTag.style.display = 'none'
            }
        }





        let definitionsTag = document.createElement('div')
        definitionsTag.classList.add('definitionsTag')
        definitionsContainer.appendChild(definitionsTag)


        while(definitionsTag.firstChild){
            definitionsTag.removeChild(definitionsTag.lastChild)
        }
        //grab all definitions
        for(i=0; i<currentData.meanings.length; i++){

            //create div and add class to it
            const meaningDiv = document.createElement('div')
            meaningDiv.classList.add(currentData.meanings[i].partOfSpeech)
            definitionsTag.appendChild(meaningDiv)

            // create paragraph and insert text into it
            const partOfSpeech = document.createElement('p')
            meaningDiv.appendChild(partOfSpeech)
            partOfSpeech.classList.add('part_of_speech')
            partOfSpeech.innerHTML = meaningDiv.className

            let meaning = currentData.meanings[i]
            //create paragraphs and add definitions to them
            for(i=0; i<meaning.definitions.length; i++){

                const definitionText = document.createElement('p')
                definitionText.classList.add('definition')

                // const definitionIndex = document.createElement('p')
                // definitionIndex.classList.add('definition_index')

                // meaningDiv.appendChild(definitionIndex)
                meaningDiv.appendChild(definitionText)
                // definitionIndex.innerHTML = i+'.'
                definitionText.innerHTML = meaning.definitions[i].definition + '<br><br>'
            }
        }

        wordTag.innerHTML = currentData.word
        phoneticTag.innerHTML = phoneticText
        audioTag.src = audioUrl

        search_bar.value = ''

    }

    
}