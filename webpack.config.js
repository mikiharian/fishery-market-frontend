const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src')
};

module.exports = (config = {}, param = {}) => {
  const { dev } = param;
  // Fixes npm packages that depend on `fs` module
  const configuration = config;

  configuration.node = {
    fs: 'empty'
  };

  configuration.resolve = {
    ...config.resolve,
    modules: ['node_modules', './src']
  };

  if (configuration.optimization) {
    configuration.optimization.splitChunks = {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 3,
      maxAsyncRequests: 5,
      maxInitialRequests: 20,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: 'framework',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          priority: 40
        },
        lib: {
          test(module) {
            return module.size() > 160000;
          },
          name(module) {
            return /node_modules\/(.*)/.exec(module.identifier())[1].replace(/\/|\\/g, '_');
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true
        },
        commons: {
          name: 'commons',
          chunks: 'async',
          minChunks: 3,
          priority: 20
        },
        shared: {
          name: false,
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    };
  }

  configuration.module = {
    rules: [
      ...configuration.module && configuration.module.rules ? configuration.module.rules : [],
      {
        test: /\.css$/,
        use: ['babel-loader?compact=false', 'raw-loader', {
          loader: 'postcss-loader',
          options: {
            sourceMap: dev
          }
        }]
      },
      {
        test: /\.s(a|c)ss$/,
        use: ['babel-loader?compact=false', 'raw-loader', {
          loader: 'postcss-loader',
          options: {
            sourceMap: dev ? 'inline' : false
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: dev,
            includePaths: ['styles', 'node_modules']
              .map((d) => path.join(__dirname, d))
              .map((g) => glob.sync(g))
              .reduce((a, c) => a.concat(c), [])
          }
        }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['@babel/react', { modules: false }]],
            plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties']
          }
        }]
      }
    ]
  };

  configuration.plugins = [
    ...(config.plugins || []),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/*`)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        STAGING: process.env.STAGING,
        TESTING: process.env.TESTING
      }
    })
  ];

  // If in Production add SW Register
  if (!dev) {
    const oldEntry = config.entry;
    configuration.entry = () => oldEntry().then((entry) => {
      if (entry['main.js']) entry['main.js'].push(path.resolve('./src/utils/swregister'));
      return entry;
    });
    configuration.plugins.push(new SWPrecacheWebpackPlugin({
      cacheId: 'next-ss',
      filepath: './src/static/sw.js',
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.next\//],
      runtimeCaching: [
        // Example with different handlers
        {
          handler: 'fastest',
          urlPattern: /[.](png|jpg|css|svg)/
        },
        {
          handler: 'networkFirst',
          urlPattern: /^http.*/ // cache all files
        },
        {
          handler: 'networkOnly',
          urlPattern: /(?=.*no-cache=true)^http/
        }
      ]
    }));
    configuration.plugins.push(new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8
    }));

    if (configuration.optimization) {
      configuration.optimization.minimizer = [
        new TerserPlugin({
          cache: true,
          parallel: true,
          test: /\.js(\?.*)?$/i
        })
      ];
    }
  }

  return configuration;
};
