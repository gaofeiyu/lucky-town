module.exports = {
  "root": true, // 保证其他文件夹的eslint设置不影响本项目
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "commonjs": true,
    "es6": true
  },
  "globals": {
    "orbit": true,
    "Promise": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "plugins": [
    "babel",
    "react",
  ],
  "rules": {
    "strict": "off",
    "eqeqeq": ["error", "always", {"null": "ignore"}],
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": ["error", { "args": "after-used" }],

    // react
    "react/react-in-jsx-scope": "off",
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['public', './public'],
          ['styles', './public/styles'],
          ['views', './public/views'],
        ],
        extensions: ['.ts', '.js', '.tsx', '.json']
      }
    }
  }
};
