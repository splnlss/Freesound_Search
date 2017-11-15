//onClickSVG
const onClickSVG = (data, clickedSoundID) =>{

  const radius = 200
  const numNodes = 8
  const circleDestinationX = WIDTH/2
  const circleDestinationY = HEIGHT/2

  const svgCanvas = d3.select('main').select('svg')

  svgCanvas.selectAll('circle')
  .transition()
  .duration(500)
  .attr("r", 30)

  svgCanvas.select(`#button_${clickedSoundID}`)
  .transition()
  .duration(500)
  .attr("cx", circleDestinationX)
  .attr("cy", circleDestinationY)

  .on('end', function(){
    let nodes = createNodes(numNodes, radius, data);
    createElements(svgCanvas, nodes, 25, data, clickedSoundID);
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

const createElements = function (svgCanvas, nodes, elementRadius, data, clickedSoundID) {
  console.log(nodes)
  // svgCanvas.selectAll('line')
  //         .data(data)
  //         .append('line')
  //             .style("stroke", "blue") //function (d){return d.color})

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

svgCanvas.selectAll('circles') //(`#button_${clickedSoundID}`)
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
                console.log(d.url.play())
              })
              .on('mouseleave', function(d){
                d3.select(this).style("opacity", 1)
                //d.previewMP3.fade(.9, 0.0, 100) //fade might not working!!
                d.url.pause()
              })
              .on('click', function(d, i) {
                d.url.pause()
                freeSoundSimilar(d.id, i)
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

// svgCanvas.selectAll('circles')//(`#button_${clickedSoundID}`)
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
