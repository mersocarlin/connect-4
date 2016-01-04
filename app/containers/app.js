import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Strings } from '../constants';


class App extends Component {

  static propTypes = {
    children: PropTypes.any.isRequired,
  }

  render () {
    return (
      <div className="connect-4-app">
        {this.props.children}
      </div>
    );
  }
}


function mapStateToProps (/* state */) {
  return {};
}


export default connect(mapStateToProps)(App);
