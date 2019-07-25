# Scoped Style

Scoped style is a next gen tiny css-in-js library to help you style your components. Use the full power of css that you are used to.

## Works With

- [React](https://reactjs.org/)
- [Preact](https://preactjs.com/)
- [Hyperapp](https://github.com/jorgebucaran/hyperapp)
- [Inferno](https://infernojs.org/)

## Installation

```cmd
npm i scoped-style
// or
yarn add scoped-style
```

## Usage

```javascript
import scoped from "scoped-style"

// for react
import React from "react"
const styled = scoped(React.createElement)
//

// for Preact
import { h } from "preact"
const styled = scoped(h)
//

// for Hyperapp
import { h } from "hyperapp"
const styled = scoped(h)
//

// for Infernojs
import { createElement } from 'inferno-create-element';
const styled = scoped(createElement);
//

// define global css
styled.global`
  * {
    margin: 0;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }
`;

// and scoped css
const Button = styled("button")`
  background: ${props => props.primary ? "orange": "gray"};
  border: none;
  border-radius: 2px;
  :hover, :focus, :active {
    padding: 10px;
  }
  @media screen and (max-width: 640px) {
    background: blue;
    :hover, :focus, :active {
      padding: 5px;
    }
  }
`

// keyframes
const spin = styled.keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled('div')`
  border: 3px solid hsla(185, 100%, 62%, 0.2);
  border-top-color: #3cefff;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: ${() => spin} 1s linear infinite;
`;

// styling children
const BlueChildren = styled('div')`
  > * {
    color: blue;
  }
`;

const App = ({ children }) => (
  <div>
    <Button primary>Login</Button>
    <Loader/>
    <BlueChildren>{children}</BlueChildren>
  </div>
);

// Your rendering code

```

## Support and limitations

### Combinators

Supported :
* [Adjacent sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator) : `+`
* [General sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator) : `~`
* [Child combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator) : `>`

Not supported :
* [Descendant combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator)
* [Column combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Column_combinator)

### Selectors

Selectors must be used in with a combinator.

We support them all :
* [Type selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors)
* [Class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)
* [ID selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors)
* [Universal selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors)
* [Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)

### Pseudo selectors

We support them all.

Warning, if you are using the `content` property : special characters (like `◀`) are not suppoted, you must convert them (via [http://enc.joyho.net/](http://enc.joyho.net/) for example) and it will work (`content: "\\25C0";`).

## Questions, bugs and feature requests

You have a question about usage, feel free to open an issue.

You found a bug, feel free to open an issue.

You've got a feature requests, feel free to open an issue.

## Advanced example : radio button, checkbox

```javascript
const Label = styled('label')`
    position: relative;
    padding-left: 2rem;
    padding-right: 0.75rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    user-select: none;

    > input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    > input[type="checkbox"] ~ span {
        position: absolute;
        top: 0.2rem;
        left: 0;
        height: 1rem;
        width: 1rem;
        background-color: #eee;
    }

    > input[type="radio"] ~ span {
        position: absolute;
        top: 0.2rem;
        left: 0;
        height: 1rem;
        width: 1rem;
        background-color: #eee;
        border-radius: 50%;
    }

    :hover > input ~ span {
        background-color: #ccc;
        transition: .2s;
    }

    > input:checked ~ span {
        background-color: #0080b3;
    }

    :active > span {
        transform: scale(0);
    }

    > span:after {
        content: "";
        position: absolute;
        display: none;
    }

    > input:checked ~ span:after {
        display: block;
    }

    > input[type="checkbox"] ~ span:after {
        left: 0.25rem;
        top: 0.05rem;
        width: 0.25rem;
        height: 0.6rem;
        border: solid white;
        border-width: 0 0.2rem 0.2rem 0;
        transform: rotate(45deg);
    }

    > input[type="radio"] ~ span:after {
        left: 0.3rem;
        top: 0.3rem;
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        background: white;
    }
`;

const Radio = ({ name, checked, onChange }) => (
    <Label>
        {name}
        <input type="radio" checked={checked} onChange={onChange} />
        <span></span>
    </Label>
);

const Checkbox = ({ name, checked, onChange }) => (
    <Label>
        {name}
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span></span>
    </Label>
);
```

## Scoped function second parameter

```javascript
import scoped from "scoped-style"
```

`scoped` can take a second parameter : a callback who "render" the css generated by `styled` function.

The default callback is exported via `scoped.defaultCallback`.

### SSR example

Client :

```javascript
import { createElement } from 'inferno-create-element';
import scoped from './scoped-style';

if (typeof global !== 'undefined') {
    global.scopedStyleCSS == '';
}

const styler = (css) => {
    if (typeof document !== 'undefined') {
        scoped.defaultCallback(css);
    } else if (typeof global !== 'undefined') {
        global.scopedStyleCSS += css;
    }
};

export const styled = scoped(createElement, styler);
```

Server :

```javascript
app.get('*', (req, res) => {
  // first render the root component to string via the SSR function of your framework
  const content = renderToString(<App {...props} />);
  res.send(`
    <!DOCTYPE html>
    <html>

    <head>
      <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">
      <meta content="text/html; charset=utf-8">
      <title>
        Citral
      </title>
      <style type="text/css">
        ${global.scopedStyleCSS/* then use the generated styles string */}
      </style>
    </head>

    <body>
      ${content}
      <script type="text/javascript" src="${fs.readdirSync(path.join(__dirname, 'client')).find(file => /^[a-z0-9]+\.bundle\.js$/.test(file))}"></script>
    </body>

    </html>
  `);
});
```
