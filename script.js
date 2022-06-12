const wordTag = document.querySelector('.word')
const search_bar = document.querySelector('.search')
const search_button = document.querySelector('.search_button')
const phoneticTag = document.querySelector('.phonetic')
const audioTag = document.querySelector('.audio')
const definitionsTag = document.querySelector('.definitionsTag')
const definitionsContainer = document.querySelector('.definitionsContainer')
const books = document.querySelector('.books')
const synonymsContainer = document.querySelector('.synonyms_container')
const play_button = document.querySelector('.play_button')
const showNonyms = document.querySelector('.show_nonyms')

//run loadData function on ENTER or CLICK
search_button.addEventListener('click', loadData)
search_bar.addEventListener('keypress', (event)=>{if(event.key==='Enter'){loadData(); search_bar.blur()}})

async function loadData() {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+search_bar.value);
    const data = await response.json();
    search(data)
    if (!response.ok) {
		wordTag.innerHTML = 'No results to show'
        synonymsContainer.style.display = 'none'
        play_button.style.display='none'
        phoneticTag.style.display='none'
	}
  }

function search(data){
    books.style.display='none'
    search_bar.value = ''

    while(definitionsContainer.firstChild){
        definitionsContainer.removeChild(definitionsContainer.lastChild)
    }

// find audio URL and phonetic notation
    for(j=0; j<data.length; j++){

        currentData = data[j]
        let audioUrl = ''
        let phoneticText = ''

        for(i=0; i<currentData.phonetics.length; i++){
                
            //find audioURL
            if(currentData.phonetics[i].audio && !audioUrl){
                audioUrl=currentData.phonetics[i].audio
                play_button.style.display = 'block'
            }
            else if(!currentData.phonetics[i].audio && !audioUrl){
                play_button.style.display = 'none'
            }

            //find phonetics notation
            if(currentData.phonetics[i].text && !phoneticText){
                phoneticText=currentData.phonetics[i].text
                phoneticTag.style.display = 'block'
            }
            else if(!currentData.phonetics[i].audio && !phoneticText){
                phoneticTag.style.display = 'none'
            }
        }
        wordTag.innerHTML = currentData.word
        phoneticTag.innerHTML = phoneticText
        audioTag.src = audioUrl
    }

//find definitions and examples
    for(j=0; j<data.length; j++){
        currentData = data[j]
        
        //go through all meanings
        for(y=0; y<currentData.meanings.length; y++){
            let meaning = currentData.meanings[y]
            //create div and add class to it
            const meaningDiv = document.createElement('div')
            meaningDiv.classList.add(currentData.meanings[y].partOfSpeech)
            definitionsContainer.appendChild(meaningDiv)

            // create paragraph and insert text into it
            const partOfSpeech = document.createElement('p')
            meaningDiv.appendChild(partOfSpeech)
            partOfSpeech.classList.add('part_of_speech')
            partOfSpeech.innerHTML = meaningDiv.className

            //go through all definitions
            for(i=0; i<meaning.definitions.length; i++){
                if(meaning.definitions[i].definition!=':'){//skip empty definitions
                    //create definition container
                    definitionContainer = document.createElement('div')
                    definitionContainer.classList.add('def_container')
                    //create definition DIV and add it to container
                    definitionDiv = document.createElement('div')
                    definitionDiv.classList.add('definition')
                    definitionContainer.appendChild(definitionDiv)
                    meaningDiv.appendChild(definitionContainer)
                    definitionDiv.innerHTML = meaning.definitions[i].definition + '<br>'
                }

                //if an example is available
                if(meaning.definitions[i].example){
                    //create moreInfo DIV that will contain example
                    const moreInfo = document.createElement('div')
                    definitionDiv.appendChild(moreInfo)
                    //create example paragraph that will contain text of the example
                    const exampleParagraph = document.createElement('p')
                    let exampleText = meaning.definitions[i].example
                    exampleParagraph.innerHTML = exampleText
                    moreInfo.appendChild(exampleParagraph)
                    //add class to definition container that makes it stand out
                    definitionContainer.classList.add('contains_more')
                    definitionContainer.addEventListener('click', ()=>{
                        if(moreInfo.style.display!='block'){moreInfo.style.display = 'block'}
                        else{moreInfo.style.display = 'none'}
                    })
                }
            }
        }
    }

    //collect synonyms and antonyms
    let synonym = []
    let antonym = []
    for(j=0; j<data.length; j++){
        currentData = data[j]
        for(y=0; y<currentData.meanings.length; y++){
            let meaning = currentData.meanings[y]
            for(i=0; i<meaning.definitions.length; i++){
                if(meaning.definitions[i].synonyms){
                    for(q=0; q<meaning.synonyms.length; q++){
                        if(!synonym.includes(meaning.synonyms[q]))
                        synonym.push(meaning.synonyms[q])
                    }
                }
                if(meaning.definitions[i].antonyms){
                    for(q=0; q<meaning.antonyms.length; q++){
                        if(!antonym.includes(meaning.antonyms[q]))
                        antonym.push(meaning.antonyms[q])
                    }
                }
            }
        }
    }
    console.log(synonym)
    console.log(antonym)

    //delete all previous synonyms and antonyms
    while(synonymsContainer.firstChild){
        synonymsContainer.removeChild(synonymsContainer.lastChild)
    }

    synonymsContainer.style.display = 'block'
    //display synonyms on page
    const synonymsParagraph = document.createElement('p')
    synonymsParagraph.classList.add('synonyms_p')
    for(s=0; s<synonym.length; s++){
        synonymsParagraph.innerHTML = synonymsParagraph.textContent + synonym[s] + ', '
    }
    synonymsParagraph.innerHTML = synonymsParagraph.textContent.slice(0, -2)
    if(synonym.length>0){
        synonymsContainer.appendChild(synonymsParagraph)
    }

    //display antonyms on page
    const antonymsParagraph = document.createElement('p')
    antonymsParagraph.classList.add('antonyms_p')
    for(a=0; a<antonym.length; a++){
        antonymsParagraph.innerHTML = antonymsParagraph.textContent + antonym[a] + ', '
    }
    antonymsParagraph.innerHTML = antonymsParagraph.textContent.slice(0, -2)
    if(antonym.length>0){
        synonymsContainer.appendChild(antonymsParagraph)
    }

    if(synonym.length>0 || antonym.length>0){
        showNonyms.innerHTML = 'Show synonyms and antonyms'
        synonymsContainer.appendChild(showNonyms)
        synonymsContainer.style.display='flex'
    }
    else{
        synonymsContainer.style.display='none'
    }
    synonymsContainer.addEventListener('click', ()=>{
        if(synonymsParagraph.style.display!='block'){
            synonymsParagraph.style.display='block'
            antonymsParagraph.style.display='block'
            showNonyms.innerHTML = ''
        }
        else{
            synonymsParagraph.style.display='none'
            antonymsParagraph.style.display='none'
            showNonyms.innerHTML = 'Show synonyms and antonyms'
        }
    })
}