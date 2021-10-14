function downloadSVG() {
    let link = document.createElement('a');
    link.download = 'geometry.svg';
    let blob = new Blob([document.getElementById("displayArea").outerHTML], {type: 'text/plain'});
    link.href = URL.createObjectURL(blob);
    console.log(link.href);
    link.click();
    URL.revokeObjectURL(link.href);
}

var toggleButtonValue = 0;
var toggleButtonSelect = d3.select("#toggleButton").select("ion-icon");
var inputColumnSelect = d3.select("#inputColumn");
var displayColumnSelect = d3.select("#displayColumn");
function toggleInputArea() {
    toggleButtonValue ^= 1;
    if (toggleButtonValue) {
        toggleButtonSelect
            .attr("src", "icons/caret-forward-outline.svg");
    }
    else {
        toggleButtonSelect
            .attr("src", "icons/caret-back-outline.svg");
    }
    if (toggleButtonValue) {
        inputColumnSelect
            .style("display", "none");
        displayColumnSelect
            .style("width", "100%");
    }
    else {
        inputColumnSelect
            .style("display", "unset");
        displayColumnSelect
            .style("width", "85%");
    }
}

// Shortcut keys
Mousetrap.bind('f9', function() {display(getInput());});