import React, { Component } from 'react';
import { withRouter } from 'next/router';
import {
  array,
  bool,
  func,
  number,
  object,
  objectOf,
  oneOfType,
  string
} from 'prop-types';
import { Router } from 'utils/routes';

class Link extends Component {
  static propTypes = {
    children: oneOfType([array, number, object, string]),
    router: objectOf(oneOfType([string, object, func, bool])),
    to: string,
    blank: bool,
    className: string,
    param: objectOf(string),
    onClick: func,
    prefetch: bool,
    disabled: bool,
    style: objectOf(oneOfType([string, number]))
  }

  static defaultProps = {
    children: null,
    router: null,
    to: '',
    blank: false,
    className: '',
    param: {},
    onClick: null,
    prefetch: false,
    disabled: false,
    style: {}
  }

  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      to,
      blank,
      param,
      onClick,
      prefetch,
      disabled
    } = this.props;
    if (onClick && !disabled) {
      onClick(event);
    } else if (to && !disabled) {
      if (prefetch) {
        Router.prefetch(to);
      } else {
        if (blank) {
          window.open(to, '_blank');
        } else {
          Router.pushRoute(to, param);
        }
      }
    }
  }

  render() {
    const {
      children, router, to, className, param, style, disabled
    } = this.props;
    let link = to;
    if (param && Object.keys(param).length) {
      const query = Object.keys(param)
        .map(key => `${key}=${param[key]}`)
        .join('&');
      link = `${link}?${query}`;
    }

    const active = router && router.asPath === to;
    let classes = className;
    if (active) classes += ' active';
    if (disabled) classes += ' cursor-not-allowed';

    return (
      <a href={link} onClick={this.clickHandler} className={classes} style={style}>
        {children}
      </a>
    );
  }
}

export default withRouter(Link);
