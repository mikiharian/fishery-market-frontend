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
    defaultLabel: oneOfType([object, string]),
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
    label: this.props.defaultLabel,
    focus: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options && nextProps.options.length) {
      const selected = nextProps.options.find(item => item.selected);
      this.setState({
        label: selected ? selected.label : this.props.defaultLabel
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
      const { optionSelected } = this.props;
      if (optionSelected) optionSelected(option.value);

      this.setState({
        label: option.label
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
      defaultColorLabel
    } = this.props;
    const { label, focus } = this.state;

    if (typeof label === 'object') {
      return (
        <Button text={label} />
      );
    }

    return (
      <Button
        isLarge
        text={
          <span className={`dropdown-label ${label === this.props.defaultLabel ? `color is-txt is-${defaultColorLabel}` : ''}`}>
            {label}
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
