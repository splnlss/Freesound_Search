const FREESOUND_SEARCH_URL = 'https://freesound.org/apiv2/search/text/'
const FREESOUND_SOUND_URL = 'https://freesound.org/apiv2/sounds/'
//const FREESOUND_SIMILAR_URL = /apiv2/sounds/<sound_id>/similar/

const freeSoundAPI = (search) =>{
  const settings = {
    url: FREESOUND_SEARCH_URL,
    type: 'GET',
    dataType: 'jsonp',
    data:{
      format: 'jsonp',
      for: 'results:*',
      query: search,
      token: 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS',
    },
    success: (data) => { importData(data.results) },
    failure: (error) => { console.log(`error: ${error}`) }
    }
  $.ajax(settings)
}

const freeSoundPreview = (id) =>{
  const settings = {
    url: `${FREESOUND_SOUND_URL}${id}`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS',
    },
    success: (data) => {
      displayResults(data)
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const freeSoundSimilar = (id) =>{
  const settings = {
    url: `${FREESOUND_SOUND_URL}${id}/similar/`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS',
    },
    success: (data) => {
      importData(data.results)
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const importData = (data)=>{
  if (data){
    for(let i =0; i< data.length; i++){
      freeSoundPreview(data[i].id)
    }
  }else{
  $('#results').html('Zero Results')
  }
}

const handleFormSubmit = (event) =>{
  $('#results').html('')
  event.preventDefault()
  freeSoundAPI($('#q').val())
}

//D3 svg section
const createSVG = (freeSounddata) =>{
console.log(freeSounddata)
let svg = d3.select('main')
            .append('svg')
              .attr('width', 800)
              .attr('height', 600)
              .attr('fill', '#66ff66')

d3.svg.selectAll('circle')
  //.data(freeSounddata)
  //.enter()
  .append('circle')
    .attr('x', '200')
    .attr('y', '200')
    .attr('weight', )
    // .attr('x', function(d, i){
    //   return i * 25 })
    // .attr('y', function(d){
    //   return 150 - d/10 * 1.5
    .attr('radius', '15')
    .attr('fill', '#d1c9b8')
}

const setupUIHandlers = () => {
   $('#FreeSoundSearch').on('submit', handleFormSubmit)
   $('#').on('click',freeSoundSimilar(searchResults.id))
 }

const displayResults = (searchResults) =>{
//  console.log(searchResults)
  const audioUrl = searchResults.previews['preview-hq-mp3']
  //createSVG(audioUrl.length)
  //mySound = new Audio('audioUrl').play()
  $('#results').append(`
      <div class="card">
        <div class="inner-wrapper">
      <!--  <audio src="${searchResults.previews['preview-hq-mp3']}" autoplay>
        Your browser does not support the <code>audio</code> element. -->
      </audio>
          <div> <a href=${searchResults.previews['preview-hq-mp3']}>${searchResults.name}</a> -
          <a href="#">more</a>
          </div>
        </div>
      <div>
  `)
}

$(setupUIHandlers)
