import React, { Component } from 'react';
import {
  bool,
  func,
  object,
  oneOfType,
  string
} from 'prop-types';
import Loader from 'components/common/loader';
import Link from 'components/common/link';

class Button extends Component {
  static propTypes = {
    className: string,
    isLarge: bool,
    onClick: func,
    text: oneOfType([string, object]),
    loading: bool,
    isDisabled: bool,
    isDefault: bool,
    isFull: bool,
    type: string,
    to: string
  };

  static defaultProps = {
    className: 'button',
    onClick: null,
    isLarge: null,
    loading: false,
    text: null,
    isDisabled: false,
    isDefault: false,
    isFull: false,
    type: 'button',
    to: null
  }

  clickHandler = this.clickHandler.bind(this);

  clickHandler(e) {
    const { onClick, loading, isDisabled } = this.props;
    if (onClick && !loading && !isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  }

  renderContent() {
    const {
      text,
      loading
    } = this.props;

    let color = 'white';

    if (loading) {
      return <Loader color={color} />;
    }

    return <span>{text}</span>;
  }

  render() {
    const {
      className,
      isFull,
      isLarge,
      isDisabled,
      isDefault,
      type,
      to,
      onClick,
      loading
    } = this.props;

    let finalClass = `button ${className}`;

    if (isLarge) finalClass += ' is-large';
    if (isFull) finalClass += ' is-full';
    if (isDisabled) finalClass += ' is-disabled';

    if (isDefault) finalClass += ' is-default';

    if (to) {
      return (
        <Link
          className={finalClass}
          to={!isDisabled ? to : null}
          onClick={onClick && !loading && !isDisabled ? this.clickHandler : null}
        >
          <span className="button-link-wrapper">
            {this.renderContent()}
          </span>
        </Link>
      );
    }

    return (
      <button
        className={finalClass}
        type={type}
        onClick={this.clickHandler}
        disabled={isDisabled}
      >
        {this.renderContent()}
      </button>
    );
  }
}

export default Button;
