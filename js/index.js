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

const freeSoundPreview = (id, index) =>{
  const settings = {
    url: `${FREESOUND_SOUND_URL}${id}`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS',
    },
    success: (data) => {
      displayResults(data,index)
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const freeSoundSimilar = (event) =>{
  const id = event.currentTarget.data('id')
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
    data.forEach((item, index) => {
      freeSoundPreview(data[index].id, index)
    })
    // for(let i =0; i< data.length; i++){
    //   freeSoundPreview(data[i].id)
    // }
  }else{
  $('#results').html('Zero Results')
  }
}

const handleFormSubmit = (event) =>{
  $('#results').html('')
  event.preventDefault()
  freeSoundAPI($('#q').val())
  //createSVG(['#00bfff', '#00ffbf',' #00ff40', '#ffff00', '#ff0040','#8000ff'])
}

//D3 svg section
const createSVG = (data) =>{
//console.log(fillColor)

const freesoundCircles = [
  { "x_axis": 100, "y_axis": 100, "radius": 40, "color" : "green" },
  { "x_axis": 300, "y_axis": 100, "radius": 40, "color" : "purple"},
  { "x_axis": 500, "y_axis": 100, "radius": 40, "color" : "red"},
  { "x_axis": 700, "y_axis": 100, "radius": 40, "color" : "blue"},
  { "x_axis": 100, "y_axis": 300, "radius": 40, "color" : "blue"},
  { "x_axis": 300, "y_axis": 300, "radius": 40, "color" : "red" },
  { "x_axis": 500, "y_axis": 300, "radius": 40, "color" : "purple"},
  { "x_axis": 700, "y_axis": 300, "radius": 40, "color" : "green"}]

const svgCanvas = d3.select('main')
              .append('svg')
                .attr('width', 800)
                .attr('height', 600)

const circles = svgCanvas.selectAll('circle')
                  .data(data)
                  .append("a")
                      .attr("xlink:href", function (d){ return d}) //*** how to create audioUrl
                  .append('circle')

const circleAttributes = circles
              .data(freesoundCircles)
              .enter()
              .append('circle')
                  .attr("cx", function (d) { return d.x_axis; })
                  .attr("cy", function (d) { return d.y_axis; })
                  .attr("r", function (d) { return d.radius; })
                  .attr("id",  function (d,i) { return `button_${i}`; })
                  .style("fill", function(d) { return d.color; })
                  .on("mouseover", function() {
                      console.log("mouse over")
                      d3.select(this).style("opacity", .2)
                    })
                  .on('mouseleave', function(){
                      console.log("mouse leave")
                      d3.select(this).style("opacity", 1)
    })
}

const setupUIHandlers = () => {
   $('#FreeSoundSearch').on('submit', handleFormSubmit)
 }

const displayResults = (searchResults,index) =>{
  console.log(searchResults)
  const audioUrl = searchResults.previews['preview-hq-mp3']
  createSVG(audioUrl)
  //mySound = new Audio('audioUrl').play()
  $('#results').append(`
      <div class="card">
        <div class="inner-wrapper">
      <!--  <audio src="${searchResults.previews['preview-hq-mp3']}" autoplay>
        Your browser does not support the <code>audio</code> element. -->
      </audio>
          <div> <a href=${searchResults.previews['preview-hq-mp3']}>${index}_${searchResults.name}</a> -
          <a class="moreButton" id="button_${index}" data-resultId=${searchResults.id}>more</a>
          </div>
        </div>
      <div>
  `)
  $(`#button_${index}`).on('click', freeSoundSimilar)
}

$(setupUIHandlers)
