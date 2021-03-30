import React, { Component } from 'react';
import {
  bool,
  number,
  object,
  array,
  oneOfType,
  shape,
  string,
  func
} from 'prop-types';
import { isNumberOnly, isPhoneNumber } from 'utils/stringHelper';

const HELPER_MAX_LENGTH = 82;

class TextField extends Component {
  static propTypes = {
    id: string,
    autofocus: bool,
    disabled: bool,
    error: oneOfType([string, array]),
    className: string,
    helperText: string,
    leftIcon: shape({}),
    numberOnly: bool,
    onFocusChange: func,
    onChange: func,
    label: oneOfType([number, object, string]),
    placeholder: oneOfType([number, string]),
    readOnly: bool,
    type: string,
    value: oneOfType([number, string, object]),
    min: number,
    max: number,
    maxLength: number,
    autoComplete: string,
    rows: number,
    isShowIcon: bool
  }

  static defaultProps = {
    id: null,
    autofocus: false,
    disabled: false,
    error: '',
    className: '',
    inputClassname: '',
    helperText: '',
    leftIcon: null,
    numberOnly: false,
    onFocusChange: null,
    onChange: null,
    label: '',
    placeholder: '',
    readOnly: null,
    type: 'text',
    value: '',
    min: 0,
    max: null,
    maxLength: 500,
    autoComplete: 'off',
    rows: 3
  }

  constructor(props) {
    super(props);

    this.state = {
      error: props.error,
      isFocused: false,
      value: props.value
    };

    this.getHelperText = this.getHelperText.bind(this);
    this.getLabelClasses = this.getLabelClasses.bind(this);
    this.getWrapperClases = this.getWrapperClases.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onWrapperClicked = this.onWrapperClicked.bind(this);
    this.outsideClickListener = this.outsideClickListener.bind(this);
  }

  componentDidMount() {
    const { autofocus } = this.props;

    if (autofocus) {
      this.input.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      error: nextProps.error,
      value: nextProps.value
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.outsideClickListener);
  }

  onFocusChange(focus) {
    return (e) => {
      const { onFocusChange } = this.props;
      this.setState({
        isFocused: focus
      }, () => {
        const { isFocused } = this.state;
        if (isFocused) document.addEventListener('click', this.outsideClickListener);
        if (onFocusChange) onFocusChange(e, isFocused);
      });
    };
  }

  onChange(e) {
    const {
      disabled, onChange, numberOnly, type, max, min, maxLength
    } = this.props;
    const { value } = e.target;

    if (disabled) return;
    if (value.length > maxLength) return;
    if (value && numberOnly && !isNumberOnly(value)) return;
    if (value && type === 'tel' && (!isPhoneNumber(value) || !isNumberOnly(value) || value.indexOf(' ') !== -1)) return;
    if ((max && value > max) || (min && value < min)) return;

    this.setState({
      value,
      error: false
    }, () => {
      if (onChange) onChange(e, value);
    });
  }

  onWrapperClicked() {
    this.input.focus();
  }

  getHelperText() {
    const { error } = this.props;
    let { helperText } = this.props;

    if (!helperText || (error && error.length > 0)) {
      helperText = error;
    }

    if (helperText.length > HELPER_MAX_LENGTH) {
      helperText = helperText.substring(0, HELPER_MAX_LENGTH - 1);
    }

    return helperText;
  }

  getLabelClasses() {
    const { error } = this.state;

    let classNames = 'label';

    if (error) {
      classNames += ' error';
    }

    return classNames;
  }

  getWrapperClases() {
    const { error } = this.state;
    const { className, disabled, leftIcon } = this.props;

    let classNames = `text-field ${className}`;

    if (error) {
      classNames += ' error';
    }

    if (leftIcon) {
      classNames += ' with-left-icon';
    }

    if (disabled) classNames += ' disabled';

    return classNames;
  }

  outsideClickListener(e) {
    const path = e.path || (e.composedPath && e.composedPath());
    if (path && path.indexOf(this.wrapper) === -1) {
      this.setState({
        isFocused: false
      }, () => {
        const { onFocusChange } = this.props;
        if (onFocusChange) onFocusChange(e, this.state.isFocused);
        document.removeEventListener('click', this.outsideClickListener);
      });
    }
  }

  renderLeftIcon() {
    const {
      leftIcon,
    } = this.props;

    if (leftIcon) {
      return React.cloneElement(leftIcon);
    }

    return null;
  }

  renderInput() {
    const {
      value
    } = this.state;
    const {
      id,
      disabled,
      type,
      readOnly,
      min,
      max,
      autoComplete,
      inputClassname,
      placeholder,
      rows
    } = this.props;

    if (typeof value === 'object') {
      return (
        <div
          className="input"
          ref={(e) => { this.input = e; }}
        >
          {value}
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          rows={rows}
          disabled={disabled ? 'disabled' : ''}
          type={type}
          onChange={this.onChange}
          onFocus={this.onFocusChange(true)}
          value={value}
          ref={(e) => { this.input = e; }}
          readOnly={readOnly}
          autoComplete={autoComplete}
          className={inputClassname}
          placeholder={placeholder}
        />
      );
    }

    return (
      <input
        id={id}
        disabled={disabled ? 'disabled' : ''}
        type={type}
        onChange={this.onChange}
        onFocus={this.onFocusChange(true)}
        value={value}
        ref={(e) => { this.input = e; }}
        readOnly={readOnly}
        min={type === 'number' ? min : null}
        max={type === 'number' ? max : null}
        autoComplete={autoComplete}
        className={inputClassname}
        placeholder={placeholder}
      />
    );
  }

  render() {
    const {
      error
    } = this.state;
    const {
      id,
      label,
      disabled
    } = this.props;

    return (
      <div
        ref={(e) => { this.wrapper = e; }}
        className={this.getWrapperClases()}
        onClick={this.onWrapperClicked}
      >
        {this.renderLeftIcon()}
        { label && (
          <label className={this.getLabelClasses()} htmlFor={id}>
            { label }
          </label>
        )}
        {this.renderInput()}
        {
          error ? (
            <span className={`helper error ${disabled ? 'disabled' : ''}`}>
              { this.getHelperText() }
            </span>
          ) : null
        }
      </div>
    );
  }
}

export default TextField;
