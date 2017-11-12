//onClickSVG
const onClickSVG = (data, index) =>{
console.log(`#button_${index}`)
    svgCanvas = d3.select('main')

    const circleSize = svgCanvas.selectAll('circle')
                  .transition()
                      .duration(500)
                      .attr("r", 30)
                    //  .attr("cy", 300)
    const circleMovement = svgCanvas.select(`#button_${index}`)
                  .transition()
                      .duration(500)
                      .attr("cx", 300)
                      .attr("cy", 300)

}
