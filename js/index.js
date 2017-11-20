const FREESOUND_SEARCH_URL = 'https://freesound.org/apiv2/search/text/'
const FREESOUND_SOUND_URL = 'https://freesound.org/apiv2/sounds/'
//const TOKEN = '0I1HhPkTR6FNyhlsfoq4FQAAGob5bgvl6LAlO7A3'
const TOKEN = 'arDESEy8t1jg4YeEM3tUntX3MXMeuZBlxEQu9evS'
//const TOKEN = 'Y65kZl2GTZuwcJ9YXtStETJ42ExnHOiPvEyd5Sxd'
//const FREESOUND_SIMILAR_URL = /apiv2/sounds/<sound_id>/similar/
const colorSVG = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"]
const soundsGLOBAL = []
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
      fields: "name,id"
    },
    success: (data) => { importData(data.results) },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const freeSoundPreview = (sound, clickedSound, clickedSoundIndex, callback) =>{
  const settings = {
    url: `${FREESOUND_SOUND_URL}${sound.id}`,
    type: `GET`,
    dataType: `jsonp`,
    data:{
      format: 'jsonp',
      token: TOKEN,
      fields: "previews"
    },
    success: (data) => {
    //  console.log('URLCall_line 41:' + ${data})
      sound.previewMP3 = new Howl({
        src: [data.previews['preview-hq-mp3'], data.previews['preview-hq-ogg']]
      })
      // if(sound.length <=5 || sound.similar.length <= 5){
      //   noSearchResults()
      //   console.log("no results")
      // }
      callback()
    },
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
      fields: "name,id"
    },
    success: (data) => {
      data.results.splice(0,1) //removing duplicate sound at beginning of each array)
      importData(data.results, clickedSound, clickedSoundIndex)
    },
    failure: (error) => { console.log(`error: ${error}`) }
  }
  $.ajax(settings)
}

const randomColor = (max, exclude) =>{
    let colorArray = colorSVG.filter( color => color !== exclude)
    // let randomColors = colorArray[Math.floor(Math.random() * colorArray.length)]
      return colorArray
}

const importData = (data, clickedSound, clickedSoundIndex)=>{
  let resultArray = []

  if (data){
    if(clickedSound){
      const colors = randomColor(data.length, clickedSound.color)
      let count = 0;
      data.forEach((item, index) => {
      //console.log(`item: ${item} index: ${index}`)
        const soundSimilar = {
          name: item.name,
          parent: clickedSound,
          id: item.id,
          color: colors[index],
          similar: []
      }
      freeSoundPreview(soundSimilar, clickedSound, clickedSoundIndex, () => {
        count++
        //console.log(soundsGLOBAL[clickedSoundIndex].similar)
        soundsGLOBAL[clickedSoundIndex].similar.push(soundSimilar)
        if (count >= data.length - 1){
          // if(clickedSound){
          //  console.log(soundsGLOBAL[clickedSoundIndex].similar)
            onClickSVG((soundsGLOBAL[clickedSoundIndex].similar), clickedSound)
          // }
        }
        //count++
      })
    })
  }else{
    let count = 0

    data.forEach((item, index) => {
      const sound = {
        name: item.name,
        id: item.id,
        color: colorSVG[index],
        similar: []
      }
      freeSoundPreview(sound, null, null, () => {
        count++
        soundsGLOBAL.push(sound)
        if (count >= data.length - 1) {
            createSVG(soundsGLOBAL)
        }
      })

    })
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
          freeSoundSimilar(d, i)
      })
    }

    const setupUIHandlers = () => {
      $('#FreeSoundSearch').on('submit', handleFormSubmit)
    }
    $(setupUIHandlers)
