!function() {
    d3.select("#topNav")
        .append("button")
            .attr("title", "F9")
            .attr("onclick", "display(getInput())")
            .text("Draw");
}();