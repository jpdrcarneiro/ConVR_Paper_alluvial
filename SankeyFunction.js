/**
 * Created by MariaPC on 12/6/2016.
 */
function generateSankey (filePath, divName, envNum){
    //set width and height

    var svgId = "svg" +divName;
    divName = "#" + divName;
    var units = "Widgets";

    var CalcHeight = ($(window).height()/2)*0.70;
    // console.log(CalcHeight);

    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = ($(window).width()/3)*0.9 - margin.left - margin.right,
        height = CalcHeight;
    // console.log(width, height);

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " Participants"; },
        color = d3.scale.category20();

// append the svg canvas to the page
//     console.log(d3.select(divName));
    var svg = d3.select(divName).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", svgId)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

// load the data
    d3.json(filePath, function(error, graph) {
        // console.log(filePath);

        var nodeMap = {};
        graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });
        graph.links = graph.links.map(function(x) {
            return {
                source: nodeMap[x.source],
                target: nodeMap[x.target],
                fillColor: x.fillColor,
                nodeColor: x.nodeColor,
                value: x.value
            };
        });

        // console.log(nodeMap);
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32);


// add in the links
        var link = svg.append("g").selectAll(".link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke", function (d) {return d.fillColor})
            //.style("fill", function (d) {return d.fillColor})
            .style("stroke-width", function(d) { return Math.max(1, d.dy)})
            .sort(function(a, b) { return b.dy - a.dy;});

// add the link titles
        link.append("title")
            .text(function(d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + format(d.value); });

// add in the nodes
        var node = svg.append("g").selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("fill", function(d){
                // console.log(d.nodeColor);
                return d.nodeColor;
            })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on("dragstart", function() {
                    this.parentNode.appendChild(this); })
                .on("drag", dragmove));

// add the rectangles for the nodes
        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function (d){
                return d.nodeColor;
            })
            .style("stroke", "black")
            .append("title")
            .text(function(d) {
                return d.name + "\n" + format(d.value); });

// add in the title for the nodes
        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .attr("fill", "black")
            .filter(function(d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");


        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + (
                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);

        }


    });

//adding names to columns
    var colLabels = ["Env 0", envNum, "Change"];
    svgId = "#" + svgId;
    var svgAlt = svgId + "2";

    // console.log($(svgId).height());

    var svg2 = d3.select(divName)
        .append("svg")
        .attr("width", $(svgId).width())
        .attr("height", 20)
        .attr("id", svgAlt);

    svg2.selectAll("text")
        .data(colLabels).enter()
        .append("text")
        .text(function(d){
            // console.log(d);
            return d;
        })
        .attr("x", function (d,i){
            console.log($(svgId).width());
            if (i==0){
                return (($(svgId).width()))*(i/2);
            } else if (i == 1) {
                return (($(svgId).width()))*(i/2)-(40.91/2);
            } else {
               return (($(svgId).width()))*(i/2) - 56;
            }

        })
        .attr("y", 13)
        .attr("font-size", "16px")
        // .attr("font-family", "sens-serif")
        .attr("text-anchor", "center");

}