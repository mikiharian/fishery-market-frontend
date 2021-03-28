import React, { Component } from 'react';

import MainLayout from 'components/layout/MainLayout';

class Home extends Component {
  render() {
    return (
      <p>Fishery Market</p>
    );
  }
}

export default MainLayout({
  component: Home,
  props: {
    title: 'Home',
    head: {
      title: 'Fishery Market',
      description: ''
    }
  }
});
