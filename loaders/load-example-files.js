!function() {
    const exampleFiles = [
        {
            name: "Points",
            file: "Points",
            icon: "points.svg"
        },
        {
            name: "Polylines",
            file: "Polylines",
            icon: "polyline.svg"
        },
        {
            name: "Polygons",
            file: "Polygons",
            icon: "polygon.svg"
        },
        {
            name: "Rectanges",
            file: "Rects",
            icon: ""
        },
        {
            name: "ConvexHull",
            file: "ConvexHull",
            icon: "convexhull.svg"
        },
        {
            name: "GrahamScan",
            file: "GrahamScan",
            icon: "grahamscan.svg"
        },
        {
            name: "Farthest pair of points",
            file: "Farthest",
            icon: "farthest.svg"
        }
    ];

    var exampleBar = d3.select("#exampleBar");
    exampleBar.append("div")
        .attr("class", "closeBlock")
        .append("button")
            .attr("class", "closeButton")
            .attr("onclick", "closeExampleBar()")
            .append("ion-icon")
                .attr("src", "icons/close-outline.svg");
    exampleFiles.forEach(data => {
        var button = exampleBar.append("button");
        button.append("ion-icon")
            .attr("size", "large")
            .attr("src", "icons/"+data.icon);
        button
            .attr("onclick", `runExample('examples/${data.file}')`)
            .append("span")
                .style("margin-left", "10px")
                .text(data.name);
    });
}();