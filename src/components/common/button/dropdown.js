import React, { Component } from 'react';
import {
  arrayOf,
  bool,
  number,
  object,
  oneOfType,
  shape,
  string,
  func
} from 'prop-types';
import Button from 'components/common/button';
import Icon from 'components/common/icon';

class DropDown extends Component {
  static propTypes = {
    className: string,
    options: arrayOf(shape({
      label: oneOfType([object, string, number]),
      value: oneOfType([string, number, object]),
      selected: bool
    })),
    defaultLabel: string,
    defaultColorLabel: string,
    optionSelected: func
  }

  static defaultProps = {
    className: '',
    options: [],
    defaultLabel: '',
    defaultColorLabel: 'mountain-mist',
    optionSelected: null
  }

  state = {
    options: this.props.options,
    focus: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options && nextProps.options.length) {
      this.setState({
        options: nextProps.options
      });
    }
  }

  showOption = this.showOption.bind(this);
  outsideClickListener = this.outsideClickListener.bind(this);
  optionSelected = this.optionSelected.bind(this)

  outsideClickListener(e) {
    if (e && e.path && e.path.indexOf(this.optionsWrapper)) {
      this.setState({
        focus: false
      }, () => {
        document.removeEventListener('click', this.outsideClickListener);
      });
    }
  }

  optionSelected(option) {
    return () => {
      this.setState(prevState => ({
        options: prevState.options.map(item => ({
          ...item,
          selected: item.value === option.value
        }))
      }), () => {
        const { optionSelected } = this.props;
        if (optionSelected) optionSelected(option.value);
      });
    };
  }

  showOption() {
    const { focus } = this.state;
    this.setState({
      focus: !this.state.focus
    }, () => {
      if (focus) document.addEventListener('click', this.outsideClickListener);
    });
  }

  renderButton() {
    const {
      defaultLabel,
      defaultColorLabel
    } = this.props;
    const { focus, options } = this.state;
    const selected = options.find(option => option.selected);

    if (selected && typeof selected.label === 'object') {
      return (
        <Button text={selected.label} />
      );
    }

    return (
      <Button
        isLarge
        text={
          <span className={`dropdown-label ${!selected ? `color is-txt is-${defaultColorLabel}` : ''}`}>
            {selected ? selected.label : defaultLabel}
            <Icon
              className={`m-l-16 ${focus ? 'rotate-180' : ''}`}
              color="gray-suit"
              type="arrow-down"
              width="12"
              height="12"
            />
          </span>
        }
      />
    );
  }

  renderOptions() {
    const { options } = this.props;
    const view = options.map(option => (
      <li className={option.selected ? 'active' : ''} key={option.value} value={option.value} onClick={this.optionSelected(option)}>
        {option.label}
      </li>
    ));

    return view;
  }

  render() {
    const { focus } = this.state;
    const {
      className
    } = this.props;

    return (
      <div
        onClick={this.showOption}
        className={`dropdown ${className}`}
      >
        { this.renderButton()}
        { focus && (
          <ul ref={(e) => { this.optionsWrapper = e; }} className="options">
            {this.renderOptions()}
          </ul>
        )}
      </div>
    );
  }
}

export default DropDown;
