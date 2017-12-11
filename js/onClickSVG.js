//onClickSVG
const onClickSVG = (data, clickedSound) =>{


  const mobile = window.innerWidth < 640
  const width = mobile ? window.innerWidth : WIDTH
  const height = mobile ? window.innerHeight : HEIGHT
  // const height = width*.75
  //const offset = width/6
  const radius = mobile ? width*.35 : width/4
  const numNodes = 8
  const circleDestinationX = width/2
  const circleDestinationY = height/2

  const svgCanvas = d3.select('main').select('svg')

  svgCanvas.selectAll('circle')
  .transition()
  .duration(200)
  .attr("r", (radius/4 -10))

  svgCanvas.select(`#button_${clickedSound.id}`)
  .transition()
  .duration(200)
  .attr("r", (radius/4 + 10))
  .attr("cx", circleDestinationX)
  .attr("cy", circleDestinationY)
  .on('end', function(){
    const clickedCircle = this

    d3.selectAll('svg > *').each(

      function(d,i) {
         d3.selectAll(`#button_${d.id}`).remove()
         d3.selectAll('line').remove()
      })
      previousClickedSound = clickedSound.id
      let nodes = createNodes(numNodes, radius, data, clickedSound,width, height)
      createElements(svgCanvas, nodes, 25, data, clickedSound, width, height)
    })
  }

  const createNodes = function (numNodes, radius, data, clickedSound, width, height) {
    let nodes = [],
    angle,
    x,
    y,
    i
    nodes.push({'x': (width/2), 'y': (height/2), 'id':data[0].id, 'name': data[0].name, 'user': data[0].user, 'color':data[0].color, 'url': data[0].previewMP3, 'parent':clickedSound.parent }, )
    for (i=1; i<=numNodes; i++) {
      angle = ((i - 1) / (numNodes/2)) * Math.PI // Calculate the angle at which the element will be placed.
      x1 = (40 * Math.cos(angle)) + (width/2) // Calculate the x position of the element - radius of circle.
      y1 = (40 * Math.sin(angle)) + (height/2)
      x2 = ((radius-30) * Math.cos(angle)) + (width/2) // destination point for spoke
      y2 = ((radius-30) * Math.sin(angle)) + (height/2) // destination point for spoke
      x = ((radius) * Math.cos(angle)) + (width/2) // Calculate the x position of circle.
      y = ((radius) * Math.sin(angle)) + (height/2) // Calculate the y position of circle.
      console.log(radius)
      nodes.push({'w': x1, 'h': y1, 'x': x, 'y': y,'x2': x2, 'y2': y2, 'id':data[i].id, 'name':data[i].name, 'user':data[i].user, 'color':data[i].color,
      'url':data[i].previewMP3,
      'parent':clickedSound.parent }, )
    }
    return nodes
  }

const createElements = function (svgCanvas, nodes, elementRadius, data, clickedSound, width, height) {

    svgCanvas.selectAll('line')
    .data(nodes.slice(1))
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

    svgCanvas.selectAll('circle')
                  .data(nodes)
                  .enter()
                  .append('circle')
                  .attr('r', function (d, i) { return (i === 0) ? 40 : 1})
                  .attr('cx', function (d, i) {
                    return width/2;
                  })
                  .attr('cy', function (d, i) {
                    return height/2;
                  })
                  .attr("id",  function (d,i) { return `button_${d.id}`; })
                  .style("fill", function (d, i) {
                          return d.color}) //function (d){return d.color})
                    .on("mouseenter", function(d) {
                      d3.select(this).style("opacity", .2)
                      displayLink(d)
                        d.url.play()
                    })
                    .on("touchstart", function(d) {
                      d3.select(this).style("opacity", .2)
                      displayLink(d)
                      d.url.play()
                    })
                    .on('mouseout', function(d){
                      d3.select(this).style("opacity", 1)
                        d.url.pause()
                    })
                    .on('touchend', function(d){
                      d3.select(this).style("opacity", 1)
                      d.url.pause()
                      console.log('Touch End')
                    })
                    .on('touchcancel', function(d){
                      d3.select(this).style("opacity", 1)
                      d.url.pause()
                      console.log('Touch Cancel')
                    })
                    .on('click', function(d, i) {
                      d.url.pause()
                      if(i===0){
                      }else{
                      freeSoundSimilar(d, i)
                    }
                  })
                  .transition(500)
                          .attr('r', function (d, i) { return (i === 0) ? 40 : 30})//elementRadius)
                          .attr('cx', function (d, i) {
                            return d.x;
                          })
                          .attr('cy', function (d, i) {
                            return d.y;
                          })
                        }
