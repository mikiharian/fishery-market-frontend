import React from 'react';
import App from 'next/app';

class MyApp extends App {
  render() {
    const {
      Component, pageProps, router
    } = this.props;

    return (
      <Component {...pageProps} key={router.asPath || router.route} />
    );
  }
}

export default MyApp;
