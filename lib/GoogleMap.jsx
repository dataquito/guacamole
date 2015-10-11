'use strict';
var React = require('react');
var _ = require('lodash');
var mapStyle = require('./helpers/styles');

var GoogleMap = React.createClass({
    _checkIfGoogleDefined: function() {
        if(typeof google === 'object' && typeof google.maps === 'object'){
            console.info('Google Maps lib is defined');
            return true;
        }
        console.warn('Google Maps lib is not defined');
        return false;
    },
    getDefaultProps: function() {
        return {
            containerStyles: {
                width: '100%',
                height: '100%'
            },
            latitude: 19.426875,
            longitude:  -99.134564,
            zooom: 8
        };
    },
    componentDidMount: function() {
        if(!this._checkIfGoogleDefined()){
            return;
        }
        var latlng = new google.maps.LatLng(this.props.latitude, this.props.longitude);
        var mapOptions = {
            center: latlng,
            styles: mapStyle,
            disableDefaultUI: true,
            zoom: 8
        };
        this._map = new google.maps.Map(React.findDOMNode(this), mapOptions);
    },
    render: function () {
        var style = this.props.containerStyles;
        return (
            <div style={style}>
            </div>
        );
    }
});

module.exports = GoogleMap;
