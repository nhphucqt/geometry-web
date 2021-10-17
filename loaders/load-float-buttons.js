!function() {
    const floatButtons = [
        {
            title: "View all",
            icon: "icons/home-outline.svg",
            command: "display(data)"
        },
        {
            title: "Toggle grid",
            icon: "icons/grid-outline.svg",
            command: "changeGridView()"
        },
        {
            title: "Download SVG",
            icon: "icons/download-outline.svg",
            command: "downloadSVG()"
        }
    ];
    d3.select("#buttonArea")
        .selectAll("button")
        .data(floatButtons)
        .enter().append("button")
            .attr("class", "floatButton")
            .attr("title", d => d.title)
            .attr("onclick", d => d.command)
            .append("ion-icon")
                .attr("size", "small")
                .attr("src", d => d.icon);
}();