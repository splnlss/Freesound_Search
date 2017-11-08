const FREESOUND_SEARCH_URL = 'https://freesound.org/apiv2/search/text/'
const FREESOUND_SOUND_URL = 'https://freesound.org/apiv2/sounds/'
//const FREESOUND_SIMILAR_URL = /apiv2/sounds/<sound_id>/similar/
const soundsGLOBAL = []
let soundCountGLOBAL = 0

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

const freeSoundPreview = (sound) =>{
  const settings = {
    url: `${FREESOUND_SOUND_URL}${sound.id}`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS',
    },
    success: (data) => {
      sound.previewURL = data.previews['preview-hq-mp3']
      soundCountGLOBAL++
      if (soundCountGLOBAL >= soundsGLOBAL.length) {
        createSVG(soundsGLOBAL)
      }
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const freeSoundSimilar = (event) =>{
  console.log(event.currentTarget)
  const id = $(event.currentTarget).data('id')
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
const colorSVG = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#2196F3", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"]

const importData = (data)=>{
  console.log(data)
  let count = 0;
  if (data){
    data.forEach((item, index) => {
      const sound = {
        name: item.name,
        id: item.id,
        color: colorSVG[index]
      }
      soundsGLOBAL.push(sound)
      freeSoundPreview(sound)
    })
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
const createSVG = (data) =>{

d3.select('main').html('')

const svgCanvas = d3.select('main')
              .append('svg')
                .attr('width', 800)
                .attr('height', 600)

const links = svgCanvas.selectAll('circle')
                  .data(data)
                  .append("a")
                      .attr("xlink:href", function (d){ return d.previewURL})

const circleAttributes = links
                  .data(data)
                  .enter()
                  .append('circle')
                      .attr("cx", function (d, i) {
                        return (((i)%4)*200)+100})
                      .attr("cy", function (d, i) {
                        return (Math.floor(i/4)*200)+100})
                      .attr("r", "40")
                      .attr("id",  function (d,i) { return `button_${i}`; })
                      .style("fill", function (d){return d.color})
                      .on("mouseover", function() {
                          console.log("mouse over")
                          d3.select(this).style("opacity", .2)
                        })
                      .on('mouseleave', function(){
                          console.log("mouse leave")
                          d3.select(this).style("opacity", 1)
                      .on('click')
// const circleFill = circleAttributes
//                   .data(freesoundCircles)
//                   //.enter()
//                   .append('circle')
//                       .style("fill", "blue")
    })
}

const setupUIHandlers = () => {
   $('#FreeSoundSearch').on('submit', handleFormSubmit)
 }
$(setupUIHandlers)

// const displayResults = (searchResults,index) =>{
//   console.log(searchResults)
//   const audioUrl = searchResults.previews['preview-hq-mp3']
//   $('#results').append(`
//       <div class="card">
//         <div class="inner-wrapper">
//       <!--  <audio src="${searchResults.previews['preview-hq-mp3']}" autoplay>
//         Your browser does not support the <code>audio</code> element. -->
//       </audio>
//           <div>
//           <a href=${searchResults.previews['preview-hq-mp3']}>${index}_${searchResults.name}</a> -
//             <input type="button" id="button_${index}" data-id="${searchResults.id}" value="more" />
//           </div>
//         </div>
//       <div>
//   `)
//   $(`#button_${index}`).on('click', freeSoundSimilar)
// }
