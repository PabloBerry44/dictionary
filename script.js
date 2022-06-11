const wordTag = document.querySelector('.word')
const search_bar = document.querySelector('.search')
const search_button = document.querySelector('.search_button')
const phoneticTag = document.querySelector('.phonetic')
const audioTag = document.querySelector('.audio')
const play_button = document.querySelector('.play_button')
const definitionsTag = document.querySelector('.definitionsTag')
const definitionsContainer = document.querySelector('.definitionsContainer')
const books = document.querySelector('.books')
const synonymsContainer = document.querySelector('.synonyms_container')

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
    if(document.querySelector('.synonyms')){
        synonymsContainer.removeChild(document.querySelector('.synonyms'))
        synonymsContainer.removeChild(document.querySelector('.expand_synonyms'))
    }

    const synonyms = document.createElement('div')
    synonyms.classList.add('synonyms')
    const expandSynonyms = document.createElement('div')
    expandSynonyms.classList.add('expand_synonyms')
    synonymsContainer.appendChild(synonyms)
    synonymsContainer.appendChild(expandSynonyms)
    let synonym = []
    expandSynonyms.addEventListener('click', ()=>{
        if(synonyms.style.maxHeight!='max-content'){
            synonyms.style.maxHeight= 'max-content'
            expandSynonyms.style.transform = 'rotateZ(180deg)'
        }
        else{
            synonyms.style.maxHeight= '3em'
            expandSynonyms.style.transform = 'none'
        }

    })

    books.style.display='none'

    while(definitionsContainer.firstChild){
        definitionsContainer.removeChild(definitionsContainer.lastChild)
    }

    //go through all data[j]
    for(j=0; j<data.length; j++){
        currentData = data[j]

        let audioUrl = ''
        let phoneticText = ''

        // go through all phonetics
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
        //go through all meanings
        for(y=0; y<currentData.meanings.length; y++){
            let meaning = currentData.meanings[y]

            //create div and add class to it
            const meaningDiv = document.createElement('div')
            meaningDiv.classList.add(currentData.meanings[y].partOfSpeech)
            definitionsTag.appendChild(meaningDiv)

            // create paragraph and insert text into it
            const partOfSpeech = document.createElement('p')
            meaningDiv.appendChild(partOfSpeech)
            partOfSpeech.classList.add('part_of_speech')
            partOfSpeech.innerHTML = meaningDiv.className

            //go through all definitions
            for(i=0; i<meaning.definitions.length; i++){
                //skip empty definitions
                const definitionContainer = document.createElement('div')
                definitionContainer.classList.add('def_container')
                const definitionDiv = document.createElement('div')
                definitionDiv.classList.add('definition')
                if(meaning.definitions[i].definition!=':'){
                    definitionContainer.appendChild(definitionDiv)
                    meaningDiv.appendChild(definitionContainer)
                    definitionDiv.innerHTML = meaning.definitions[i].definition + '<br>'
                }

                if(meaning.definitions[i].example){

                    const moreInfo = document.createElement('div')
                    definitionDiv.appendChild(moreInfo)

                    const exampleParagraph = document.createElement('p')
                    //check if an example is available
                    if(meaning.definitions[i].example){
                        let exampleText = meaning.definitions[i].example
                        exampleParagraph.innerHTML = exampleText
                        moreInfo.appendChild(exampleParagraph)
                    }

                    definitionContainer.classList.add('contains_more')
                    definitionDiv.addEventListener('click', ()=>{
                        if(moreInfo.style.display!='block'){moreInfo.style.display = 'block'}
                        else{moreInfo.style.display = 'none'}

                    })
                }
                if(meaning.definitions[i].synonyms){
                    for(q=0; q<meaning.synonyms.length; q++){
                        if(!synonym.includes(meaning.synonyms[q]))
                        synonym.push(meaning.synonyms[q])
                    }
                }
            }
            wordTag.innerHTML = currentData.word
            phoneticTag.innerHTML = phoneticText
            audioTag.src = audioUrl

            search_bar.value = ''
        }
    }
    for(z=0; z<synonym.length; z++){
        synonyms.innerHTML = synonyms.textContent + synonym[z] + ', '
    }
    synonyms.innerHTML = synonyms.textContent.slice(0, -2)
}