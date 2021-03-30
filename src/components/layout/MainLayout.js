import React from 'react';
import { withRouter } from 'next/router';

import Head from 'components/layout/Head';
import Header from 'components/layout/Header';

const Wrapper = ({
  component = null,
  props = {}
}) => {
  class MainLayout extends component {
    static async getInitialProps(ctx) {
      const { isServer } = ctx;

      console.clear(); // Clear console before starting new page

      return {
        ...(component.getInitialProps ?
          await component.getInitialProps(ctx, isServer) : {})
      };
    }

    render() {
      const Component = component;
      const componentProps = {
        head: {},
        ...props,
        ...this.props
      };

      const { head } = componentProps;

      return (
        <div className="main-layout">
          <Head
            title={head.title}
            description={head.description}
            url={head.url}
            ogImage={head.ogImage}
            keywords={head.keywords}
          />
          <Header title={componentProps.title} />
          <div className={`page-container ${componentProps.pageWrapperClassName || ''}`}>
            <Component {...this.props} />
          </div>
        </div>
      );
    }
  }

  return withRouter(MainLayout);
};


export default Wrapper;
