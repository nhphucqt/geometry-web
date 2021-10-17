!function() {
    const helpOptions = [
        {
            link: "demos/",
            text: "Demos"
        },
        {
            link: "https://github.com/nhphucqt",
            text: "My Github profile"
        },
        {
            link: "https://github.com/nhphucqt/geometry-web",
            text: "See project on Github"
        }
    ];
    var helpButtons = d3.select("#topNav")
        .append("div")
            .attr("class", "dropdown");
    helpButtons
        .append("button")
            .attr("class", "dropbtn")
            .text("Help");
    helpButtons
        .append("div")
            .attr("class", "dropdown-content")
            .selectAll("a")
            .data(helpOptions)
            .enter().append("a")
                .attr("href", d => d.link)
                .attr("target", "_blank")
                .text(d => d.text);
}();