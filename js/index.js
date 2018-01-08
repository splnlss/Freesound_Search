const FREESOUND_SEARCH_URL = 'https://freesound.org/apiv2/search/text/'
const FREESOUND_SOUND_URL = 'https://freesound.org/apiv2/sounds/'
const TOKEN = '0I1HhPkTR6FNyhlsfoq4FQAAGob5bgvl6LAlO7A3'

const colorSVG = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"]
const soundsGLOBAL = []
let previousClickedSound = 0
let soundCountGLOBAL = 0
const totalResults = 8  // make upper case to designate global
const WIDTH = 800
const HEIGHT = 600
let onClickSimilar = null;
let onClickSound = null;



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
      count: 12,
      fields: "name,id,username,url,previews" // description
    },
    success: (data) => { importData(data.results) },
    failure: (error) => { console.log(`error: ${error}`)
      noSearchResults()
   }
  }
  $.ajax(settings)
}

const freeSoundSimilar = (clickedSound, clickedSoundIndex) =>{
  const settings = {
    url: `${FREESOUND_SOUND_URL}${clickedSound.id}/similar/`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: TOKEN,
      count: 13,
      fields: "name,id,username,url,previews" //,description"
    },
    success: (data) => {
      importData(data.results, clickedSound, clickedSoundIndex)
    },
    failure: (error) => { console.log(`error: ${error}`)
        noSearchResults()
  }
  }
  $.ajax(settings)
}

const randomColor = (max, exclude) =>{
    let colorArray = colorSVG.filter( color => color !== exclude)
      return colorArray
}

const importData = (data, clickedSound, clickedSoundIndex)=>{
  if (data.length <= 3){
    noSearchResults()
  }else{
  let resultArray = []
  if (data){
    if(clickedSound){
      const colors = randomColor(data.length, clickedSound.color)
      data.forEach((item, index) => {
        const soundSimilar = {
          name: item.name,
          user: item.username,
        //  description: item.description,
          id: item.id,
          parent: clickedSound,
          color: colors[index],
          similar: [],
          previewMP3: new Howl({
            src: [item.previews['preview-hq-mp3'], item.previews['preview-hq-ogg']]
          })
      }
      soundsGLOBAL[clickedSoundIndex].similar.push(soundSimilar)
    })
    onClickSimilar = soundsGLOBAL[clickedSoundIndex].similar
    onClickSound = clickedSound
    onClickSVG((soundsGLOBAL[clickedSoundIndex].similar), clickedSound)
  }else{
    data.forEach((item, index) => {
      if(index < 12 ){
      const sound = {
        name: item.name,
        user: item.username,
      //  description: item.description,
        id: item.id,
        color: colorSVG[index],
        similar: [],
        previewMP3: new Howl({
          src: [item.previews['preview-hq-mp3'], item.previews['preview-hq-ogg']]
        })
      }
      soundsGLOBAL.push(sound)
    }}
      )
    $('header').removeClass("landingPage")
    $('main').removeClass("landingPage")
    $('#freeSoundSearch').removeClass("landingPage")
    $('#instructions').removeClass("landingPage")
    createSVG(soundsGLOBAL)
  }
}else{
  noSearchResults()
}
}
}

const handleFormSubmit = (event) =>{
  event.preventDefault()
  soundsGLOBAL.splice(0,soundsGLOBAL.length) //remove all of array, clear array
  $('#results').html('')
  freeSoundAPI($('#q').val())
}

const noSearchResults = () =>{
    $('results').html('')
    $('results').append(`
      <section role="region" id="instructions" aria-live="assertive">
        <span> There are not enough search results. Please try again. </span>
      </section>
      `)
}

const createSVG = (data) =>{

const innerWidth = window.innerWidth // window.devicePixelRatio
console.log(window.devicePixelRatio) //number times scale; 1.0 or 2.0
const mobile = innerWidth <= 640
  const width = innerWidth // mobile ? innerWidth : 640
  const columns = mobile ? 3 : 4
  const multiplier = mobile ? width/3 : width/5
  const offset = width/6
  const radius = mobile ? 25 : 40
  const svgCanvas = d3.select('#results').html('')
  .append('svg')
  .attr('width', width)
  .attr('height', window.innerHeight - 60) //s window.devicePixelRatio

  const circleAttributes = svgCanvas.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr("cx", function (d, i) {
    return (((i)%columns)*multiplier)+offset})
    .attr("cy", function (d, i) {
      return (Math.floor(i/columns)*multiplier)+offset})
      .attr("r", radius)
      .attr("id",  function (d,i) { return `button_${d.id}`; })
      .style("fill", function (d){return d.color})
      .on("mouseenter", function(d) {
        d3.select(this).style("opacity", .2)
        displayLink(d)
          d.previewMP3.play() //fade might not working!!
      })
      .on("touchstart", function(d) {
        d3.select(this).style("opacity", .2)
        displayLink(d)
        d.previewMP3.play()
      })
      .on('mouseout', function(d){
          d3.select(this).style("opacity", 1)
          d.previewMP3.pause()
      })
      .on('touchcancel', function(d){
          d3.select(this).style("opacity", 1)
          d.previewMP3.pause()
          console.log('Touch Cancel')
      })
      .on('click', function(d, i) {
          d.previewMP3.pause()
          freeSoundSimilar(soundsGLOBAL[i], i) //map d to actual clicked sound
      })
      .on('touchend', function(d, i) {
          d.previewMP3.pause()
          freeSoundSimilar(soundsGLOBAL[i], i) //map d to actual clicked sound
      })
    }

const displayLink = (data) =>{

          const nameTruncate=(data.name)
          const textName = textTruncate(data.name)
          $('#soundLink').html(``)
          $('#soundLink').append(`
           <span><a href="https://freesound.org/people/${data.user}/sounds/${data.id}"
           target="_blank">
           ${textName}</a></span>`)
          }

const textTruncate = (str) =>{
          length = 50;
          ending = '...';

          if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
          } else {
            return str;
          }
        }

    const setupUIHandlers = () => {
      $('#freeSoundSearch').on('submit', handleFormSubmit)
      $(window).resize((event) => {
        console.log('resize')
        if(onClickSimilar && onClickSound){
          console.log('resized')
        onClickSVG(onClickSimilar, onClickSound)
      }})
      // $(window).on('orientationChange', (event) => {
      //   console.log('orientation')
      //   if(onClickSimilar && onClickSound){
      //     console.log('orientationChanged')
      //   onClickSVG(onClickSimilar, onClickSound)
      // }
      // })
    }
    $(setupUIHandlers)
