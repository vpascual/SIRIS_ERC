'use strict';

angular.module('ercApp')
  .controller('KeywordsCtrl', function ($scope, data) {
    // console.log(data.panel)
    var stopWords = ['project', 'research', 'more', 'such', 'both', 'under',"i","me","my","myself","we","us","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","whose","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","will","would","should","can","could","ought","i'm","you're","he's","she's","it's","we're","they're","i've","you've","we've","they've","i'd","you'd","he'd","she'd","we'd","they'd","i'll","you'll","he'll","she'll","we'll","they'll","isn't","aren't","wasn't","weren't","hasn't","haven't","hadn't","doesn't","don't","didn't","won't","wouldn't","shan't","shouldn't","can't","cannot","couldn't","mustn't","let's","that's","who's","what's","here's","there's","when's","where's","why's","how's","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","upon","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","say","says","said","shall"];
    var groupedData = {};
    var maxYearlyFreq = -1;    
    var categories = ['SH1', 'SH2', 'SH3', 'SH4', 'SH5', 'SH6'];
    $scope.chartdata = {};

    data.forEach(function(d) {
      // ignore stopwords
      if ($.inArray(d.Keywords, stopWords) != -1)
        return;

      // create groupedData data structure
      var dictKey = d.Keywords + '_' + d.panel;      
      var year = d['Project code '].substr(0,4);      
      if (!groupedData[dictKey]) {        
        var obj = {};
        obj.Keywords = d.Keywords;
        obj.projects = [];
        obj.projects.push(d['Project code ']);
        obj.freq = +d.freq;
        obj.panel = d.panel;
        obj.years = {};
        
        for (var i = 2008; i<=2012; i++) {
          obj.years["" + i] = {};
          obj.years["" + i].freq = 0;
          obj.years["" + i].name = "" + i;  
        }        

        obj.years[year].freq = +d.freq;
        groupedData[dictKey] = obj;
      } else {
        groupedData[dictKey].freq += +d.freq;
        groupedData[dictKey].projects.push(d['Project code '])
        if (!groupedData[dictKey].years[year]) {
          groupedData[dictKey].years[year].freq = +d.freq;
        } else {
          groupedData[dictKey].years[year].freq += +d.freq;
        }
      }

      maxYearlyFreq = Math.max(groupedData[dictKey].years[year].freq, maxYearlyFreq);
    })

    $scope.maxYearlyFreq = maxYearlyFreq;
    console.log("$scope.maxYearlyFreq: " + maxYearlyFreq);

    // console.log(groupedData);
    // console.log(wordsPerYear);

    data = d3.values(groupedData)
    console.log(data)

    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };

    // $('circle').qtip({ // Grab some elements to apply the tooltip to
    //   content: {
    //     text: 'My common piece of text here'
    //   }
    // })

    var width = 1000,
        height = 700;
    

    var freq_threshold = 10;
    var fill = d3.scale.category10()
                .domain(categories),
        radiusScale = d3.scale.sqrt()
                        .domain([freq_threshold, d3.max(data, function(d) {return d.freq;})])
                        .range([10, 30]);
    var textSize = d3.scale.linear()
                  .domain([freq_threshold, d3.max(data, function(d) {return d.freq;})])
                  .range([10, 30]);

    var nodes = data.filter(function(d) {
          return d.freq > freq_threshold;
        }),
        // foci = [{x: 150, y: 150}, {x: 350, y: 250}, {x: 700, y: 400}];
        foci = {
          "SH1":{x: width/4 + 50, y: height/2 - 50},
          "SH2":{x: width/4 * 2, y: height/2 - 50},
          "SH3":{x: width/4 * 3 -50, y: height/2 - 50},
          "SH4":{x: width/4 + 50, y: height - height/2 + 50},
          "SH5":{x: width/4 * 2, y: height - height/2 + 50},
          "SH6":{x: width/4 * 3 - 50, y: height - height/2 + 50}
        };

    var svg = d3.select("#vis").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(500, 10)");

    var force = d3.layout.force()
        .nodes(nodes)
        .links([])
        .gravity(0)
        .size([width, height])
        .charge(-30)
        .on("tick", tick);

    var nodeItems = svg.selectAll(".keyword")
        .data(nodes)
        .enter()
        // .append("class", "node")
        .append("g")
          .attr("class", "keyword")
          .on("mouseover", onMouseOver)          
          .on("mouseout", onMouseOut)
          .on("click", onClick)
          .on("mousemove", onMouseMove)
          .style("z-index", 10)
          .call(force.drag);

    // nodeItems
    //     .append("circle")        
    //       // .attr("cx", function(d) {
    //       //   return ~~(Math.random() * width)
    //       // })
    //       // .attr("cy", function(d) {
    //       //   return ~~(Math.random() * height)
    //       // })
    //       .attr("r", function(d) {
    //         var radius = radiusScale(d.freq);
    //         d.radius = radius;
    //         return radius;
    //       })
    //       .style("fill", function(d) { return fill(d.panel); })
    //       .style("stroke", function(d) { return d3.rgb(fill(d.panel)).darker(2); });

    nodeItems
        // .append("div")
        .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .text(function(d) {
            return d.Keywords;
          })
          .style("font-size", function(d) {           
            // console.log(this.getComputedTextLength())
            // console.log(Math.min(2 * d.radius, 40 / this.getComputedTextLength()) + "px")
            // return Math.min(2 * d.radius, 400 / this.getComputedTextLength()) + "px"; 
            return textSize(d.freq) + "px";
          })
          .style("fill", function(d) { return fill(d.panel); })
        // .style("stroke", function(d) { return d3.rgb(fill(d.panel)).darker(2); });      
        
       // .style("font-size", "10px");

    // svg.selectAll(".bgText")
    //   .data(categories)
    //   .enter()
    //   .append("text")
    //     .attr("x", function(d, i) {
    //       if (i == 0 || i == 3)
    //         return foci[d].x - 50;
    //       else if (i == 1 || i == 4)
    //         return foci[d].x + 20;
    //       else
    //         return foci[d].x + 90;
    //     })
    //     .attr("y", function(d, i) {
    //        if (i < 3)
    //         return foci[d].y - 70;
    //       else
    //         return foci[d].y + 100;
          
    //     })
    //     .attr("text-anchor", "middle")
    //     .style("z-index", -100)
    //     // .attr("stroke", "gray")
    //     .style("opacity", 0.1)
    //     .style("font-size", "100px")
    //     .text(function(d) {
    //       return d;
    //     });

    // svg.selectAll(".foci_centers")
    //   .data(categories)
    //   .enter()
    //   .append("circle")
    //     .attr("cx", function(d) {
    //       return foci[d].x;
    //     })
    //     .attr("cy", function(d) {
    //       return foci[d].y;
    //     })
    //     .attr("r", 5)
    //     .style("fill", "black")
          

    function tick(e) {
      // console.log("tick")
      var k = .1 * e.alpha;

      // Push nodes toward their designated focus.
      nodeItems.each(function(o, i) {
        o.y += (foci[o.panel].y - o.y) * k;
        o.x += (foci[o.panel].x - o.x) * k;
      })
      //.each(collide(0.5));


      nodeItems.attr("transform", function(d) { 
        return 'translate(' + [d.x, d.y] + ')'; 
      });  
          // .attr("cx", function(d) { 
          //   // console.log(d.x)
          //   return d.x; })
          // .attr("cy", function(d) { return d.y; });
    }

    function onMouseOver(d) {
      // console.log("mouse over " + d.Keywords) 
      

      d3.select("linechart")
        .style("visibility", "visible")
        .style("z-index", 100);

      // svg.selectAll(".keyword")
      //   .style("opacity", "0.7")
      
      var dataToSend = [];
      var values = {};
      svg.selectAll(".keyword").filter(function(p) {         
        if (p.Keywords == d.Keywords) {
          dataToSend.push(p);
          return true;
        }
      })
        // .style("opacity", "1")
        .moveToFront()
        .select("text")
          // .style("stroke", "red")
          .style("stroke-width", "2px")       
          .style("fill", "black");

      // console.log(dataToSend)
      $scope.$apply(function() {
        $scope.chartdata = dataToSend;
      })
    }

    function onMouseOut(d) {
      d3.select("linechart")
          .style("visibility", "hidden")
          .style("z-index", -1);

      // svg.selectAll(".keyword")
      //   .style("opacity", "1");

      svg.selectAll(".keyword").filter(function(p) { return p.Keywords == d.Keywords; })
        .select("text")          
          .style("fill", function(d) { return fill(d.panel); });
    }

    function onClick(d) {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("x". width/2)
        .attr("y". height/2)
    }

    function onMouseMove(d) {      
      // console.log(this.getBBox())
      // d3.event must be used to retrieve pageY and pageX. While this is not needed in Chrome, it is needed in Firefox
      d3.select("linechart")
        .style("top", (d3.event.pageY-8)+"px")
        .style("left",(d3.event.pageX+10)+"px");
    }

    // Resolves collisions between d and all other circles.
    // function collide(alpha) {
    //   var quadtree = d3.geom.quadtree(nodeItems);
    //   return function(d) {
    //     var bbox = this.getBBox(),
    //     // var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
    //         nx1 = d.x - bbox.width/2,
    //         nx2 = d.x + bbox.width/2,
    //         ny1 = d.y - bbox.height/2,
    //         ny2 = d.y + bbox.height/2;
    //     quadtree.visit(function(quad, x1, y1, x2, y2) {
    //       if (quad.point && (quad.point !== d)) {
    //         var x = d.x - quad.point.x,
    //             y = d.y - quad.point.y,
    //             l = Math.sqrt(x * x + y * y),
    //             r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
    //         if (l < r) {
    //           l = (l - r) / l * alpha;
    //           d.x -= x *= l;
    //           d.y -= y *= l;
    //           quad.point.x += x;
    //           quad.point.y += y;
    //         }
    //       }
    //       return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    //     });
    //   };
    // }

    force.start();        

    
  });
