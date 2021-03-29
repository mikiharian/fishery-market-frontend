import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import MainLayout from 'components/layout/MainLayout';
import Button from 'components/common/button';
import TextField from 'components/common/textfield';
import ModalFilter from 'components/common/modal/ModalFilter';
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
    sort: [
      {
        label: 'Komoditas',
        value: 'komoditas',
        selected: false
      },
      {
        label: 'Provinsi',
        value: 'area_provinsi',
        selected: false
      },
      {
        label: 'Harga Tertinggi',
        value: 'price-desc',
        selected: false
      },
      {
        label: 'Harga Terendah',
        value: 'price-asc',
        selected: false
      }
    ],
    filter: {
      isLoading: true,
      area: [],
      size: []
    },
    showFilter: false,
    items: staticItems
  }

  componentDidMount() {
    this.getFilter();
    this.getPriceList(true);

    window.addEventListener('scroll', this.handleScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  addRef = this.addRef.bind(this);
  handleScroll = this.handleScroll.bind(this);
  onSearchChange = this.onSearchChange.bind(this);
  onFilterHandler = this.onFilterHandler.bind(this);
  onFilter = this.onFilter.bind(this)

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

  getFilter() {
    FishModel.getArea().then(area => {
      FishModel.getSize().then(size => {
        this.setState({
          filter: {
            area,
            size
          }
        })
      }).catch(() => {});
    }).catch(() => {});
  }

  getPriceList(refresh = false) {
    if (refresh) {
      this.setState({
        isLoading: true,
        items: staticItems,
        offset: 1
      })
    }

    const { limit, offset, query, sort, filter } = this.state;
    const sortSelected = sort.find(item => item.selected);
    const areaFilter = filter.area.find(item => item.selected);
    const sizeFilter = filter.size.find(item => item.selected);

    let search = {};
    if (query) {
      search = {
        komoditas: query
      }
    }

    if (areaFilter) {
      search = {
        ...search,
        area_provinsi: areaFilter.province,
        area_kota: areaFilter.city
      }
    }

    if (sizeFilter) {
      search = {
        ...search,
        size: sizeFilter.size
      }
    }

    FishModel.getList({
      limit,
      offset,
      search
    }).then((res) => {
      const data = res.filter(item => item.komoditas && item.price);

      let newItems = [
        ...this.state.items,
        ...data
      ];

      if (refresh) {
        newItems = data
      }

      if (sortSelected) {
        if (sortSelected.value === 'price-asc') {
          newItems.sort((a, b) => (a.price - b.price));
        } else if (sortSelected.value === 'price-desc') {
          newItems.sort((a, b) => (b.price - a.price));
        } else {
          newItems.sort((a, b) => (a[sortSelected.value] > b[sortSelected.value]) ? 1 : -1);
        }
      }

      this.setState(prevState => ({
        items: newItems,
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

  onFilterHandler() {
    this.setState(prevState => ({
      showFilter: !prevState.showFilter
    }))
  }

  onFilter(data) {
    this.setState({
      sort: data.sort,
      filter: data.filter,
      showFilter: false
    }, () => {
      this.getPriceList(true);
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
      isLoading,
      isInfiniteScroll,
      query,
      sort,
      items,
      filter,
      showFilter
    } = this.state;

    const sortSelected = sort.find(item => item.selected);
    const areaFilter = filter.area.find(item => item.selected);
    const sizeFilter = filter.size.find(item => item.selected);

    return (
      <div className="home-page">
        <div className="search-wrapper">
          <TextField
            className="m-r-16"
            leftIcon={<Icon className="left-icon" type="search" width="24" height="24" />}
            placeholder="Cari komoditas"
            value={query}
            onChange={this.onSearchChange}
          />
          <div className="filter-wrapper">
            <Button
              className={`btn-filter ${filter.isLoading ? 'loading' : ''}`}
              text={<Icon className="m-r-4" type="filter" height="32" width="32" />}
              onClick={this.onFilterHandler}
            />
            {sortSelected || areaFilter || sizeFilter
              ? <span className="active">&#8226;</span>
              : null}
          </div>
        </div>

        {query.length ? (
          <p className="text is-size-centi color is-txt is-scarpa-flow">
            Menampilkan hasil pencarian dari "<strong>{query}</strong>"
          </p>
        ) : null}

        {items.map((item, i) => (
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

        <ModalFilter
          show={showFilter}
          onClose={this.onFilterHandler}
          sort={sort}
          filter={filter}
          onFilter={this.onFilter}
        />

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
    title: 'Fishery Market',
    head: {
      title: 'Fishery Market',
      description: ''
    }
  }
});
