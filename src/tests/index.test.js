import test from 'ava';
import sinon from 'sinon';
import h from 'vhtml';
import * as utils from '../utils';
/** @jsx h */

const renderTestApp = styled => {
  const terrestrialPlanets = ['Mercury', 'Venus', 'Earth', 'Mars'];

  const ListItem = ({ text }) => <li>{text}</li>;

  const Container = styled('div')`
    padding: 10px;
  `;

  const CenteredListElement = styled(ListItem)`
    text-align: center;
  `;

  const App = ({ data }) => (
    <section className="app-root">
      <h1 id="welcome-heading">Hi!</h1>

      <p>Here is a list of {data.length} planets:</p>
      <ul>
        {data.map(text => (
          <Container>
            <CenteredListElement text={text} />
          </Container>
        ))}
      </ul>
    </section>
  );

  return <App data={terrestrialPlanets} />;
};

test('scoped.generateID is public and callable', t => {
  const scoped = require('../index').default;

  t.true(scoped.generateID instanceof Function);
});

test.failing(
  'scoped.generateID returns different class names for each render in production and development env',
  t => {
    const scoped = require('../index').default;
    const stub = sinon.stub(scoped, 'generateID').callsFake(utils.generateID);

    const styled = scoped(h);
    const app = renderTestApp(styled);
    stub.restore();

    t.snapshot(app);
  }
);

test('scoped.generateID returns the same ids when DOM nodes remain untouched in test env', t => {
  const scoped = require('../index').default;
  const stub = sinon.stub(scoped, 'generateID').callsFake(utils.generateIDForTests);

  const styled = scoped(h);
  const app = renderTestApp(styled);
  stub.restore();

  t.snapshot(app);
});
