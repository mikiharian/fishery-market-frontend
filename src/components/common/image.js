import React, { Component } from 'react';
import {
  bool, func, number, oneOfType, string, shape
} from 'prop-types';
import SVG from 'react-inlinesvg';

const DEFAULT = '/static/images/placeholder.png';

class Image extends Component {
  static propTypes = {
    src: string,
    width: oneOfType([number, string]),
    height: oneOfType([number, string]),
    alt: string,
    className: string,
    onClick: func,
    inline: bool,
    srcSet: string
  }

  static defaultProps = {
    src: DEFAULT,
    width: '100%',
    height: null,
    alt: 'placeholder',
    className: '',
    onClick: null,
    inline: true,
    srcSet: null
  }

  onError = this.onError.bind(this);
  onClick = this.onClick.bind(this);

  onClick() {
    const { onClick } = this.props;
    if (onClick) onClick();
  }

  onError() {
    this.image.src = DEFAULT;
  }

  renderImage(source) {
    const {
      alt,
      className,
      width,
      height,
      srcSet
    } = this.props;
    return (
      <img
        ref={(e) => { this.image = e; }}
        onError={this.onError}
        className={className}
        src={source}
        width={width}
        height={height}
        alt={alt}
        onClick={this.onClick}
        srcSet={srcSet}
      />
    );
  }

  render() {
    const {
      alt,
      className,
      src,
      width,
      height,
      inline,
    } = this.props;

    let source = src || DEFAULT;
    if (source.endsWith('.svg')) {
      if (inline) {
        return (
          <SVG
            src={source}
            className={className}
            cachegetrequests="true"
            preProcessor={(file) => {
              const svgElement = new DOMParser().parseFromString(file, 'text/xml');
              let svg;
              if (svgElement) {
                svg = svgElement.querySelector('svg');
                svg.setAttribute('width', width);
                if (height) {
                  svg.setAttribute('height', height);
                }
              }
              return svg.outerHTML || file;
            }}
          >
            {this.renderImage(source)}
          </SVG>
        );
      }

      return (
        <embed
          ref={(e) => { this.image = e; }}
          onError={this.onError}
          className={className}
          src={source}
          width={width}
          alt={alt}
          onClick={this.onClick}
        />
      );
    }

    return this.renderImage(source);
  }
}

export default Image;
