# Scoped Style

Scoped style is a next gen tiny css-in-js library to help you style your components. Use the full power of css that you are used to.

## Works With

- React
- Preact
- Hyperapp
- Infernojs

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
  :hover {
    padding: 10px;
  }
`

const App = () => (
  <div>
    <Button primary>Login</Button>
  </div>
)

// Your rendering code

```