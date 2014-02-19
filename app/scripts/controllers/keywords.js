'use strict';

angular.module('ercApp')
  .controller('KeywordsCtrl', function ($scope, data) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    // console.log(data.panel)    

    var groupedData = {};
    data.forEach(function(d) {
      var dictKey = d.Keywords + '_' + d.panel;
      if (!groupedData[dictKey]) {
        var obj = {};
        obj.Keywords = d.Keywords;
        obj.projects = [];
        obj.projects.push(d['Project code ']);
        obj.freq = +d.freq;
        obj.panel = d.panel;
        groupedData[dictKey] = obj;
      } else {
        groupedData[dictKey].freq += +d.freq;
        groupedData[dictKey].projects.push(d['Project code '])
      }        
    })

    console.log(groupedData)

    data = d3.values(groupedData)
    console.log(data)

    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
      this.parentNode.appendChild(this);
      });
    };

    $('circle').qtip({ // Grab some elements to apply the tooltip to
      content: {
        text: 'My common piece of text here'
      }
    })

    var width = 1000,
        height = 700;

    var categories = ['SH1', 'SH2', 'SH3', 'SH4', 'SH5', 'SH6'];

    var freq_threshold = 11;
    var fill = d3.scale.category10().domain(categories),
        radiusScale = d3.scale.sqrt().domain([freq_threshold, d3.max(data, function(d) {
          return d.freq;
        })]).range([10, 30]);

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

    var nodeItems = svg.selectAll("circle")
        .data(nodes)
        .enter()
        // .append("class", "node")
        .append("g")
        .on("mouseover", function(d) {
            // console.log(d.Keywords + ": " + d.freq);
            // console.log("R: " + d.radius)
            d3.selectAll("g").filter(function(p) {
              return p.Keywords == d.Keywords;
            })
            .moveToFront()
            .selectAll("circle")
              .style("fill", "yellow")          
          })          
        .on("mouseout", function(d) {
          d3.selectAll("g").filter(function(p) {
              return p.Keywords == d.Keywords;
            })
          .selectAll("circle")
            .style("fill", function(d) { return fill(d.panel); })
        })
        .call(force.drag)

    nodeItems
        .append("circle")        
          // .attr("cx", function(d) {
          //   return ~~(Math.random() * width)
          // })
          // .attr("cy", function(d) {
          //   return ~~(Math.random() * height)
          // })
          .attr("r", function(d) {
            var radius = radiusScale(d.freq);
            d.radius = radius;
            return radius;
          })
          .style("fill", function(d) { return fill(d.panel); })
          .style("stroke", function(d) { return d3.rgb(fill(d.panel)).darker(2); });

    nodeItems
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
          return "10px";
        })        
        
       // .style("font-size", "10px");

    svg.selectAll(".bgText")
      .data(categories)
      .enter()
      .append("text")
        .attr("x", function(d, i) {
          if (i == 0 || i == 3)
            return foci[d].x - 50;
          else if (i == 1 || i == 4)
            return foci[d].x + 20;
          else
            return foci[d].x + 90;
        })
        .attr("y", function(d, i) {
           if (i < 3)
            return foci[d].y - 70;
          else
            return foci[d].y + 100;
          
        })
        .attr("text-anchor", "middle")
        // .attr("stroke", "gray")
        .style("opacity", 0.2)
        .style("font-size", "100px")
        .text(function(d) {
          return d;
        });

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
      var k = .1 * e.alpha;

      // Push nodes toward their designated focus.
      nodes.forEach(function(o, i) {
        o.y += (foci[o.panel].y - o.y) * k;
        o.x += (foci[o.panel].x - o.x) * k;
      });


      nodeItems.attr("transform", function(d) { 
        return 'translate(' + [d.x, d.y] + ')'; 
      });  
          // .attr("cx", function(d) { 
          //   // console.log(d.x)
          //   return d.x; })
          // .attr("cy", function(d) { return d.y; });
    }

    force.start()
    // setInterval(function(){
    //   nodes.push({id: ~~(Math.random() * foci.length)});
    //   force.start();

    //   node = node.data(nodes);

    //   node.enter().append("circle")
    //       .attr("class", "node")
    //       .attr("cx", function(d) { return d.x; })
    //       .attr("cy", function(d) { return d.y; })
    //       .attr("r", 8)
    //       .style("fill", function(d) { return fill(d.id); })
    //       .style("stroke", function(d) { return d3.rgb(fill(d.id)).darker(2); })
    //       .call(force.drag);
    // }, 500);
  });
