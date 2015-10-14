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
            zoom: 5,
            view: 'states',
            colors: ['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#2c7fb8','#253494'],
            entities: {
                '01': 19488135081.709801,
                '02': 62162383771.269501,
                '03': 8677489107.6500092,
                '04': 5386653998.8299999,
                '05': 60250348211.538696,
                '06': 11925029956.2701,
                '07': 10902890182.110001,
                '08': 62017203696.9702,
                '09': 65164893728.738297,
                '10': 16134737778.579901,
                '11': 59084560926.729401,
                '12': 7484948287.89991,
                '13': 26084459366.680099,
                '14': 90762140351.971603,
                '15': 90078053418.343506,
                '16': 23557588087.300301,
                '17': 10350225109.459801,
                '18': 10535000038.459999,
                '19': 133036205046.681,
                '20': 5256021129.7999897,
                '21': 30994818005.610401,
                '22': 28267209445.6702,
                '23': 36394428458.370399,
                '24': 25377438561.879902,
                '25': 37796567391.579903,
                '26': 52019113722.980904,
                '27': 12574651445.92,
                '28': 68535284355.1698,
                '29': 6770710677.97999,
                '30': 45199672149.341003,
                '31': 27430206259.249901,
                '32': 7001951665.3199501
            }
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
            zoom: this.props.zoom
        };
        this._map = new google.maps.Map(React.findDOMNode(this), mapOptions);
        this._loadPolygons();
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.view === nextProps.view && this.props.layer === nextProps.layer){
            return false;
        }
        var map = this._map;
        var _this = this;
        map.data.setStyle(this._setFeatureStyle);
        return false;
    },
    componentWillUpdate: function(nextProps, nextState) {
        console.log('I will try to upodate');
    },
    _checkIfGoogleDefined: function() {
        if(typeof google === 'object' && typeof google.maps === 'object'){
            return true;
        }
        return false;
    },
    _loadPolygons: function() {
        var map = this._map;
        var getPolygons = $.get('https://s3-us-west-2.amazonaws.com/dataquito-open-data/mexico/polygons-mexico.json');
        getPolygons.done(function(data) {
            console.log(data);
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
        if(typeof this.props.featureStyle === 'function'){
            return this.props.featureStyle(feature);
        }else{
            var visible = true;
            if(this.props.view === 'municipalities' && typeof feature.getProperty(MN_CODE) === 'undefined'){
                visible = false;
            }else if(this.props.view === 'states' && typeof feature.getProperty(MN_CODE) !== 'undefined'){
                visible = false;
            }
            return {
                strokeWeight: 0.2,
                fillColor: '#222',
                visible: visible,
                fillOpacity: 0.2
            };
        }
    },
    _addPolygonListeners: function() {
        var map = this._map;
        google.maps.event.addListener(map.data, 'mouseover', this._mouseOverPolygon);
        google.maps.event.addListener(map.data, 'mouseout', this._mouseOutPolygon);
        google.maps.event.addListener(map.data, 'click', this._mouseClickPolygon);
    },
    _mouseOverPolygon: function(event) {
        var map = this._map;
        if(typeof this.props.mouseOver === 'function'){
            this.props.mouseOver(map, event);
        }
    },
    _mouseOutPolygon: function() {
        var map = this._map;
        if(typeof this.props.mouseOut === 'function'){
            this.props.mouseOut(map);
        }
    },
    _mouseClickPolygon: function(event) {
        var map = this._map;
        if(typeof this.props.click === 'function'){
            this.props.click(map, event);
        }
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
