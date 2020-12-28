// TASKS

//Done:


//ToDo:

// Анимация точек



// Строим канвас
function define_variables() {
    maxWidth = 4 * document.documentElement.clientHeight / 3

    figureWidth = document.documentElement.clientWidth > maxWidth ? maxWidth : document.documentElement.clientWidth;
    figureHeight = 3 * figureWidth / 4;

    xSize = 100
    ySize = 75

    x = d3.scaleLinear()
        .domain([0, xSize - 1])
        .range([ 0, figureWidth ]);

    y = d3.scaleLinear()
        .domain([0, ySize - 1])
        .range([0, figureHeight]);

    dot_size = x(1)
    transition_time = 500

    if (typeof(last_slide) == 'undefined')
        last_slide = -1

}

function build_canvas() {
    canvas = d3.select("#canvas")
        .style("width", figureWidth + 'px')
        .append("svg")
        .attr("width", figureWidth)
        .attr("height", figureHeight)
        .append("g")
}

define_variables()
build_canvas()

var slides = {
    slide_0: function () {
    
        if (d3.selectAll(".step0").size() == 0) {
            
            coords = scroller['data']['slide0_points']
    
            for (i = 0; i < coords.length; i++) {
    
                canvas.append("circle")
                    .attr("class", 'step0')
                    .attr("cx", x(coords[i][0]))
                    .attr("cy", y(coords[i][1]))
                    .attr("r", dot_size)
                    .style("fill", "#ef5350")
            }
        
        }

        if (last_slide == 1) {
            start_point = scroller['data']['slide1_start_point']

            d3.selectAll(".step1")
                .attr('visibility', 'hidden')
                .attr("cx", x(start_point[0]))
                .attr("cy", y(start_point[1]))
    
            d3.selectAll(".step0")
                .attr("cy", y(scroller['data']['slide0_points'][0][1]))
        }
    
        last_slide = 0
    
    },

    slide_1: function () {

        if (last_slide == 0) {
            // Сначала перемещаю точку в первом ряду
            d3.selectAll(".step0")
                .transition()
                .attr("cy", y(scroller['data']['slide1_y0']))
                .duration(transition_time)
                .on('end', function() {

                    d3.selectAll(".step1")
                        .attr('visibility', 'visible')
                

                    // Создаю точки второго ряда, если их нет
                    if (d3.selectAll(".step1").size() == 0) {
                        
                        start_point = scroller['data']['slide1_start_point']

                        for (i = 0; i < 2; i++) {
                    
                            canvas.append("circle")
                                .attr("class", 'step1 point' + i)
                                .attr("r", dot_size)
                                .style("fill", "#ef5350")
                                .attr("cx", x(start_point[0]))
                                .attr("cy", y(start_point[1]))
                        }
                    
                    }

                    // Перемещаю точки второго ряда в новые позиции
                    coords = scroller['data']['slide1_points']

                    for (i = 0; i < coords.length; i++) {

                        destination = setter()
                            .attr("cx", x(coords[i][0]))
                            .attr("cy", y(coords[i][1]))
                            .set();

                        d3.selectAll('.step1')
                            .filter(".point" + i)
                            .transition()
                            .duration(transition_time)
                            .call(destination)
                            .on("interrupt",destination);
                            
                    }

                    last_slide = 1
                })
            }
            
        if (last_slide == 2) {
            d3.selectAll(".step2")
                .attr('visibility', 'hidden')

            d3.selectAll(".step0")
                .attr("cy", y(scroller['data']['slide1_y0']))

            d3.selectAll(".step1")
                .attr("cy", y(scroller['data']['slide1_points'][0][1]))

            last_slide = 1
        }
            
        
    },

    slide_2: function () {

        d3.selectAll(".step0")
            .interrupt()

        d3.selectAll(".step1")
            .interrupt()

        if (last_slide == 1) {

            // Сначала перемещаю точку верхнего ряда
            d3.selectAll(".step0")
                .transition()
                .attr("cy", y(scroller['data']['slide2_y0']))
                .duration(transition_time)
                .on('end', function() {
                    
                    points_done = 0

                    // Потом перемещаю точки второго ряда
                    d3.selectAll(".step1")
                    .transition()
                    .attr("cy", y(scroller['data']['slide2_y1']))
                    .duration(transition_time)
                    .on('end', function() {
                        points_done += 1

                        // Проверяю, что все точки предыдущего ряда завершили движение
                        if (points_done == d3.selectAll(".step1").size()) {
                    
                            start_coords = scroller['data']['slide2_start_points']

                            // Генерирую точки третьего ряда, если их нет
                            if (d3.selectAll(".step2").size() == 0) {

                                for (i = 0; i < start_coords.length; i++) {
                                    canvas.append("circle")
                                        .attr("class", 'step2 point' + i)
                                        .attr("r", dot_size)
                                        .style("fill", "#ef5350")
                                }
                            
                            }

                            // Ставлю точки третьего ряда на начальное положение
                            for (i = 0; i < start_coords.length; i++) {
                                d3.selectAll(".step2")
                                    .filter(".point" + i)
                                    .attr('visibility', 'visible')
                                    .attr("cx", x(start_coords[i][0]))
                                    .attr("cy", y(start_coords[i][1]))
                            }

                            // Перемещаю точки на конечное положение
                            coords = scroller['data']['slide2_points']

                            for (i = 0; i < coords.length; i++) {
        
                                destination = setter()
                                    .attr("cx", x(coords[i][0]))
                                    .attr("cy", y(coords[i][1]))
                                    .set();
        
                                d3.selectAll('.step2')
                                    .filter(".point" + i)
                                    .transition()
                                    .duration(transition_time)
                                    .call(destination)
                                    .on("interrupt",destination);
                                
                            }
                        }
        
                    })

                    last_slide = 2
            })
        }
        
    },

    slide_3: function () {
        
    }
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

   step.style("height", 3/2 * figureHeight + "px");
   step_text.style("height", figureHeight/2 + "px");
//    step.style("padding-top", (stepH - figureHeight/2)/2  + "px");

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

    slides['slide_' + actual_index]();
 }

 function setupStickyfill() {
   d3.selectAll(".sticky").each(function() {
     Stickyfill.add(this);
   });
 }

 function init(data) {

    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)

    scroller['data'] = data

    scroller
        .setup({
        step: "#scrolly article .step",
        offset: 1,
        debug: false,
        })
        .onStepEnter(handleStepEnter);

    // setup resize event
    window.addEventListener("resize", handleResize);
 }

// kick things off
d3.json('points.json').then(init)

var t = null;
window.onresize = function(event) {
    if (t!= null) clearTimeout(t);
    t = setTimeout(function() {

        d3.selectAll("svg").remove()

        define_variables()
        handleResize()
        build_canvas()

        for (s=0; s<=actual_index+1; s++) {
            slides['slide_' + s]();
        }

    }, 500);
};

function setter() {

    var s,
        props = [];
  
    function add(type) {
      return function(key,value) {
        props.push({type: type, key: key, value: value});
        return s;
      };
    }
  
    function set() {
  
      return function(selection) {
  
        if (!(selection instanceof d3.selection || selection instanceof d3.transition)) {
            selection  = d3.select(this);
        }
  
        props.forEach(function(prop){
          selection[prop.type](prop.key,prop.value);
        });
  
      };
  
    }
  
    return s = {
      style: add("style"),
      attr: add("attr"),
      set: set
    };
  
  }
  