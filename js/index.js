const FREESOUND_SEARCH_URL = 'https://freesound.org/apiv2/search/text/'
const FREESOUND_SOUND_URL = 'https://freesound.org/apiv2/sounds/'
//const FREESOUND_SIMILAR_URL = /apiv2/sounds/<sound_id>/similar/
const colorSVG = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#2196F3", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"]
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
      sound.previewURL = data.previews['preview-hq-mp3'] //no longer necessary
      sound.previewMP3 = new Howl({
                src: [data.previews['preview-hq-mp3'], data.previews['preview-hq-ogg']]
                })
      soundCountGLOBAL++
      if (soundCountGLOBAL >= soundsGLOBAL.length) {
        createSVG(soundsGLOBAL)
      }
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const freeSoundSimilar = (clickedSoundID) =>{
  // console.log(event.currentTarget)
  // const id = $(event.currentTarget).data('id')
  const id = clickedSoundID
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

const circleAttributes = svgCanvas.selectAll('circle')
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
                      .on("mouseover", function(d) {
                          d3.select(this).style("opacity", .2)
                          d.previewMP3.play()
                        })
                      .on('mouseleave', function(d){
                          d3.select(this).style("opacity", 1)
                          d.previewMP3.stop()
                        })
                      .on('click', function(d, i) {
                          console.log('mouse click')
                          freeSoundSimilar(d.id)
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
