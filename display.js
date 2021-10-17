// Reference: https://www.d3-graph-gallery.com/graph/interactivity_zoom.html

// init svgDiv's height
let newHeight = document.getElementById("displayColumn").offsetHeight
                - document.getElementById("buttonArea").offsetHeight;
d3.select("#svgDiv")
    .style("height", newHeight+"px");

// set the dimensions and margins of the graph
var margin = {top: 5, right: 10, bottom: 20, left: 50},
    height = document.getElementById("svgDiv").offsetHeight,
    width = document.getElementById("svgDiv").offsetWidth,
    mainWidth = width - margin.left - margin.right,
    mainHeight = height - margin.top - margin.bottom;

const INIT_DATA = {
    "Point": [],
    "Polyline": [],
    "Polygon": [],
    "ConvexHull": [[],[]],
    "GrahamScan": [[],[]],
    "Farthest": [[],[]],
    "Area": [[],[]]
};

var data = JSON.parse(JSON.stringify(INIT_DATA));

// append the SVG object to the body of the page

var realSVG = d3.select("#svgDiv")
    .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("id", "displayArea")
        .attr("width", width)
        .attr("height", height);

var SVG = realSVG
    .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var curDomainX = [0, 10],
    curDomainY = [0, 10];

if (curDomainX[1] - curDomainY[0] < curDomainY[1] - curDomainY[0]) {
    let diff = (curDomainY[1] - curDomainY[0]) - (curDomainX[1] - curDomainX[0]);
    [curDomainX[0], curDomainX[1]] = [curDomainX[0] - Math.floor(diff/2), curDomainX[1] + diff - Math.floor(diff/2)];
}
else {
    let diff = (curDomainX[1] - curDomainX[0]) - (curDomainY[1] - curDomainY[0]);
    [curDomainY[0], curDomainY[1]] = [curDomainY[0] - Math.floor(diff/2), curDomainY[1] + diff - Math.floor(diff/2)];
}

if (mainHeight > mainWidth) {
    let tmp = Math.ceil((curDomainX[1] - curDomainX[0]) * mainHeight / mainWidth - (curDomainY[1] - curDomainY[0]));
    curDomainY[0] -= Math.floor(tmp/2);
    curDomainY[1] += tmp - Math.floor(tmp/2);
}
else {
    let tmp = Math.ceil((curDomainY[1] - curDomainY[0]) * mainWidth / mainHeight - (curDomainX[1] - curDomainX[0]));
    curDomainX[0] -= Math.floor(tmp/2);
    curDomainX[1] += tmp - Math.floor(tmp/2);
}

// Create scale xAxis, yAxis
var x = d3.scaleLinear()
    .domain(curDomainX)
    .range([0, mainWidth]);
var y = d3.scaleLinear()
    .domain(curDomainY)
    .range([mainHeight, 0]);

var tickMode = 1,
    xAxisTicks = [
        {
            "size": 6,
            "width": 1,
            "yLine": 6,
            "yText": 9,
            "lineOpacity": 1
        },
        {
            "size": -mainHeight,
            "width": 0.5,
            "yLine": -mainHeight,
            "yText": 3,
            "lineOpacity": 0.3
        }
    ],
    yAxisTicks = [
        {
            "size": 6,
            "width": 1,
            "xLine": -6,
            "xText": -9,
            "lineOpacity": 1
        },
        {
            "size": -mainWidth,
            "width": 0.5,
            "xLine": mainWidth,
            "xText": -3,
            "lineOpacity": 0.3
        }
    ];

var step = Math.min(y.ticks()[1] - y.ticks()[0], x.ticks()[1] - x.ticks()[0]);

var xAxis = SVG.append("g")
    .attr("transform", "translate(-0.5," + mainHeight + ")")
    .call(d3.axisBottom(x).tickValues(getRange(curDomainX[0], curDomainX[1], step))
        .tickFormat(x => Math.abs(x) > 1e6 ? parseFloat(x.toFixed(9)).toExponential() : parseFloat(x.toFixed(9)))
        .tickSize(xAxisTicks[tickMode].size)
    );
xAxis.selectAll("line")
    .style("stroke-width", xAxisTicks[tickMode].width)
    .style("opacity", xAxisTicks[tickMode].lineOpacity);

var yAxis = SVG.append("g")
    .attr("transform", "translate(0,-0.5)")
    .call(d3.axisLeft(y).tickValues(getRange(curDomainY[0], curDomainY[1], step))
        .tickFormat(y => Math.abs(y) > 1e6 ? parseFloat(y.toFixed(9)).toExponential() : parseFloat(y.toFixed(9)))
        .tickSize(yAxisTicks[tickMode].size)
    );
yAxis.selectAll("line")
    .style("stroke-width", yAxisTicks[tickMode].width)
    .style("opacity", yAxisTicks[tickMode].lineOpacity);

// Add a clipPath: everything out of this area won't be drawn.
var clip = SVG.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
        .attr("width", mainWidth)
        .attr("height", mainHeight)
        .attr("x", 0)
        .attr("y", 0);

// Create the scatter variable: where both the circles and the brush take place
var scatter = SVG.append('g')
    .attr("clip-path", "url(#clip)");

// Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
var zoom = d3.zoom()
    // .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
    .extent([[0, 0], [width, height]])
    .on("zoom", updateChart);
    
    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
var zoomRect = SVG.append("rect")
    .attr("width", mainWidth)
    .attr("height", mainHeight)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(zoom);
// now the user can zoom and it will trigger the function called updateChart

// displayArea
// clip
// zoomRect
// x, y, xAxis, yAxis
// scatter

function getRange(lef, rig, step = 1) {
    a = [];
    for (let i = lef; i < rig+geo.eps; i += step) {
        a.push(i);
    }
    return a;
}

function fixed(x) {
    return Math.abs(x) > 1e6 ? parseFloat(x.toFixed(9)).toExponential() : parseFloat(x.toFixed(9));
}

function getInput() {
    rawData = document.getElementById("inputData").value.split('\n');
    rawData = rawData.map(x => x.split(' ').filter(x => x != '')).filter(x => x.length > 0);
    // console.log(rawData);
    data = JSON.parse(JSON.stringify(INIT_DATA));
    let cur = "", mode = -1;
    rawData.forEach(element => {
        if (data[element[0]] !== undefined) {
            cur = element[0];
            mode = element.length > 1 ? element[1] : -1;
            if (cur != "Point") { // guaranteed cur != -1
                if (cur == "Polyline" || cur == "Polygon") {
                    data[cur].push([]);
                }
                else {
                    data[cur][mode].push([]);
                }
            }
        }
        else {
            if (cur != "Point") {
                if (cur == "Polyline" || cur == "Polygon") {
                    data[cur].at(-1).push(element.map(x => Number(x)));
                    if (mode == 1)
                        data["Point"].push(element.map(x => Number(x)));
                }
                else {
                    data[cur][mode].at(-1).push(element.map(x => Number(x)));
                }
            }
            else {
                data[cur].push(element.map(x => Number(x)));
            }
        }
    });

    for (let i = 0; i < 2; ++i) {
        data["ConvexHull"][i].forEach(function(points) {
            data["Polygon"].push(geo.ConvexHull(points));
            if (i == 1)
                data["Point"] = data["Point"].concat(points);
        });
        data["GrahamScan"][i].forEach(function(points) {
            data["Polygon"].push(geo.GrahamScan(points));
            if (i == 1)
                data["Point"] = data["Point"].concat(points);
        });
        data["Farthest"][i].forEach(function(points) {
            let pairPoint = geo.Farthest(points);
            data["Polyline"].push(pairPoint);
            if (i == 1)
                data["Point"] = data["Point"].concat(points);
            else 
                data["Point"] = data["Point"].concat(pairPoint);
        });
        data["Area"][i].forEach(function(polygon) {
            console.log(geo.Area(polygon));
            if (i == 1)
                data["Polygon"].push(polygon);
        });
    }

    data["Point"] = data["Point"].map(x => new geo.Point(x[0],x[1]));
    data["Polyline"] = data["Polyline"].map(x => new geo.Polyline(x));
    data["Polygon"] = data["Polygon"].map(x => new geo.Polygon(x));

    // console.log(data);
    return data;
}

function resetZoom() {
    // Have no idea about this :>
    // Apply the transform:
    zoomRect.call(zoom.transform, d3.zoomIdentity);
}

function rescaleAxis(newX, xTickValues, newY, yTickValues) {
    xAxis
        .attr("transform", "translate(-0.5," + mainHeight + ")")
        .call(d3.axisBottom(newX).tickValues(xTickValues)
            .tickFormat(x => fixed(x))
            .tickSize(xAxisTicks[tickMode].size)
        );
    xAxis.selectAll("line")
        .style("stroke-width", xAxisTicks[tickMode].width)
        .style("opacity", xAxisTicks[tickMode].lineOpacity);
    xAxis.selectAll("path,line")
        .style("stroke", svgTheme[curTheme].axis);
    xAxis.selectAll("text")
        .style("fill", svgTheme[curTheme].axis);

    yAxis
        .call(d3.axisLeft(newY).tickValues(yTickValues)
            .tickFormat(y => fixed(y))
            .tickSize(yAxisTicks[tickMode].size)
        );
    yAxis.selectAll("line")
        .style("stroke-width", yAxisTicks[tickMode].width)
        .style("opacity", yAxisTicks[tickMode].lineOpacity);
    yAxis.selectAll("path,line")
        .style("stroke", svgTheme[curTheme].axis);
    yAxis.selectAll("text")
        .style("fill", svgTheme[curTheme].axis);
}

function rescatter(newX, newY) {
    scatter
        .selectAll("polygon")
            .attr('points', d => d.points.map(e => newX(e.x) + ',' + newY(e.y)).join(' '));
    scatter
        .selectAll("polyline")
            .attr('points', d => d.points.map(e => newX(e.x) + ',' + newY(e.y)).join(' '));
    scatter
        .selectAll("circle")
            .attr('cx', d => newX(d.x))
            .attr('cy', d => newY(d.y));
}

function getNewTickValues(newX, newY) {
    step = Math.min(newY.ticks()[1] - newY.ticks()[0], newX.ticks()[1] - newX.ticks()[0]);

    var newXTicks = getRange(
        newX.ticks()[0] - Math.floor((newX.ticks()[0] - newX.domain()[0]) / step) * step,
        newX.ticks().at(-1) + Math.floor((newX.domain()[1] - newX.ticks().at(-1)) / step) * step,
        step
    );
    var newYTicks = getRange(
        newY.ticks()[0] - Math.floor((newY.ticks()[0] - newY.domain()[0]) / step) * step,
        newY.ticks().at(-1) + Math.floor((newY.domain()[1] - newY.ticks().at(-1)) / step) * step,
        step
    );
    return [newXTicks, newYTicks];
}

function display(data) {
    var minX = 0, maxX = 10,
        minY = 0, maxY = 10;
    
    function updateMinMaxXY(x, y) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }
    
    data["Point"].forEach(point => 
        updateMinMaxXY(point.x, point.y)
    );
    data["Polyline"].forEach(polyline =>
        polyline.points.forEach(point => 
            updateMinMaxXY(point.x, point.y)
        )
    );
    data["Polygon"].forEach(polygon =>
        polygon.points.forEach(point =>
            updateMinMaxXY(point.x, point.y)
        )
    );
    
    [minX, maxX] = [Math.floor(minX - (maxX-minX) / 100), Math.ceil(maxX + (maxX-minX) / 100)];
    [minY, maxY] = [Math.floor(minY - (maxY-minY) / 100), Math.ceil(maxY + (maxY-minY) / 100)];
    
    if (maxX - minX < maxY - minY) {
        let diff = (maxY - minY) - (maxX - minX);
        [minX, maxX] = [minX - Math.floor(diff/2), maxX + diff - Math.floor(diff/2)];
    }
    else {
        let diff = (maxX - minX) - (maxY - minY);
        [minY, maxY] = [minY - Math.floor(diff/2), maxY + diff - Math.floor(diff/2)];
    }
    
    if (mainHeight > mainWidth) {
        let tmp = Math.ceil((maxX - minX) * mainHeight / mainWidth - (maxY - minY));
        minY -= Math.floor(tmp/2);
        maxY += tmp - Math.floor(tmp/2);
    }
    else {
        let tmp = Math.ceil((maxY - minY) * mainWidth / mainHeight - (maxX - minX));
        minX -= Math.floor(tmp/2);
        maxX += tmp - Math.floor(tmp/2);
    }

    x.domain([minX, maxX]);
    y.domain([minY, maxY]);

    curDomainX = x.domain();
    curDomainY = y.domain();

    var step = Math.min(y.ticks()[1] - y.ticks()[0], x.ticks()[1] - x.ticks()[0]);

    rescaleAxis(x, getRange(minX,maxX,step), y, getRange(minY,maxY,step));

    // Reset scatter
    scatter.selectAll("*").remove();
    // Add shapes
    scatter
        .selectAll("polyline")
        .data(data["Polyline"])
        .enter()
        .append("polyline")
            .attr("points", d => d.points.map(e => x(e.x) + ',' + y(e.y)).join(' '))
            .attr("style", "fill:none;stroke:"+svgTheme[curTheme].polyline+";stroke-width:1");
    scatter
        .selectAll("polygon")
        .data(data["Polygon"])
        .enter()
        .append("polygon")
            .attr("points", d => d.points.map(e => x(e.x) + ',' + y(e.y)).join(' '))
            .attr("style", "fill:none;stroke:"+svgTheme[curTheme].polygon+";stroke-width:1");
    scatter
        .selectAll("circle")
        .data(data["Point"])
        .enter()
        .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 3)
            .attr("fill", svgTheme[curTheme].point);

    resetZoom();
}

// A function that updates the chart when the user zoom and thus new boundaries are available
function updateChart() {
    // console.log("update chart");
    // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3.event.transform.rescaleY(y);

    curDomainX = newX.domain();
    curDomainY = newY.domain();

    var newXTicks, newYTicks;
    [newXTicks, newYTicks] = getNewTickValues(newX, newY);
    rescaleAxis(newX, newXTicks, newY, newYTicks);
    rescatter(newX, newY);
}

new ResizeSensor(jQuery("#displayColumn"), function() {
    // console.log("displayColumn's size changed");
    let newHeight = document.getElementById("displayColumn").offsetHeight
            - document.getElementById("buttonArea").offsetHeight;
    d3.select("#svgDiv")
        .style("height", newHeight+"px");

    height = document.getElementById("svgDiv").offsetHeight,
    width = document.getElementById("svgDiv").offsetWidth,
    mainWidth = width - margin.left - margin.right,
    mainHeight = height - margin.top - margin.bottom;

    xAxisTicks[1].size = -mainHeight;
    xAxisTicks[1].yLine = -mainHeight;
    yAxisTicks[1].size = -mainWidth;
    yAxisTicks[1].xLine = mainWidth;

    // update display area dimension
    d3.select("#displayArea")
        .attr("height", height)
        .attr("width", width);
    clip
        .attr("width", mainWidth)
        .attr("height", mainHeight);
    zoomRect
        .attr("width", mainWidth)
        .attr("height", mainHeight)
    
    // update X, Y scale
    x.domain([curDomainX[0], (curDomainX[1]-curDomainX[0]) * mainWidth / (x.range()[1]-x.range()[0]) + curDomainX[0]]);
    y.domain([curDomainY[0], (curDomainY[1]-curDomainY[0]) * mainHeight / (y.range()[0]-y.range()[1]) + curDomainY[0]]);
    x.range([0, mainWidth]);
    y.range([mainHeight, 0]);

    curDomainX = x.domain();
    curDomainY = y.domain();

    var newXTicks, newYTicks;
    [newXTicks, newYTicks] = getNewTickValues(x, y);
    rescaleAxis(x, newXTicks, y, newYTicks);
    rescatter(x, y);
    resetZoom();
});

function changeGridView() {
    tickMode ^= 1;
    xAxis.selectAll("line")
        .style("stroke-width", xAxisTicks[tickMode].width)
        .style("opacity", xAxisTicks[tickMode].lineOpacity)
        .attr("y2", xAxisTicks[tickMode].yLine);
    xAxis.selectAll("text")
        .attr("y", xAxisTicks[tickMode].yText);
    yAxis.selectAll("line")
        .style("stroke-width", yAxisTicks[tickMode].width)
        .style("opacity", yAxisTicks[tickMode].lineOpacity)
        .attr("x2", yAxisTicks[tickMode].xLine);
    yAxis.selectAll("text")
        .attr("x", yAxisTicks[tickMode].xText);
}

var themeSelect = d3.select("#theme");
function changeTheme(theme) {
    if (typeof(Storage) !== "undefined")
        localStorage.setItem("theme", theme);
    themeSelect
        .attr("href", "color-themes/theme-"+theme+".css");
    curTheme = theme;
    realSVG
        .style("background-color", svgTheme[theme].svg);
    xAxis.selectAll("path,line")
        .style("stroke", svgTheme[theme].axis);
    xAxis.selectAll("text")
        .style("fill", svgTheme[theme].axis);
    yAxis.selectAll("path,line")
        .style("stroke", svgTheme[theme].axis);
    yAxis.selectAll("text")
        .style("fill", svgTheme[theme].axis);
    scatter.selectAll("circle")
        .attr("fill", svgTheme[theme].point);
    scatter.selectAll("polyline")
        .style("stroke", svgTheme[theme].polyline);
    scatter.selectAll("polygon")
        .style("stroke", svgTheme[theme].polygon);
}

changeTheme(curTheme);