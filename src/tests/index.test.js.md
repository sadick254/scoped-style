# Snapshot report for `src/index.test.js`

The actual snapshot is saved in `index.test.js.snap`.

Generated by [AVA](https://ava.li).

## scoped.generateID returns different class names for each render in production and development env

> Snapshot 1

    '<section className="app-root"><h1 id="welcome-heading">Hi!</h1><p>Here is a list of 4 planets:</p><ul><div children="&lt;li&gt;Mercury&lt;/li&gt;" class="TfqfkRn "><li>Mercury</li></div><div children="&lt;li&gt;Venus&lt;/li&gt;" class="TfqfkRn "><li>Venus</li></div><div children="&lt;li&gt;Earth&lt;/li&gt;" class="TfqfkRn "><li>Earth</li></div><div children="&lt;li&gt;Mars&lt;/li&gt;" class="TfqfkRn "><li>Mars</li></div></ul></section>'

## scoped.generateID returns the same ids when DOM nodes remain untouched in test env

> Snapshot 1

    '<section className="app-root"><h1 id="welcome-heading">Hi!</h1><p>Here is a list of 4 planets:</p><ul><div children="&lt;li&gt;Mercury&lt;/li&gt;" class="c1 "><li>Mercury</li></div><div children="&lt;li&gt;Venus&lt;/li&gt;" class="c1 "><li>Venus</li></div><div children="&lt;li&gt;Earth&lt;/li&gt;" class="c1 "><li>Earth</li></div><div children="&lt;li&gt;Mars&lt;/li&gt;" class="c1 "><li>Mars</li></div></ul></section>'