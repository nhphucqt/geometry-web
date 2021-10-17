!function() {
    const themeOptions = [
        ["white", "White"],
        ["eyewhite", "Eyewhite"],
        ["water", "Water"],
        ["antiquewhite", "Antiquewhite"],
        ["darksky", "Dark sky"]
    ];
    var themeButtons = d3.select("#topNav")
        .append("div")
            .attr("class", "dropdown");
    themeButtons
        .append("button")
            .attr("class", "dropbtn")
            .text("Themes");
    themeButtons
        .append("div")
            .attr("class", "dropdown-content")
            .selectAll("button")
            .data(themeOptions)
            .enter().append("button")
                .attr("onclick", d => `changeTheme('${d[0]}')`)
                .text(d => d[1]);
}();