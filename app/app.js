'use strict';

var myApp = angular.module('myApp', []);
myApp.directive('helloWorld', function() {
    var link = function(scope, element, attr) {
        element.text('hello world!')
    };
    return {
        link: link,
        restrict: 'E'
    }
});

myApp.controller('HelloController', function($scope) {

});

myApp.directive('donutChart', function() {
    var link = function(scope, element, attr) {
        var color = d3.scale.category10();
        var data = scope.data;
        var width = 300;
        var height = 300;
        var min = Math.min(width, height);
        var svg = d3.select(element[0]).select("div").insert('svg', 'ul');
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
            .outerRadius(min / 2 * 0.9)
            .innerRadius(min / 2 * 0.5);

        pie.value(function(d){ return d.value; });

        svg.attr({width: width, height: height});
        var g = svg.append('g')
            // center the donut chart
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        g.append("text")
            .style("text-anchor", "middle");

        // add the <path>s for each arc slice
        var arcs = g.selectAll('path').data(pie(data))
            .enter().append('path')
            //.attr('d', arc)
            .attr('fill', function(d, i){ return color(i) })
            .on('mouseover', function(d, i) {
                g.selectAll('text').text(d.value)
                    .transition()// stop running transistions.
                    .style('opacity', 1);
            })
            .on('mouseout', function(d, i) {
                g.selectAll('text').transition()
                    .duration(1000)
                    .style('opacity', 0);
                //g.selectAll('text').text('');
            })
        ;

        scope.$watch('data', function(data){
            arcs =  arcs.data(pie(data));
            arcs.exit().remove();
            arcs.enter()
                .append('path')
                .attr('fill', function(d, i){ return color(i) })
                .on('mouseover', function(d, i) {
                    g.selectAll('text').text(d.value)
                        .transition()// stop running transistions.
                        .style('opacity', 1);
                })
                .on('mouseout', function(d, i) {
                    g.selectAll('text').transition()
                        .duration(1000)
                        .style('opacity', 0);
                    //g.selectAll('text').text('');
                });
            arcs.attr('d', arc);
        }, true);


    };
    return {
        link: link,
        templateUrl: 'donut_chart.html',
        restrict: 'E',
        scope: { data: '='}
    }
});

myApp.directive('myTest', function() {
    return {
        template: 'test'
    };

});