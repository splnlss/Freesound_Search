const FREESOUND_SEARCH_URL = 'https://freesound.org/apiv2/search/text/'
const FREESOUND_SOUND_URL = 'https://freesound.org/apiv2/sounds/'
const TOKEN = '0I1HhPkTR6FNyhlsfoq4FQAAGob5bgvl6LAlO7A3'
//const TOKEN = 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS'
//const FREESOUND_SIMILAR_URL = /apiv2/sounds/<sound_id>/similar/
const colorSVG = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"]
const soundsGLOBAL = []
let soundCountGLOBAL = 0
const totalResults = 8

const freeSoundAPI = (search) =>{
  const settings = {
    url: FREESOUND_SEARCH_URL,
    type: 'GET',
    dataType: 'jsonp',
    data:{
      format: 'jsonp',
      for: 'results:*',
      query: search,
      token: TOKEN,
    },
    success: (data) => { importData(data.results) },
    failure: (error) => { console.log(`error: ${error}`) }
    }
  $.ajax(settings)
}

const freeSoundPreview = (sound, clickedSoundID) =>{
  const settings = {
    url: `${FREESOUND_SOUND_URL}${sound.id}`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: TOKEN,
    },
    success: (data) => { // should all below be moved to a sepparate function???
      soundCountGLOBAL++
      if (soundCountGLOBAL >= soundsGLOBAL.length) {
        console.log(`soundsGLOBAL.length = ${soundsGLOBAL.length}`)
        if((soundsGLOBAL.length) == 1){               // is this not writing over original??
          sound.previewURL = data.previews['preview-hq-mp3'] //no longer necessary
          sound.previewMP3 = new Howl({
                    src: [data.previews['preview-hq-mp3'], data.previews['preview-hq-ogg']]
                    })
          createSVG(soundsGLOBAL[(soundsGLOBAL.length-1)], clickedSoundID)
        }else{
          sound.previewURL = data.previews['preview-hq-mp3'] //no longer necessary
          sound.previewMP3 = new Howl({
                    src: [data.previews['preview-hq-mp3'], data.previews['preview-hq-ogg']]
                    })
          onClickSVG(soundsGLOBAL[(soundsGLOBAL.length-1)], clickedSoundID)
        }
      }
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const freeSoundSimilar = (clickedSoundID, clickedSoundIndex) =>{
  // console.log(event.currentTarget)
  // const id = $(event.currentTarget).data('id')
  const id = clickedSoundID
  const settings = {
    url: `${FREESOUND_SOUND_URL}${id}/similar/`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: TOKEN,
    },
    success: (data) => {
      importData(data.results, clickedSoundID)
      console.log(clickedSoundID)
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const importData = (data, clickedSoundID)=>{
  let count = 0;
  let resultArray = []
  const colorArray = []
  const randomColor = (max) =>{
        const randomOutput = Math.round(Math.random(max) *10)
        //console.log(colorArray.includes(randomOuput))
        // while((colorArray.includes(randomOuput)) {
        //   randomOutput = Math.round(Math.random(max) *10)
        // }else{
          //colorArray.push(randomOuput)
          return randomOutput
        }
  if (data){
    if(clickedSoundID){  //Still necessary???
      //resultArray  = clickedSoundID
      //resultArray = [] //don't use array, use objects!!
      data.forEach((item, index) => {
        const soundSimilar = {
          name: item.name,
          id: item.id,
          color: colorSVG[(randomColor(index))]
        }
      resultArray[index] = soundSimilar
      freeSoundPreview(soundSimilar, clickedSoundID)
      //onClickSVG(soundSimilar, clickedSoundIndex)
      })
      soundsGLOBAL.push(resultArray)
      console.log(soundsGLOBAL[(soundsGLOBAL.length-1)])

    }else{
      clickedSoundID = 100001
      //resultArray  = clickedSoundID
      //console.log(resultArray)
      //resultArray = []
      data.forEach((item, index) => {
          const sound = {
            name: item.name,
            id: item.id,
            color: colorSVG[index]
          }
        resultArray[index] = sound //naming of clickedSoundIndex not working...
        freeSoundPreview(sound, clickedSoundID) //set clickedSoundIndex after sending it to 1st click
      })
      soundsGLOBAL.push(resultArray)
    }

    //console.log(soundsGLOBAL[(soundsGLOBAL.length-1)]) //use objects instead of arrays!! .clickedSoundIndex)
  }else{
    $('#results').html('Zero Results')
  }
}

const handleFormSubmit = (event) =>{
  $('#results').html('')
  event.preventDefault()
  freeSoundAPI($('#q').val())
}

const createSVG = (data, index) =>{

const svgCanvas = d3.select('main').html('')
              .append('svg')
                .attr('width', 800)
                .attr('height', 600)

const circleAttributes = svgCanvas.selectAll('circle')
                  .data(data)
                  .enter()
                //  .transition()
                  .append('circle')
                      .attr("cx", function (d, i) {
                        return (((i)%4)*200)+100})
                      .attr("cy", function (d, i) {
                        return (Math.floor(i/4)*200)+100})
                      .attr("r", "40")
                      .attr("id",  function (d,i) { return `button_${d.id}`; })
                      .style("fill", function (d){return d.color})
                      .on("mouseover", function(d) {
                          d3.select(this).style("opacity", .2)
                        //  d.previewMP3.loop('true', d.id) -- d.previewMP3.fade(0.0, 0.9, 100)
                          d.previewMP3.play() //fade might not working!!
                        })
                      .on('mouseleave', function(d){
                          d3.select(this).style("opacity", 1)
                          //d.previewMP3.fade(.9, 0.0, 100) //fade might not working!!
                          d.previewMP3.pause()
                        })
                      .on('click', function(d, i) {
                          d.previewMP3.pause()
                          freeSoundSimilar(d.id, i)
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
