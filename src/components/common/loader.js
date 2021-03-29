import React, { Component } from 'react';
import { string } from 'prop-types';

class Loader extends Component {
  static propTypes = {
    className: string,
    color: string
  }

  static defaultProps = {
    className: '',
    color: 'white'
  }

  render() {
    const {
      className, color
    } = this.props;

    return (
      <div className={`loader-dot ${className}`}>
        <span className={`color is-bg is-${color || 'white'}`} />
        <span className={`color is-bg is-${color || 'white'}`} />
        <span className={`color is-bg is-${color || 'white'}`} />
      </div>
    );
  }
}

export default Loader;
