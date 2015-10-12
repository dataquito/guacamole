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
            name: 'Hover over feature'
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
    render: function() {
        return (
            <div style={this.props.style}>
                <SideBar switchView={this._switchView} view={this.state.view} name={this.state.name}/>
                <GoogleMap view={this.state.view} mouseOver={mouseOverPolygon} mouseOut={mouseOutPolygon} click={this._click}/>
            </div>
        );
    }
});

var SideBar = React.createClass({
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
                        Duo ei choro labores. Erat dolorem convenire ea sed. Qui wisi omnesque ad, per cu voluptatum intellegam. Brute movet mediocrem ad mea, vis simul partiendo adipiscing te, assueverit complectitur mediocritatem has ut. Denique constituto nec in. Hinc movet iriure eos ut, ut nec modus delenit, quo no quod corpora expetendis.
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
                    <button onClick={this.props.switchView} type='button' className='btn btn-danger btn-block'>Switch</button>
                </div>
            </div>
        );
    }
});

var mouseOverPolygon = function(map, event) {
    console.log(event.feature.getProperty('NOMBRE'));
    // map.data.revertStyle();
    // map.data.overrideStyle(event.feature, {
    //     strokeWeight: 1,
    //     fillColor: '#ddd'
    // });
}

var mouseOutPolygon = function(map, event) {
    // map.data.revertStyle();
}

var mouseClickPolygon = function(map, event) {
    console.log('click');
}

var featurStyle = function(feature) {

}

React.render(<Guacamole/>, document.getElementById('guacamole-main'));
