'use strict';
var React       = require('react');
var GoogleMap   = require('../../lib/index').GoogleMap;

var mouseOverPolygon = function(map, event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {
        strokeWeight: 1,
        fillColor: '#ddd'
    });
}

var mouseOutPolygon = function(map, event) {
    map.data.revertStyle();
}

var mouseClickPolygon = function(map, event) {
    console.log('click');
}

React.render(<GoogleMap 
    mouseOver={mouseOverPolygon} 
    mouseOut={mouseOutPolygon}
    click={mouseClickPolygon}/>, 
        document.getElementById('guacamole-main'));

