import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MainLayout from 'components/layout/MainLayout';

import FishModel from 'utils/models/fish';
import { formatCurrency } from 'utils/stringHelper';

class Home extends Component {
  state = {
    isLoading: true,
    isInfiniteScroll: false,
    offset: 1,
    limit: 20,
    items: [
      {
        uuid	:	'c6c1bafa-d9c7-42da-ae49-55f29af6aeec',
        komoditas	:	'Udang Vannamei V3',
        area_provinsi	:	'LAMPUNG',
        area_kota	:	'PANDEGLANG',
        size	:	60,
        price	:	10000
      },
      {
        uuid	:	'c6c1bafa-d9c7-42da-ae49-55f29af6aeec',
        komoditas	:	'Udang Vannamei V3',
        area_provinsi	:	'LAMPUNG',
        area_kota	:	'PANDEGLANG',
        size	:	60,
        price	:	10000
      },
      {
        uuid	:	'c6c1bafa-d9c7-42da-ae49-55f29af6aeec',
        komoditas	:	'Udang Vannamei V3',
        area_provinsi	:	'LAMPUNG',
        area_kota	:	'PANDEGLANG',
        size	:	60,
        price	:	10000
      },
      {
        uuid	:	'c6c1bafa-d9c7-42da-ae49-55f29af6aeec',
        komoditas	:	'Udang Vannamei V3',
        area_provinsi	:	'LAMPUNG',
        area_kota	:	'PANDEGLANG',
        size	:	60,
        price	:	10000
      }
    ]
  }

  componentDidMount() {
    this.getPriceList();

    window.addEventListener('scroll', this.handleScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  addRef = this.addRef.bind(this);
  handleScroll = this.handleScroll.bind(this);

  addRef(e) {
    this.helper = e;
  }

  isScrolledIntoView(el) {
    let isVisible = false;
    if (el) {
      const rect = el.getBoundingClientRect();
      const elemTop = rect.top;
      const elemBottom = rect.bottom;

      isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    }
    return isVisible;
  }

  handleScroll() {
    const { isLoading, isInfiniteScroll } = this.state;
    const element = findDOMNode(this.helper); // eslint-disable-line
    const bottom = this.isScrolledIntoView(element);

    if (!isLoading && !isInfiniteScroll && bottom) {
      this.setState({
        isInfiniteScroll: true
      }, () => {
        this.getPriceList();
      })
    }
  }

  getPriceList(refresh = false) {
    const { limit, offset } = this.state;

    FishModel.getList({
      limit,
      offset
    }).then(data => {
      this.setState(prevState => ({
        items: offset > 1 ? [
          ...prevState.items,
          ...data
        ] : data,
        offset: prevState.offset + 1
      }))
    }).catch((err) => {
      this.setState({
        items: []
      })
    }).finally(() => {
      this.setState({
        isLoading: false,
        isInfiniteScroll: false
      })
    });
  }

  render() {
    const { isLoading, isInfiniteScroll, items } = this.state;

    return (
      <>
        {items.filter(item => item.komoditas !== null && item.price !== null).map((item, i) => (
          <div key={i} className="price-item">
            <div className="m-r-16">
              <p className={`text is-weight-bold color is-txt is-scarpa-flow ${isLoading ? 'loading' : ''}`}>
                {item.komoditas}
              </p>
              <span className={`text is-size-deci color is-txt is-mountain-mist ${isLoading ? 'loading' : ''}`}>
                Size: {item.size || '-'}
              </span>
              <p className={`text is-size-deci color is-txt is-scarpa-flow m-t-8 ${isLoading ? 'loading' : ''}`}>
                {item.area_kota}, {item.area_provinsi}
              </p>
            </div>
            <div>
            <p className={`text is-weight-bold color is-txt is-scarpa-flow ${isLoading ? 'loading' : ''}`}>
              {formatCurrency(item.price, true)}
            </p>
            </div>
          </div>
        ))}

        <div className="text-center m-b-24" ref={this.addRef}>
          <p className="text is-size-centi">
            {isInfiniteScroll ? 'Memuat...' : ' '}
          </p>
        </div>
      </>
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
