'use strict';

angular.module('ercApp')
  .directive('linechart', function () {
    return {
      //We restrict its use to an element
      //as usually  <bars-chart> is semantically
      //more understandable
      restrict: 'E',
      //this is important,
      //we don't want to overwrite our directive declaration
      //in the HTML mark-up
      replace: false, 
      // scope: { chartdata: '=' },
      // controller: 'KeywordsCtrl',
      link: function (scope, element, attrs) {
        var data = [];
        scope.$watch('chartdata', function() {
          console.log(scope.chartdata);
          svg.selectAll(".line").remove();
          var lines = svg.selectAll(".line")
            .data(scope.chartdata)
            .enter()
            .append("path")
              .attr("class", "line")
              .style("stroke", function(d) { return color(d.panel); });              

          lines
            .datum(function(d) { return d3.values(d.years); })            
            .attr("d", line);            
          
          svg.select("#title")            
            .text(function() {
              console.log(scope.chartdata.length)
              return (scope.chartdata.length == undefined) ? "" : scope.chartdata[0].Keywords;
            });
        })
        // console.log("scope");
        // console.log(scope);
        // console.log("attrs");
        // console.log(attrs);

        var margin = {top: 10, right: 10, bottom: 20, left: 20},
          width = 200 - margin.left - margin.right,
          height = 100 - margin.top - margin.bottom;

        var categories = ['SH1', 'SH2', 'SH3', 'SH4', 'SH5', 'SH6'];
        var color = d3.scale.category10()
                   .domain(categories)

        var x = d3.scale.ordinal()
          .domain(['2008', '2009', '2010', '2011', '2012'])
          .rangePoints([0, width]);

        var y = d3.scale.linear()
          .range([height, 0])
          .domain([0, scope.maxYearlyFreq]);

        var xAxis = d3.svg.axis()
            .scale(x)
            // .ticks(d3.time.weeks, 1)
            // .tickFormat(d3.time.format('%d-%m'))
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(3)
            .orient("left");

        var line = d3.svg.line()
            // .interpolate("cardinal")
            .x(function(d) { return x(d.name); })
            .y(function(d) { return y(d.freq); });

        var svg = d3.select(element[0])
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("id", "title")
            .attr("x", width/2)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .style("opacity", 0.6)
            .style("font-size", "13")
            .text("hola");
            

        // var linePath = svg.append("path");     
        } 
      }
  });
