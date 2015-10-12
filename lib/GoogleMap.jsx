'use strict';
var React = require('react');
var _ = require('lodash');
var mapStyle = require('./helpers/styles');
var topojson = require('topojson');
var MN_CODE = 'CVE_GEO_MU';

var GoogleMap = React.createClass({
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
    getInitialState: function() {
        return {
            view: 'states'
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
        this._loadPolygons();
    },
    _checkIfGoogleDefined: function() {
        if(typeof google === 'object' && typeof google.maps === 'object'){
            console.info('Google Maps lib is defined');
            return true;
        }
        console.warn('Google Maps lib is not defined');
        return false;
    },
    _loadPolygons: function() {
        var map = this._map;
        var getPolygons = $.get('/json/polygons-mexico.json');
        getPolygons.done(function(data) {
            map.data.addGeoJson(topojson.feature(data, data.objects.municipalities));
            map.data.addGeoJson(topojson.feature(data, data.objects.states));
        }).then(this._setPolygonsStyles).then(this._addPolygonListeners);
    },
    _setPolygonsStyles: function(data) {
        var map = this._map;
        var colorPolygons = $.Deferred();
        if(typeof map === 'undefined'){
            colorPolygons.reject();
        }else{
            map.data.setStyle(this._setFeatureStyle);
            colorPolygons.resolve();
        }
        return colorPolygons.promise();
    },
    _setFeatureStyle: function(feature) {
        var visible = true;
        if(typeof feature.getProperty(MN_CODE) !== 'undefined' || this.state.view === 'municipalities'){
            visible = false;
        }
        return {
            strokeWeight: 0.2,
            fillColor: '#222',
            visible: visible,
            fillOpacity: 0.2
        };
    },
    _addPolygonListeners: function() {
        var map = this._map;
        google.maps.event.addListener(map.data, 'mouseover', this._mouseOverPolygon);
        google.maps.event.addListener(map.data, 'mouseout', this._mouseOutPolygon);
        // google.maps.event.addListener(map.data, 'mouseout', function() {
        //     map.data.revertStyle();
        //     _this.setState({place: null, placeInfo: null});
        // });
    },
    _mouseOverPolygon: function(event) {
        var map = this._map;
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {strokeWeight: 1});
    },
    _mouseOutPolygon: function() {
        var map = this._map;
        map.data.revertStyle();
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
