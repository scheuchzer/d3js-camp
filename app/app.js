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

myApp.controller('MainControllerSelected', function($scope) {
    var url = 'donut-data.json';
    d3.json(url, function(err, dataFromFile){
        if(err){ throw err; }
        $scope.data = dataFromFile.map(function(d){ return {value: d};});
        console.log('loaded: %s', JSON.stringify($scope.data));
        $scope.$apply();
    });

});

myApp.controller('MainController', function($scope) {
    var url = 'donut-data.json';
    d3.json(url, function(err, dataFromFile){
        if(err){ throw err; }
        $scope.data = dataFromFile.map(function(d){ return {value: d};});
        console.log('loaded: %s', JSON.stringify($scope.data));
        $scope.$apply();
    });

});

myApp.controller('MainControllerHttp', function($scope, $http, $interval) {
    $http.get('donut-data.json').success(function(data){
        $scope.data = data.map(function(d){ return {value: (d*Math.random())};});
    }).error(function(err){
        throw err;
    });

    $interval(function(){
        $http.get('donut-data.json').success(function(data){
            $scope.data = data.map(function(d){ return {value: (d*Math.random())};});
        }).error(function(err){
            throw err;
        });
    }, 4000);
});

myApp.controller('MainControllerSelected', function($scope, $http) {
    $scope.selectedValue=0;
    $http.get('donut-data.json').success(function(data){
        $scope.donutData = data.map(function(d){ return {value: d}});
    }).error(function(err){
        throw err;
    });
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

myApp.directive('donutChart2', function() {
    var link = function(scope, element, attr) {
        console.log(scope.url);
        var color = d3.scale.category10();
        scope.data = [];
        var url = scope.url;
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
        var arcs = g.selectAll('path').data(pie(scope.data))
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

        d3.json(url, function(err, dataFromFile){
            if(err){ throw err; }
            scope.data = dataFromFile.map(function(d){ return {value: d};});
            arcs = arcs.data(pie(scope.data));
            arcs.exit().remove();
            arcs.enter().append('path')
                .style('stroke', 'white')
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
            // update all the arcs (not just the ones that might have been added)
            arcs.attr('d', arc);
            console.log(JSON.stringify(scope.data));
            scope.$apply();

        });

        scope.$watch('data', function(data){
            console.log('watch: %s', JSON.stringify(data));
            arcs =  arcs.data(pie(scope.data));
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
        scope: { url: '='}
    }
});

myApp.directive('donutChart3', function() {
    var link = function(scope, element, attr) {
        var color = d3.scale.category10();

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


        scope.$watch('data', function(data){
            console.log('data: %s', JSON.stringify(data));
            if (!data) {
                return;
            }

            var arcs = g.selectAll('path');
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

myApp.directive('donutChart5', function() {
    var link = function(scope, element, attr) {
        var color = d3.scale.category10();

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


        scope.$watch('data', function(data){
            console.log('data: %s', JSON.stringify(data));
            if (!data) {
                return;
            }

            var arcs = g.selectAll('path');
            arcs =  arcs.data(pie(data));
            arcs.exit().remove();
            arcs.enter()
                .append('path')
                .attr('fill', function(d, i){ return color(i) })
                .on('mouseover', function(d, i) {
                    g.selectAll('text').text(d.value)
                        .transition()// stop running transistions.
                        .style('opacity', 1);
                    scope.selectedValue= d.value;
                    scope.$apply();
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
        scope: {
            data: '=',
            selectedValue: '='
        }
    }
});
