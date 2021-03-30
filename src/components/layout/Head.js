import React from 'react';
import NextHead from 'next/head';
import { string } from 'prop-types';
import globalStyle from 'styles/bundle.scss';

const Head = ({
  description, title, url, ogImage, keywords
}) => (
  <NextHead>
    <title>
      { title || 'Fishery Market' }
    </title>
    <meta charSet="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title || ''} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="theme-color" content="#FFFFFF" />
    <meta name="keywords" content={keywords} />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" href="/static/favicon.png" />
    <style dangerouslySetInnerHTML={{ __html: globalStyle }} />
  </NextHead>
);

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string,
  keywords: string
};

Head.defaultProps = {
  title: null,
  description: '',
  ogImage: '',
  url: '',
  keywords: ''
};

export default Head;
