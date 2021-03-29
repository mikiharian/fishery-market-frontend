import React, { Component } from 'react';
import { bool, func, arrayOf, shape } from 'prop-types';
import { withRouter } from 'next/router';

import Modal from 'components/common/modal';
import Button from 'components/common/button';
import Dropdown from 'components/common/button/dropdown';

class ModalFilter extends Component {
  static propTypes = {
    onClose: func.isRequired,
    show: bool,
    sort: arrayOf(shape({})).isRequired,
    filter: shape({
      area: arrayOf(shape({})),
      size: arrayOf(shape({}))
    }).isRequired,
    onFilter: func
  }

  static defaultProps = {
    show: true,
    onFilter: null
  }

  state = {
    sort: this.props.sort,
    filter: this.props.filter
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && nextProps.show !== this.props.show) {
      this.setState({
        sort: nextProps.sort,
        filter: nextProps.filter
      });
    }
  }

  closeHandler = this.closeHandler.bind(this);
  onSelected = this.onSelected.bind(this);
  applyFilter = this.applyFilter.bind(this);
  resetFilter = this.resetFilter.bind(this);

  onSelected(field) {
    return (selected) => {
      let { sort, filter } = this.state;

      if (field === 'sort') {
        sort = sort.map(item => ({
          ...item,
          selected: item.value === selected
        }))
      } else {
        if (field === 'area') {
          filter = {
            ...filter,
            area: filter.area.map(item => ({
              ...item,
              selected: item.city === selected
            }))
          }
        } else {
          filter = {
            ...filter,
            size: filter.size.map(item => ({
              ...item,
              selected: item.size === selected
            }))
          }
        }
      }

      this.setState({
        sort,
        filter
      })
    }
  }

  applyFilter() {
    const { onFilter } = this.props;
    const { sort, filter } = this.state;
    if (onFilter) onFilter({
      sort, filter
    });
  }

  resetFilter() {
    this.setState(prevState => ({
      sort: prevState.sort.map(item => ({
        ...item,
        selected: false
      })),
      filter: {
        area: prevState.filter.area.map(item => ({
          ...item,
          selected: false
        })),
        size: prevState.filter.size.map(item => ({
          ...item,
          selected: false
        }))
      }
    }))
  }

  closeHandler() {
    const { onClose } = this.props;
    if (onClose) onClose();
  }

  renderContent() {
    const { sort, filter } = this.state;

    return (
      <div className="m-t-16 m-r-16 m-b-16 m-l-16">
        <div className="border-bottom p-b-16 m-b-16">
          <p className="text is-weight-bold color is-txt is-scarpa-flow m-b-8">
            Urutkan
          </p>
          <Dropdown
            options={sort}
            defaultLabel="Urutkan Berdasarkan"
            optionSelected={this.onSelected('sort')}
          />
        </div>
        <div className="m-t-32">
          <p className="text is-weight-bold color is-txt is-scarpa-flow m-b-8">
            Filter
          </p>
          <Dropdown
            className="m-b-16"
            options={filter.area.map(item => ({
              label: `${item.city}, ${item.province}`,
              value: item.city,
              selected: item.selected
            }))}
            defaultLabel="Pilih Area"
            optionSelected={this.onSelected('area')}
          />
          <Dropdown
            options={filter.size.map(item => ({
              label: item.size,
              value: item.size,
              selected: item.selected
            }))}
            defaultLabel="Pilih Size"
            optionSelected={this.onSelected('size')}
          />
        </div>
        <div className="modal-footer fixed">
          <Button onClick={this.resetFilter} className="m-r-8" text="Atur Ulang" isDefault isFull />
          <Button onClick={this.applyFilter} className="m-l-8" text="Terapkan" isFull />
        </div>
      </div>
    )
  }

  render() {
    const { show } = this.props;

    return (
      <Modal
        className="modal-fullscreen"
        show={show}
        onClose={this.closeHandler}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default withRouter(ModalFilter);
