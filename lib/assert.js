var assert = require('assert');
var React = require('react');

var REACT_ATTR_REGEX = /\s+data-react[-\w]+=".*?"/g;
var TOKEN_REGEX = /(\*)|(\+)|(\s+)/g;
var ESCAPE_REGEX = /[<>\/\\?=^$]/g;

function renderToString(Component, props) {
  return React
    .renderToString(React.createElement(Component, props))
    .replace(REACT_ATTR_REGEX, '');
}

function buildRegEx(text) {
  return new RegExp(text
    .replace(ESCAPE_REGEX, '\\$&')
    .replace(TOKEN_REGEX, function (matcher, star, plus, space) {
      if (star) {
        return '.*';
      }

      if (plus) {
        return '[^<>]+';
      }

      if (space) {
        return ' ';
      }
  }));
}

/**
 * Assert component render matches the expectedHTML
 * @method assertRender
 *
 * @param {ReactComponent} Component class
 * @param {Object} props used to initialize the component
 * @param {String} expectedHTML can contain wildcards "+" or "*"
 *
 * @example
 * // The code bellow will raise an error unless the component renders
 * // a div with any attributes and the string "something" inside any
 * // inner element.
 * assertRender(MyComponent, {}, "<div+>*something*</div>");
 **/
function assertRender(Component, props, expectedHTML) {
  var expected = renderToString(Component, props);
  var regEx = buildRegEx(expectedHTML);

  assert(
    regEx.test(expected),
    'Expected: ' + expected + ' to match: ' + regEx
  );
}

/**
 * Assert component render to not matches the unexpectedHTML
 * @method assertNotRender
 *
 * @param {ReactComponent} Component class
 * @param {Object} props used to initialize the component
 * @param {String} unexpectedHTML can contain wildcards "+" or "*"
 *
 * @example
 * // The code bellow will raise an error if the component renders
 * // a div with any attributes and the string "something" inside any
 * // inner element.
 * assertNotRender(MyComponent, {}, "<div+>*something*</div>");
 **/
function assertNotRender(Component, props, unexpectedHTML) {
  var expected = renderToString(Component, props);
  var regEx = buildRegEx(unexpectedHTML);

  assert(
    !regEx.test(expected),
    'Expected: ' + expected + ' to NOT match: ' + regEx
  );
}

module.exports = {
  renderMatch: assertRender,
  renderNotMatch: assertNotRender
};
