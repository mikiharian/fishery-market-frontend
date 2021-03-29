import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MainLayout from 'components/layout/MainLayout';
import TextField from 'components/common/textfield';
import Icon from 'components/common/icon';

import FishModel from 'utils/models/fish';
import { formatCurrency } from 'utils/stringHelper';

const staticItems = [
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

class Home extends Component {
  state = {
    isLoading: true,
    isInfiniteScroll: false,
    offset: 1,
    limit: 40,
    query: '',
    items: staticItems
  }

  componentDidMount() {
    this.getPriceList(true);

    window.addEventListener('scroll', this.handleScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  addRef = this.addRef.bind(this);
  handleScroll = this.handleScroll.bind(this);
  onSearchChange = this.onSearchChange.bind(this);

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
    if (refresh) {
      this.setState({
        isLoading: true,
        items: staticItems,
        offset: 1
      })
    }

    const { limit, offset, query } = this.state;

    let search = {};
    if (query) {
      search = {
        komoditas: query
      }
    }

    FishModel.getList({
      limit,
      offset,
      search
    }).then(data => {
      this.setState(prevState => ({
        items: !refresh ? [
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

  onSearchChange(e, value) {
    this.setState({
      query: value
    }, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getPriceList(true)
      }, 300);
    })
  }

  renderEmpty() {
    const { items } = this.state;

    if (!items.length) {
      return (
        <div className="empty-price">
          <p>Data yang kamu cari tidak ada...</p>
        </div>
      )
    }

    return null;
  }

  render() {
    const {
      isLoading, isInfiniteScroll, query, items
    } = this.state;

    return (
      <div className="home-page">
        <TextField
          leftIcon={<Icon className="left-icon" type="search" width="24" height="24" />}
          placeholder="Cari komoditas"
          value={query}
          onChange={this.onSearchChange}
        />

        {query.length ? (
          <p className="text is-size-centi color is-txt is-scarpa-flow m-t-12">
            Menampilkan hasil pencarian dari "<strong>{query}</strong>"
          </p>
        ) : null}

        {items.filter(item => item.komoditas && item.price).map((item, i) => (
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

        {this.renderEmpty()}

        <div className="text-center m-b-24" ref={this.addRef}>
          <p className="text is-size-centi">
            {isInfiniteScroll ? 'Memuat...' : ' '}
          </p>
        </div>
      </div>
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
