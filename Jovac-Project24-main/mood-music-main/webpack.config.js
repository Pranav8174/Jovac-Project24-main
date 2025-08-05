module.exports = {
    // ... other configurations ...
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/face-api\.js/,
          use: 'source-map-loader',
        },
      ],
    },
  };