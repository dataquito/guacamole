'use strict';
var React       = require('react');
var GoogleMap   = require('../../lib/index').GoogleMap;

var Guacamole = React.createClass({
    getDefaultProps: function() {
        return {
            style: {
                position: 'relative',
                height: '100%',
                width: '100%',
                background: '#222'
            }
        }
    },
    getInitialState: function() {
        return {
            view: 'states',
            name: 'Hover over feature',
            data: null,
            quantiles: null
        }
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
    _requestJSON: function(jsonName) {
        var endpoint = 'https://s3-us-west-2.amazonaws.com/dataquito-open-data/mexico/inegi/';
        console.log(jsonName);
    },
    render: function() {
        return (
            <div style={this.props.style}>
                <SideBar switchView={this._switchView} view={this.state.view} name={this.state.name} layerChange={this._requestJSON}/>
                <GoogleMap view={this.state.view}  mouseOver={mouseOverPolygon} mouseOut={mouseOutPolygon} click={this._click}/>
            </div>
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
            layer: 'Poblacion'
        }
    },
    _onLayerChange: function(e, i) {
        console.log(e.currentTarget, e);
        this.setState({
            layer: e.currentTarget.value
        },function() {
            this.props.layerChange(e);
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
                            value={layer.name} 
                            checked={this.state.layer === layer.name} 
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

var featurStyle = function(feature) {

}

React.render(<Guacamole/>, document.getElementById('guacamole-main'));
