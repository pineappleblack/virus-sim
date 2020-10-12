// TASKS

//Done:

//ToDo:
// Сделать код более понятным
// Точное соответствие сценарию

// Норм цвета
// Норм иконки
// Анимация


// Строим канвас
function define_styles() {
    maxWidth = 4 * document.documentElement.clientHeight / 3

    figureWidth = document.documentElement.clientWidth > maxWidth ? maxWidth : document.documentElement.clientWidth;
    figureHeight = 3 * figureWidth / 4;

    x = d3.scaleLinear()
    .domain([0, 99])
    .range([ 0, figureWidth ]);

    y = d3.scaleLinear()
        .domain([0, 99])
        .range([ figureHeight, 0]);

    circleRadius = figureHeight / 50
}

function build_canvas() {
    canvas = d3.select("#canvas")
        .style("width", figureWidth + 'px')
        .append("svg")
        .attr("width", figureWidth)
        .attr("height", figureHeight)
        .append("g")
}

define_styles()
build_canvas()

// План первой больницы
function hospital_1() {

    d3.xml("https://raw.githubusercontent.com/pineappleblack/virus-sim/master/hospital.svg")
    .then(data => {
        canvas.node()
        .append(data.documentElement)

        canvas.select("svg").attr('id', 'hospital1')
    });
}

// Первые точки
function scatter() {

    d3.json("https://raw.githubusercontent.com/pineappleblack/virus-sim/master/points_1.json")
    .then(function(data) {
        trueData = data

        circle = canvas.append('g')
            .attr("class", 'graph1')
            .selectAll()
            .data(trueData)
            .enter()
            .append("g")
            .attr("transform", function (d) { return 'translate(' + x(d.x) + ', ' + y(d.y) + ')'; } ) 
            .attr("data-role", function (d) { return d.role; } )
            .append("circle")
            .attr("r", circleRadius)
            .style("fill", "#7579e7")

        doctors = d3.selectAll("[data-role=doctor]")

        doctors
            .append('image')
            .attr("xlink:href", "https://raw.githubusercontent.com/pineappleblack/virus-sim/master/hat.png")
            .attr("width", 2*circleRadius)
            .attr("height", 2*circleRadius)
            .attr("transform", function (d) { return 'translate(' + -circleRadius + ', ' + -2 * circleRadius + ')'; } ) 
    })
    .catch(function(error) {
    });

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
    .append("g")
    .attr("transform", function (d) { return 'translate(' + x(d.x) + ', ' + y(d.y) + ')'; } ) 
    .append("circle")
    .attr("r", circleRadius)
    .style("fill", "red")
}

function scatter3() {

    d3.json("https://raw.githubusercontent.com/pineappleblack/virus-sim/master/points_2.json")
    .then(function(data) {
        second_hospital_data = data

        circle3 = canvas.append('g')
          .attr("class", 'graph3')
          .selectAll()
          .data(second_hospital_data)
          .enter()
          .append("g")
          .attr("transform", function (d) { return 'translate(' + x(d.x) + ', ' + y(d.y) + ')'; } ) 
          .attr("data-role", function (d) { return d.role; } )
          .append("circle")
          .attr("r", circleRadius)
          .style("fill", "yellow")

          doctors = d3.selectAll("[data-role=doctor]")

          doctors
              .append('image')
              .attr("xlink:href", "https://raw.githubusercontent.com/pineappleblack/virus-sim/master/hat.png")
              .attr("width", 2*circleRadius)
              .attr("height", 2*circleRadius)
              .attr("transform", function (d) { return 'translate(' + -circleRadius + ', ' + -2 * circleRadius + ')'; } ) 
    })

    .catch(function(error) {
    });

  
}

// Функция перемещения
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

function masks() {

    masksGiven = true

    dots = d3.selectAll(".graph1 g, .graph2 g")

    dots
        .append('image')
        .attr("xlink:href", "https://raw.githubusercontent.com/pineappleblack/virus-sim/master/mask.png")
        .attr("width", 2*circleRadius)
        .attr("height", 2*circleRadius)
        .attr("transform", function (d) { return 'translate(' + -circleRadius + ', ' + -circleRadius/2 + ')'; } ) 
        .attr("class", 'mask')
}

// ==============================

 var main = d3.select("main");
 var scrolly = main.select("#scrolly");
 var figure = scrolly.select("figure");
 var article = scrolly.select("article");
 var step = article.selectAll(".step");
 var step_text = step.selectAll(".step_text");

 // initialize the scrollama
 var scroller = scrollama();

 // generic window resize listener event
 function handleResize() {
   // 1. update height of step elements
   var stepH = Math.floor(document.documentElement.clientHeight * 1.5);

   step.style("height", stepH + "px");
   step_text.style("height", figureHeight/2 + "px");
   step.style("padding-top", (stepH - figureHeight/2)/2  + "px");

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
    // response = { element, direction, index }
    actual_index = response.index

    actions(actual_index)
 }

 function actions(index) {

    if (index == 0) {
        hospital_1()

        graph1 = d3.select(".graph1")
        if (!graph1.empty()) {
        graph1
            .attr('visibility', 'hidden')
        }
    }

    if (index == 1) {
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

    if (index == 2) {
        graph2 = d3.select(".graph2")
        if (!graph2.empty()) {
          graph2
            .attr('visibility', 'visible')
        } else {
          scatter2();
        }

        if (!graph1.empty()) {
            graph1
                .style("fill", "#7579e7")
        }
    }

    if (index == 3) {
        graph1
            .style("fill", "red")

        if (typeof masksGiven !== 'undefined') {   
            d3.selectAll('.mask')
                .attr('visibility', 'hidden')
        }
    }

    if (index == 4) {
       
        graph12 = d3.selectAll(".graph1, .graph2")
        graph12
            .attr('visibility', 'visible')

        if (typeof masksGiven == 'undefined') {  
            masks()
        } else {
            d3.selectAll('.mask')
                .attr('visibility', 'visible')
        }

        graph3 = d3.select(".graph3")
        if (!graph3.empty()) {
        graph3
            .attr('visibility', 'hidden')
        }
    }

    if (index == 5) {
        graph12 = d3.selectAll(".graph1, .graph2, .mask")
        graph12
            .attr('visibility', 'hidden')

        graph3 = d3.select(".graph3")
        if (!graph3.empty()) {
          graph3
            .attr('visibility', 'visible')
        } else {
          scatter3();
        }
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

var t = null;
window.onresize = function(event) {
    if (t!= null) clearTimeout(t);
    t = setTimeout(function() {

        d3.selectAll("svg").remove()
        masksGiven = undefined

        define_styles()
        handleResize()
        build_canvas()

        if (actual_index != 'undefined') {
            for (var i=0; i<actual_index+1; i++) {
                actions(i)
            }
        }

    }, 500);
};