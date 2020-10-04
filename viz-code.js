// TASKS

//Done:
// Сделать канвас адаптивным
// Кривое наложение полоски скролла
// Убрать лишние стили
// Виз по центру экрана (сейчас он вылезает)
// Максимальный размер по ширине

//ToDo:
// Ресайз виза
// Сделать код более понятным
// Поделить точки на врачей и пациентов
// Покраснение 90% точек (а не всех)
// Красивые иконки масок
// Нормальные блоки с текстом
// Размер блоков с текстом
// Расположение врачей


// set the dimensions and margins of the graph
maxWidth = 4 * document.documentElement.clientHeight / 3

figureWidth = document.documentElement.clientWidth > maxWidth ? maxWidth : document.documentElement.clientWidth;
figureHeight = 3 * figureWidth / 4;

d3.select("#canvas")
    .style('width', figureWidth + 'px')

// append the svg object to the body of the page
var canvas = d3.select("#canvas")
.append("svg")
.attr("width", figureWidth)
.attr("height", figureHeight)
.append("g")

function hospital_1() {

    d3.xml("https://raw.githubusercontent.com/pineappleblack/virus-sim/master/hospital.svg")
    .then(data => {
        canvas.node()
        .append(data.documentElement)

        canvas.select("svg").attr('id', 'hospital1')
    });
}

function scatter() {

    trueData = []

    for (var i = 0; i < 100; i+=3) {
        curPoint = {}
        curPoint['x'] = Math.random() * Math.floor(90)
        curPoint['y'] = Math.random() * Math.floor(90)
        curPoint['role'] = i%3?'doctor':'patient'
        trueData.push(curPoint);
    }

    // Add X axis
    x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, figureWidth ]);

    // Add Y axis
    y = d3.scaleLinear()
    .domain([0, 100])
    .range([ figureHeight, 0]);

    n = 0;

    // Add dots
    circle = canvas.append('g')
    .attr("class", 'graph1')
    .selectAll("dot")
    .data(trueData)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.x); } )
    .attr("cy", function (d) { return y(d.y); } )
    .attr("r", 10)
    .style("fill", "#69b3a2")
    .attr("data-role", function (d) { return d.role; } )

    // transitioning();
}

function scatter2() {
    bad_pat_data = []

    for (var i = 0; i < 2; i+=1) {
        curPoint = {}
        curPoint['x'] = Math.random() * Math.floor(90)
        curPoint['y'] = Math.random() * Math.floor(90)
        bad_pat_data.push(curPoint);
      }

    circle2 = canvas.append('g')
    .attr("class", 'graph2')
    .selectAll("dot")
    .data(bad_pat_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.x); } )
    .attr("cy", function (d) { return y(d.y); } )
    .attr("r", 10)
    .style("fill", "red")
}

function transitioning() {
    n += 1
    if (n>6000) return

    const t = d3.transition().duration(700).ease(d3.easeCubic)

    circle
        .transition(t)
        // .attr("cx", function (d) { return x(d.x-10); } 
        .attr("cx", function (d) { rn = Math.floor(Math.random() * Math.floor(3)) - 1; d.x = d.x - rn*10; return x(d.x) } )
        .attr("cy", function (d) { rn = Math.floor(Math.random() * Math.floor(3)) - 1; d.y = d.y - rn*10; return y(d.y) } )
        // .on("end", transitioning);
}

// ==============================


 // using d3 for convenience
 var main = d3.select("main");
 var scrolly = main.select("#scrolly");
 var figure = scrolly.select("figure");
 var article = scrolly.select("article");
 var step = article.selectAll(".step");

 // initialize the scrollama
 var scroller = scrollama();

 // generic window resize listener event
 function handleResize() {
   // 1. update height of step elements
   var stepH = Math.floor(document.documentElement.clientWidth * 0.75);
   step.style("height", stepH + "px");

   var figureMarginTop = (window.innerHeight - figureHeight) / 2;
   if (figureMarginTop < 0)
    figureMarginTop = 0
   
   
   figure
     .style("height", figureHeight + "px")
     .style("top", figureMarginTop  + "px");


   // 3. tell scrollama to update new element dimensions
   scroller.resize();
 }

 // scrollama event handlers
 function handleStepEnter(response) {
    console.log(response);
    // response = { element, direction, index }

    // add color to current step only
    step.classed("is-active", function(d, i) {
        return i === response.index;
    });

    console.log(response.index)

    if (response.index == 0) {
        hospital_1()

        graph1 = d3.select(".graph1")
        if (!graph1.empty()) {
        graph1
            .attr('visibility', 'hidden')
        }
    }

    if (response.index == 1) {
        graph1 = d3.select(".graph1")
        if (!graph1.empty()) {
            graph1
            .attr('visibility', 'visible')
        } else {
            scatter();
        }

        graph2 = d3.select(".graph2")
        if (!graph2.empty()) {
        graph2
            .attr('visibility', 'hidden')
        }
    }

    if (response.index == 2) {
        graph2 = d3.select(".graph2")
        if (!graph2.empty()) {
          graph2
            .attr('visibility', 'visible')
        } else {
          scatter2();
        }

        if (!circle.empty()) {
            circle
                .style("fill", "#69b3a2")
        }
    }

    if (response.index == 3) {
        circle
            .style("fill", "red")
    }
 }

 function setupStickyfill() {
   d3.selectAll(".sticky").each(function() {
     Stickyfill.add(this);
   });
 }

 function init() {
   setupStickyfill();

   // 1. force a resize on load to ensure proper dimensions are sent to scrollama
   handleResize();

   // 2. setup the scroller passing options
   // 		this will also initialize trigger observations
   // 3. bind scrollama event handlers (this can be chained like below)
   scroller
     .setup({
       step: "#scrolly article .step",
       offset: 0.33,
       debug: false
     })
     .onStepEnter(handleStepEnter);

   // setup resize event
   window.addEventListener("resize", handleResize);
 }

 // kick things off
 init();
