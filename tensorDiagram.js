// r2d3 supports:
// svg, data

console.log('data is:', data);


// usuned, just an example
const tensors = [
  { x: 0, y: 0, name: "x" },
  { x: 1, y: 0, name: "A" },
  { x: 2, y: 0, name: "B", color: '#000' },
];

const contractions = [
  { source: 0, target: tensors[1] },
  { source: tensors[1], target: tensors[2] },
  { source: tensors[1], target: "down", name: "i" },
  { source: tensors[2], target: "down", name: "j" },
  { source: tensors[2], target: "right", name: "k" },
];

// drawDiagram(svg, tensors, contractions)
drawDiagram(svg, data.tensors, data.contractions)

function drawDiagram(svg, tensors, contractions) {

  // add source/target by id or name
  contractions.forEach((d) => {
    if (typeof d.source === "number") {
      d.source = tensors[d.source]
    }
    if (typeof d.target === "number") {
      d.target = tensors[d.target]
    }
  }) 

  const shifts = {
    up: [0, -0.75],
    down: [0, 0.75],
    left: [-0.75, 0],
    right: [0.75, 0],
  };

  contractions.forEach((d) => {
    if (typeof d.target === "string") {
      const dv = shifts[d.target];
      d.target = {
        x: d.source.x + dv[0],
        y: d.source.y + dv[1],
      };
      d.labelPosition = {
        x: d.source.x + 1.4 * dv[0],
        y: d.source.y + 1.4 * dv[1],
      };
    }
  });

  const xScale = d3.scaleLinear().domain([0, 8]).range([50, 450]);

  const yScale = d3.scaleLinear().domain([0, 8]).range([50, 450]);

  const lineFunction = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const colorScale = d3
    .scaleOrdinal()
    .range(["#763E9B", "#00882B", "#C82505", "#EEEEEE", "#0165C0"]);

  svg
    .selectAll(".contraction")
    .data(contractions)
    .enter()
    .append("path")
    .attr("class", "contraction")
    .attr("d", (d) => lineFunction([d.source, d.target]));

  svg
    .selectAll(".tensor")
    .data(tensors)
    .enter()
    .append("circle")
    .attr("class", "tensor")
    .attr("r", 10)
    .attr("cx", (d) => xScale(d.x))
    .attr("cy", (d) => yScale(d.y))
    .style("fill", (d) => d.color || colorScale(d.name));

  svg
    .selectAll(".tensor-label")
    .data(tensors)
    .enter()
    .append("text")
    .attr("class", "tensor-label")
    .attr("x", (d) => xScale(d.x))
    .attr("y", (d) => yScale(d.y - 0.4))
    .text((d) => d.name);

  svg
    .selectAll(".contraction-label")
    .data(contractions.filter((d) => !!d.labelPosition))
    .enter()
    .append("text")
    .attr("class", "contraction-label")
    .attr("x", (d) => xScale(d.labelPosition.x))
    .attr("y", (d) => yScale(d.labelPosition.y))
    .text((d) => d.name);
}