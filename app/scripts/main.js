'use strict';
var React       = require('react');
var _           = require('lodash');
var GoogleMap   = require('../../lib/index').GoogleMap;
var MN_CODE = 'CVE_GEO_MU';

var Guacamole = React.createClass({
    getDefaultProps: function() {
        return {
            style: {
                position: 'relative',
                height: '100%',
                width: '100%',
                background: '#222'
            },
            colors: [
                '#ffffcc',
                '#a1dab4',
                '#41b6c4',
                '#225ea8'
            ]
        }
    },
    getInitialState: function() {
        return {
            view: 'municipalities',
            name: 'Hover over feature',
            data: null,
            quantiles: null,
            layer: 'population.json'
        }
    },
    componentDidMount: function() {
        this._requestJSON(this.state.layer);
    },
    _switchView: function() {
        if(this.state.view === 'states'){
            this.setState({
                view: 'municipalities'
            });
        }else{
            this.setState({
                view: 'states'
            });
        }
    },
    _click: function(map, event) {
        var name = event.feature.getProperty('NOMBRE');
        this.setState({
            name: name
        });
    },
    _getEntityValue: function(entityCode) {
        if(typeof this.state.data[entityCode] === 'undefined' || this.state.data[entityCode] === null){
            return null;
        }
        return this.state.data[entityCode].value;
    },
    _getColor: function(value) {
        if(_.inRange(0, value, this.state.quantiles[0])){
            return this.props.colors[0];
        }else if(_.inRange(this.state.quantiles[0], value, this.state.quantiles[1])){
            return this.props.colors[1];
        }else if(_.inRange(this.state.quantiles[1], value, this.state.quantiles[2])){
            return this.props.colors[2];
        }else{
            return this.props.colors[3];
        }
    },
    _setFeature: function(feature) {
        if(this.state.quantiles === null){
            return {
                visible: false
            }
        }
        var visible = true;
        var color = '#222';
        if(this.state.view === 'municipalities' && typeof feature.getProperty(MN_CODE) === 'undefined'){
            visible = false;
        }else if(this.state.view === 'states' && typeof feature.getProperty(MN_CODE) !== 'undefined'){
            visible = false;
        }
        if(typeof feature.getProperty(MN_CODE) !== 'undefined'){
            var entityCode = feature.getProperty(MN_CODE);
            var value = this._getEntityValue(entityCode);
            if(value === null){
                visible = false;
            }else{
                color = this._getColor(value);
            }
        }
        return {
            strokeWeight: 0.2,
            fillColor: color,
            visible: visible,
            fillOpacity: 0.5
        };
    },
    _requestJSON: function(jsonName) {
        var endpoint = 'https://s3-us-west-2.amazonaws.com/dataquito-open-data/mexico/inegi/';
        var _this = this;
        $.get(endpoint + jsonName).done(function(data) {
            _this.setState({
                data: data.entities,
                quantiles: data.quantiles,
                layer: jsonName
            });
        });
    },
    render: function() {
        return (
            <div style={this.props.style}>
                <SideBar 
                    switchView={this._switchView} 
                    view={this.state.view} 
                    name={this.state.name} 
                    layerChange={this._requestJSON}/>
                <GoogleMap 
                    view={this.state.view} 
                    layer={this.state.layer} 
                    zoom={6} 
                    mouseOver={mouseOverPolygon} 
                    mouseOut={mouseOutPolygon} 
                    click={this._click} 
                    featureStyle={this._setFeature}>
                    <SearchBar/>
                </GoogleMap>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    componentDidMount: function() {
        console.log('render search bar');
    },
    render: function() {
        return (
            <input id='pac-input' className='controls' type='text' placeholder='Search Box'/>
        );
    }
});

var SideBar = React.createClass({
    getDefaultProps: function() {
        return {
            inegi: [
                {name: 'Poblacion', json: 'population.json'},
                {name: 'Pobreza Percentage', json: 'poverty_percentage.json'},
                {name: 'Pobreza Population', json: 'poverty_population.json'},
                {name: 'Pobreza Extrema Percentage', json: 'extreme_poverty_percentage.json'},
                {name: 'Pobreza Extrema Population', json: 'extreme_poverty_population.json'},
                {name: 'Pobreza Moderada Percentage', json: 'moderate_poverty_percentage.json'},
                {name: 'Pobreza Moderada Population', json: 'moderate_poverty_population.json'},
                // {name: 'Vulnerables por carencia social', json: ''},
                // {name: 'Vulnerables por ingreso'},
                // {name: 'Rezago educativo'},
                // {name: 'Carencia por acceso a los servicios de salud'},
                // {name: 'Carencia por acceso a la seguridad social'},
                // {name: 'Carencia por calidad y espacios de la vivienda'},
                // {name: 'Carencia por acceso a los servicios básicos en la vivienda'},
                // {name: 'Carencia por acceso a la alimentación'},
                // {name: 'Población con ingreso inferior a la línea de bienestar'},
                // {name: 'Población con ingreso inferior a la línea de bienestar mínimo'},
                // {name: 'Coeficiente de Gini'},
                // {name: 'Razón del ingreso entre la población pobre extrema y la población no pobre y no vulnerable'}
            ]
        };
    },
    getInitialState: function() {
        return {
            layer: 'population.json'
        }
    },
    _onLayerChange: function(e, i) {
        console.log(e.currentTarget.value, e);
        var layer = e.currentTarget.value;
        this.setState({
            layer: layer
        },function() {
            this.props.layerChange(layer);
        });
    },
    render: function() {
        var style = {
            position: 'absolute',
            left: '0',
            width: '300px',
            top: '0px',
            height: '100%',
            background: '#222',
            zIndex: 9999,
            borderTop: '2px solid #e74c3c'
        }
        var radioButtons = this.props.inegi.map(function(layer) {
            return (
                <div className='radio'>
                    <label>
                        <input type='radio'
                            name='layers'
                            value={layer.json} 
                            checked={this.state.layer === layer.json} 
                            onChange={this._onLayerChange}/>
                        {layer.name}
                    </label>
                </div>
            );
        }, this);
        return (
            <div style={style}>
                <div className='col-sm-12'>
                    <h4 style={{color: '#fff'}}>
                        Currently watching <span style={{color: '#e74c3c'}}>{this.props.view}</span>
                    </h4>
                    <hr/>
                    <h4 style={{color: '#fff'}}>
                        {this.props.name}
                    </h4>
                    <p style={{color: '#fff'}}>
                        Duo ei choro labores. Erat dolorem convenire ea sed. Qui wisi omnesque ad, per cu voluptatum intellegam.
                    </p>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <th scope="row">Pobreza</th>
                                <td>19,300</td>
                            </tr>
                            <tr>
                                <th scope="row">Vulnerables por carencia social</th>
                                <td>280</td>
                            </tr>
                            <tr>
                                <th scope="row">Rezago educativo</th>
                                <td>7.2</td>
                            </tr>
                        </tbody>
                    </table>
                    {radioButtons}
                    <button onClick={this.props.switchView} type='button' className='btn btn-danger btn-block'>Switch</button>
                </div>
            </div>
        );
    }
});

var mouseOverPolygon = function(map, event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {
        strokeWeight: 0.5,
        fillOpacity: 0.8
    });
}

var mouseOutPolygon = function(map, event) {
    map.data.revertStyle();
}

var mouseClickPolygon = function(map, event) {
    console.log('click');
}

var featurStyle = function(feature) {

}

React.render(<Guacamole/>, document.getElementById('guacamole-main'));
