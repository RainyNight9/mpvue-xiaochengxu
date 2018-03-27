var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function getEntry (dir, entryFile) {
  const files = fs.readdirSync(dir)
  return files.reduce((res, k) => {
    const page = path.resolve(dir, k, entryFile)
    if (fs.existsSync(page)) {
      res[k] = page
    }
    return res
  }, {})
}

const appEntry = { app: resolve('./src/main.js') }
const pagesEntry = getEntry(resolve('./src/pages'), 'main.js')
const entry = Object.assign({}, appEntry, pagesEntry)

module.exports = {
  entry: entry,
  // entry: {
  //   app: resolve('./src/main.js'),               // app 字段被识别为 app 类型
  //   'list/main': resolve('./src/pages/list/main.js'),   // 其余字段被识别为 page 类型
  //   'page1/main': resolve('./src/pages/page1/main.js')
  // },
  target: require('mpvue-webpack-target'), // 改这里
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {    // 通过 alias 来覆盖原 vue.runtime 为我们改写过后的 mpvue.runtime
      'vue': 'mpvue',
      '@': resolve('src')
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'mpvue-loader',   // 改这里
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        include: [resolve('src'), resolve('test')],
        use: [    // 改这里
          'babel-loader',
          {
            loader: 'mpvue-loader',
            options: {
              checkMPEntry: true
            }
          },
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name]].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  }
}
