import React, { Component } from 'react';
import NextHead from 'next/head';
import { string } from 'prop-types';

class Header extends Component {
  static propTypes = {
    title: string,
    themeColor: string
  }

  static defaultProps = {
    title: null,
    themeColor: '#28B796'
  }

  render() {
    const { title, themeColor } = this.props;

    return (
      <>
        <NextHead>
          <meta name="theme-color" content={themeColor} />
        </NextHead>
        <div className="header">
          <div className="wrapper">
            {title}
          </div>
        </div>
      </>
    );
  }
}

export default Header;
