//onClickSVG
const onClickSVG = (data, clickedSound) =>{

  const radius = 200
  const numNodes = 8
  const circleDestinationX = WIDTH/2
  const circleDestinationY = HEIGHT/2

  const svgCanvas = d3.select('main').select('svg')

  svgCanvas.selectAll('circle')
  .transition()
  .duration(200)
  .attr("r", 30)

  console.log(clickedSound)

  svgCanvas.select(`#button_${clickedSound.id}`)
  .transition()
  .duration(200)
  .attr("r", 40)
  .attr("cx", circleDestinationX)
  .attr("cy", circleDestinationY)
  .on('end', function(){
    console.log($(this).data)
    const clickedCircle = this

    d3.selectAll('svg > *').each(

      function(d,i) {
        if (i === 0) {
          //console.log(`2nd: #button_${previousClickedSound}`) // second time running this becomes undefined
          d3.select(`#button_${previousClickedSound}`).remove()
        }
         if (`button_${d.id}` !== clickedCircle.id) {
          //  d3.selectAll(`circles`)
          d3.selectAll(`#button_${d.id}`).remove()
          d3.selectAll('line').remove()

          // .on("mouseenter", function(d){
          //   $(this).animate({'opacity': '0.3'}, 10)
          //     //  displayLink(d.similar)
          //     clickedSound.previewMP3.play() //fade might not working!!
          // })
          // .on('mouseout', function(d){
          //     $(this).animate({'opacity': '1'}, 10)
          //     clickedSound.previewMP3.pause()
          // })
          // .on('click', function(d, i) {
          //   clickedSound.previewMP3.pause()
          //   onClickSVG(clickedSound,clickedSound.parent)
          //   console.log(clickedSound.parent)
          // })
          //console.log(`cx: ${}`)
          // .transition()
          // .duration(500)
          // .attr("cx", function (d, i) {
          //   return (((i)%4)*200)+100})
          //   .attr("cy", function (d, i) {
          //     return (Math.floor(i/4)*200)+100})
        }
      })

      let nodes = createNodes(numNodes, radius, data)
      // nodes.forEach(function(svgCanvas, nodes, 25, data, clickedSound)){
      createElements(svgCanvas, nodes, 25, data, clickedSound)
      previousClickedSound = clickedSound.id
      //console.log(previousClickedSound)
      // }
      //for(i=0; i< data.length; i++){
      //  createElements(svgCanvas, nodes, 25, data, clickedSound)
        // createLines(svgCanvas, nodes, 25, data, clickedSound)
        // createCircles(svgCanvas, nodes, 25, data, clickedSound)
      //}
    })
  }
  const createNodes = function (numNodes, radius, data) {
    let nodes = [],
    angle,
    x,
    y,
    i

    for (i=0; i<numNodes; i++) {
      angle = (i / (numNodes/2)) * Math.PI // Calculate the angle at which the element will be placed.
      // For a semicircle, we would use (i / numNodes) * Math.PI.
      x1 = (40 * Math.cos(angle)) + (WIDTH/2) // Calculate the x position of the element - radius of circle.
      y1 = (40 * Math.sin(angle)) + (HEIGHT/2)
      x2 = ((radius-30) * Math.cos(angle)) + (WIDTH/2) // Calculate the x position of the element.
      y2 = ((radius-30) * Math.sin(angle)) + (HEIGHT/2)
      x = ((radius) * Math.cos(angle)) + (WIDTH/2) // Calculate the x position of the element.
      y = ((radius) * Math.sin(angle)) + (HEIGHT/2) // Calculate the y position of the element.

      nodes.push({'id': i, 'w': x1, 'h': y1, 'x': x, 'y': y,'x2': x2, 'y2': y2, 'id':data[i].id, 'color':data[i].color ,'url': data[i].previewMP3 }, ) //'url': urls[i]})
    //  console.log(`x1 = ${x1}, y1 = ${y1}: x1 = ${WIDTH/2}, y1 = ${HEIGHT/2}`)
    }
    return nodes

  }

const createElements = function (svgCanvas, nodes, elementRadius, data, clickedSound) {

// const createLines = function (svgCanvas, nodes, elementRadius, data, clickedSound) {
    svgCanvas.selectAll('line')
    .data(nodes)
    .enter()
    .append('line')  // colour the line
    .style("stroke", function (d, i) {
      return d.color})
      .attr("x1", function (d, i) {
        return d.w})
        .attr("y1", function (d, i) {
          return d.h})
          .attr("x2", function (d, i) {
            return d.w})
            .attr("y2", function (d, i) {
              return d.h})
              .transition()
              .duration(300)
              .attr("x2", function (d, i) {
                return d.x2 })
                .attr("y2", function (d, i) {
                  return d.y2 })

// }
// const createCircles = function (svgCanvas, nodes, elementRadius, data, clickedSound) {
//     console.log(nodes)
    svgCanvas.selectAll('circle')
                  .data([{}].concat(nodes))
                  //append('circle')
                  .enter()
                  .append('circle')
                  .attr('r', 1)
                  .attr('cx', function (d, i) {
                    return WIDTH/2;
                  })
                  .attr('cy', function (d, i) {
                    return HEIGHT/2;
                  })
                  .attr("id",  function (d,i) { return `button_${d.id}`; })
                  .style("fill", function (d, i) {
                          return d.color}) //function (d){return d.color})
                    .on("mouseenter", function(d) {
                      d3.select(this).style("opacity", .2)
                      //displayLink(d)
                      //  d.previewMP3.loop('true', d.id) -- d.previewMP3.fade(0.0, 0.9, 100)
                        d.url.play() //fade might not working!!
                    })
                    .on('mouseout', function(d){
                      d3.select(this).style("opacity", 1)
                      //d.previewMP3.fade(.9, 0.0, 100) //fade might not working!!
                        d.url.pause()
                    })
                    .on('click', function(d, i) {
                      d.url.pause()
                      freeSoundSimilar(d, i)
                    })
                  .transition(500)
                          .attr('r', 30)//elementRadius)
                          .attr('cx', function (d, i) {
                            return d.x;
                          })
                          .attr('cy', function (d, i) {
                            return d.y;
                          })
    // svgCanvas.select(`#button_${clickedSound.id}`)
    //           .transition()
    //           .duration(200)
    //           .attr("r", 41)
    //           .attr("cx", WIDTH/2)
    //           .attr("cy", HEIGHT/2)

                  }


                  // svgCanvas.selectAll('circles')//(`#button_${clickedSound}`)
                  //             .data(nodes)
                  //             .transition()
                  //             .duration(2000)
                  //                 .attr('r', elementRadius)
                  //                 .attr('cx', function (d, i) {
                  //                   return d.x;
                  //                 })
                  //                 .attr('cy', function (d, i) {
                  //                   return d.y;
                  //                 })
                  // }
