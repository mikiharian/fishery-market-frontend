import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { array, bool, node, object, oneOfType, func, string } from 'prop-types';
import Icon from 'components/common/icon';

class Modal extends Component {
  static propTypes = {
    children: oneOfType([node, array, object]),
    show: bool.isRequired,
    title: string,
    onClose: func,
    closeOnOverlayClick: bool,
    className: string,
    containerClassName: string
  }

  static defaultProps = {
    title: '',
    onClose: null,
    children: null,
    closeOnOverlayClick: true,
    className: '',
    containerClassName: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      childrenRenderable: props.show,
      modalRenderable: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { show } = this.props;
    if (nextProps.show !== show) {
      const element = document.getElementsByClassName("page-container")[0];

      if (nextProps.show) {
        this.setState({
          modalRenderable: true
        }, () => {
          setTimeout(() => {
            this.setState({
              childrenRenderable: true
            });
            element.style.overflow = 'hidden';
          }, 300);
        });
      }
      setTimeout(() => {
        this.setState({
          childrenRenderable: false
        });
      }, 300);
      element.style.overflow = 'auto';
    }
  }

  closeHandling = this.closeHandling.bind(this);
  outsideClickListener = this.outsideClickListener.bind(this);
  modalClickPreventDefault = this.modalClickPreventDefault.bind(this);

  modalClickPreventDefault(e) {
    if (e) {
      e.stopPropagation();
    }
  }

  closeHandling() {
    const { onClose } = this.props;
    if (onClose) onClose();
  }

  outsideClickListener(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { closeOnOverlayClick } = this.props;
    if (closeOnOverlayClick) {
      this.closeHandling();
    }
  }

  renderContent() {
    const { children } = this.props;
    const { childrenRenderable } = this.state;
    if (childrenRenderable) {
      return children;
    }
    return null;
  }

  render() {
    const {
      show,
      title,
      className,
      containerClassName
    } = this.props;
    const { childrenRenderable, modalRenderable } = this.state;
    if (modalRenderable) {
      return createPortal(
        (
          <div
            className={`modal ${show && modalRenderable && childrenRenderable ? 'show' : ''} ${className}`}
            ref={(e) => { this.modalOverlay = e; }}
            onClick={this.modalClickPreventDefault}
          >
            <div className={`modal-container ${containerClassName}`}>
              <div className="modal-header">
                <p className="text is-size-hecto is-weight-semi-bold color is-txt is-dark">
                  {title}
                </p>
                <a onClick={this.closeHandling}>
                  <Icon type="close" width="24" height="24" />
                </a>
              </div>
              {this.renderContent()}
            </div>
            <div className="modal-overlay" onClick={this.outsideClickListener} />
          </div>
        ), document.body
      );
    }

    return null;
  }
}

export default Modal;
