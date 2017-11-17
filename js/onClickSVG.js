//onClickSVG
const onClickSVG = (data, clickedSound) =>{

  const radius = 150
  const numNodes = 8
  const circleDestinationX = WIDTH/2
  const circleDestinationY = HEIGHT/2

  const svgCanvas = d3.select('main').select('svg')

    svgCanvas.selectAll('circle')
    .transition()
    .duration(500)
    .attr("r", 30)

    svgCanvas.select(`#button_${clickedSound.id}`)
    .transition()
    .duration(500)
    .attr("r", 40)
    .attr("cx", circleDestinationX)
    .attr("cy", circleDestinationY)
    .on('end', function(){

  const clickedCircle = this

    d3.selectAll('svg > *').each(

      function(d,i) {
        if (`button_${d.id}` !== clickedCircle.id) {
        //  d3.selectAll(`circles`)
          d3.selectAll(`#button_${d.id}`).remove()
          d3.selectAll('line').remove()
          //console.log(`cx: ${}`)
          // .transition()
          // .duration(500)
          // .attr("cx", function (d, i) {
          //   return (((i)%4)*200)+100})
          //   .attr("cy", function (d, i) {
          //     return (Math.floor(i/4)*200)+100})
        }
      })
    let nodes = createNodes(numNodes, radius, data);
    createElements(svgCanvas, nodes, 25, data, clickedSound);
    console.log(`create nodes: ${nodes}`)
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
    x = (radius * Math.cos(angle)) + (WIDTH/2) // Calculate the x position of the element.
    y = (radius * Math.sin(angle)) + (HEIGHT/2) // Calculate the y position of the element.

    nodes.push({'id': i, 'w': WIDTH, 'h': HEIGHT, 'x': x, 'y': y, 'id':data[i].id, 'color':data[i].color ,'url': data[i].previewMP3 }, ) //'url': urls[i]})
  }
  return nodes
}

const createElements = function (svgCanvas, nodes, elementRadius, data, clickedSound) {

  svgCanvas.selectAll('line')
  .data(nodes)
  .enter()
  .append('line')  // colour the line
  .style("stroke", function (d, i) {
    return d.color})
    .attr("x1", function (d, i) {
      return d.w/2})
      .attr("y1", function (d, i) {
        return d.h/2})
        .attr("x2", function (d, i) {
          return d.w/2})
          .attr("y2", function (d, i) {
            return d.h/2})
            .transition()
            .duration(2000)
            .attr("x2", function (d, i) {
              return d.x })
              .attr("y2", function (d, i) {
                return d.y })

svgCanvas.selectAll('circles')
          .data(nodes)
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
              .on("mouseover", function(d) {
                d3.select(this).style("opacity", .2)
                //  d.previewMP3.loop('true', d.id) -- d.previewMP3.fade(0.0, 0.9, 100)
                d.url.play() //fade might not working!!
              })
              .on('mouseleave', function(d){
                d3.select(this).style("opacity", 1)
                //d.previewMP3.fade(.9, 0.0, 100) //fade might not working!!
                d.url.pause()
              })
              .on('click', function(d, i) {
                d.url.pause()
                freeSoundSimilar(d, i)
              })
              .transition(2000)
                    .attr('r', elementRadius)
                    .attr('cx', function (d, i) {
                      return d.x;
                    })
                    .attr('cy', function (d, i) {
                      return d.y;
                    })

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
