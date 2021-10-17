!function() {
    const fileOptions = [
        {
            command: "downloadInput()",
            text: "Download input"
        },
        {
            command: "uploadInput()",
            text: "Upload input"
        }
    ];
    
    var fileButtons = d3.select("#topNav")
        .append("div")
            .attr("class", "dropdown");
    fileButtons
        .append("button")
            .attr("class", "dropbtn")
            .text("File");
    fileButtons
        .append("div")
            .attr("class", "dropdown-content")
            .selectAll("button")
            .data(fileOptions)
            .enter().append("button")
                .attr("onclick", d => d.command)
                .text(d => d.text);
}();