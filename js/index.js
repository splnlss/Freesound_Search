const FREESOUND_SEARCH_URL = 'https://freesound.org/apiv2/search/text/'
const FREESOUND_SOUND_URL = 'https://freesound.org/apiv2/sounds/'
//const TOKEN = '0I1HhPkTR6FNyhlsfoq4FQAAGob5bgvl6LAlO7A3'
const TOKEN = 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS'
//const TOKEN = 'Y65kZl2GTZuwcJ9YXtStETJ42ExnHOiPvEyd5Sxd'
//const TOKEN = `2pPoWxsaljUWbKdOUsVtv3NfVdBtBrfvjmVALAqd`
//const FREESOUND_SIMILAR_URL = /apiv2/sounds/<sound_id>/similar/
const colorSVG = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"]
const soundsGLOBAL = []
let previousClickedSound = 0
let soundCountGLOBAL = 0
const totalResults = 8  // make upper case to designate global
const WIDTH = 800
const HEIGHT = 600

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
      fields: "name,id,username,url,previews" //,description
    },

    success: (data) => { importData(data.results) },
    failure: (error) => { console.log(`error: ${error}`) }
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
      console.log('clicked sound in freesoundsimilar')
      console.log(clickedSound)
      importData(data.results, clickedSound, clickedSoundIndex)
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const randomColor = (max, exclude) =>{
    let colorArray = colorSVG.filter( color => color !== exclude)
      return colorArray
}

const importData = (data, clickedSound, clickedSoundIndex)=>{
  console.log('clickedsound in importdata')
  console.log(clickedSound)
  let resultArray = []
  console.log(data)
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
    onClickSVG((soundsGLOBAL[clickedSoundIndex].similar), clickedSound)
  }else{
    data.forEach((item, index) => {
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
    })
    createSVG(soundsGLOBAL)
  }
}else{
  $('#results').html('Zero Results')
}
}

const handleFormSubmit = (event) =>{
  event.preventDefault()
  soundsGLOBAL.splice(0,soundsGLOBAL.length) //remove all of array, clear array
  $('#results').html('')
  freeSoundAPI($('#q').val())
}

// const noSearchResults = () =>{
//     const svgCanvas = d3.select('main').html('')
//     $('#main').append(`
//       <a> There are not enought search results</a>
//       `)
// }

const createSVG = (data) =>{

  const svgCanvas = d3.select('main').html('')
  .append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

  const circleAttributes = svgCanvas.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr("cx", function (d, i) {
    return (((i)%4)*200)+100})
    .attr("cy", function (d, i) {
      return (Math.floor(i/4)*200)+100})
      .attr("r", "40")
      .attr("id",  function (d,i) { return `button_${d.id}`; })
      .style("fill", function (d){return d.color})
      .on("mouseenter", function(d) {
        d3.select(this).style("opacity", .2)
        displayLink(d)
        //  d.previewMP3.loop('true', d.id) -- d.previewMP3.fade(0.0, 0.9, 100)
          d.previewMP3.play() //fade might not working!!
      })
      .on('mouseout', function(d){
          d3.select(this).style("opacity", 1)
        //d.previewMP3.fade(.9, 0.0, 100) //fade might not working!!
          d.previewMP3.pause()
      })
      .on('click', function(d, i) {
          d.previewMP3.pause()
          freeSoundSimilar(soundsGLOBAL[i], i) //map d to actual clicked sound
      })
    }

const displayLink = (data) =>{
      // convert to a string with x characters and remove last character in string - alt="${truncatedDescription}"
          console.log(data)
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
      $('#FreeSoundSearch').on('submit', handleFormSubmit)
    }
    $(setupUIHandlers)
