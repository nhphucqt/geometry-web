const themeOptions = [
    ["white", "White"],
    ["eyewhite", "Eyewhite"],
    ["water", "Water"],
    ["antiquewhite", "Antiquewhite"],
    ["darksky", "Dark sky"]
];

d3.select("#themeButtons")
    .selectAll("button")
    .data(themeOptions)
    .enter().append("button")
        .attr("onclick", function(d) { return `changeTheme('${d[0]}')`; })
        .text(function(d) { return d[1]; });
