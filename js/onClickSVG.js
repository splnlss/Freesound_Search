//onClickSVG
const onClickSVG = (data, clickedSoundID) =>{

    const radius = 200
    const numNodes = 8
    const circleDestinationX = width/2
    const circleDestinationY = height/2
    console.log(soundsGLOBAL)
    svgCanvas = d3.select('main')

    const circleSize = svgCanvas.selectAll('circle')
                  .transition()
                      .duration(500)
                      .attr("r", 30)

    const circleMovement = svgCanvas.select(`#button_${clickedSoundID}`)
                  .transition()
                      .duration(500)
                      .attr("cx", circleDestinationX)
                      .attr("cy", circleDestinationY)

    const createNodes = function (numNodes, radius) {
         let nodes = [],
            angle,
            x,
            y,
            i
         for (i=0; i<numNodes; i++) {
          angle = (i / (numNodes/2)) * Math.PI // Calculate the angle at which the element will be placed.
                                                // For a semicircle, we would use (i / numNodes) * Math.PI.
          x = (radius * Math.cos(angle)) + (width/2) // Calculate the x position of the element.
          y = (radius * Math.sin(angle)) + (width/2) // Calculate the y position of the element.
          nodes.push({'id': i, 'w': width, 'h': width, 'x': x, 'y': y})
         }
         console.log(nodes)
         return nodes
       }

const createElements = function (svgCanvas, nodes, elementRadius) {

 let lines = svgCanvas.selectAll('line')
                   .data(nodes)
                   .enter()
                   .append('line')
                       .style("stroke", "black")  // colour the line
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

 let element = svgCanvas.selectAll('circle')
            .data(nodes)
            .enter().append('circle')
                .attr('r', 1)
                .attr('cx', function (d, i) {
                  return d.w/2;
                })
                .attr('cy', function (d, i) {
                  return d.h/2;
                })
            .transition()
            .duration(2000)
                .attr('r', elementRadius)
                .attr('cx', function (d, i) {
                  return d.x;
                })
                .attr('cy', function (d, i) {
                  return d.y;
                })
console.log('element')
}
 const draw = function () {
   let nodes = createNodes(numNodes, radius);
   // createSvg(radius, function (svg)
   createElements(svgCanvas, nodes, 25);

 }

$(document).ready(function() {
    draw();
    console.log('drawing')
})

}
