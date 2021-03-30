import React, { Component } from 'react';
import { string } from 'prop-types';
import Image from 'components/common/image';

export default class Icon extends Component {
  static propTypes = {
    className: string,
    type: string
  };

  static defaultProps = {
    className: '',
    type: null
  };

  render() {
    const {
      className,
      color,
      type,
      ...other
    } = this.props;
    return (
      <Image
        {...other}
        inline
        className={className}
        src={`/static/icons/${type}.svg`}
      />
    );
  }
}
