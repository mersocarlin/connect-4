module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "plugins": [
      "react"
  ],
  "rules": {
    "react/prop-types": 0,
    "react/jsx-boolean-value": 0,
    "consistent-return": 0,
    "space-before-function-paren": [2, { "anonymous": "never", "named": "always" }]
  }
};
