import React, { Component } from 'react';
import { connect } from 'react-redux';


class Home extends Component {
  render () {
    return (
      <div className="app-page page-home">
        Home
      </div>
    );
  }
}

export default connect((/* state */) => {
  return {

  };
})(Home);
