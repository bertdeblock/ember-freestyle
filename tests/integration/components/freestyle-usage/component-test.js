import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import usage from '../../../pages/usage-component';

// Stub freestyle service

class FreestyleStub extends Service {
  ensureHljsTheme() {}
  highlight() {}
}

module('Integration | Component | freestyle usage', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:emberFreestyle', FreestyleStub);
    this.emberFreestyle = this.owner.lookup('service:emberFreestyle');
  });

  hooks.afterEach(function () {
    usage.removeContext();
  });

  test('it renders the block source', async function (assert) {
    this.set('emberFreestyle.showCode', true);

    await render(hbs`
      {{#freestyle-usage 'componentA'}}
        hello from component A
      {{/freestyle-usage}}
      `);

    assert.equal(usage.usageSection.source, 'Source hello from component A');
  });

  test('it renders the title and the focus button if a title is passed in and the guide is set to show labels', async function (assert) {
    assert.expect(3);

    this.set('emberFreestyle.showLabels', true);

    await render(hbs`
      {{#freestyle-usage 'componentA' title='Title A'}}
        hello from component A
      {{/freestyle-usage}}
      `);

    assert.equal(usage.numTitles, 1);
    assert.equal(usage.numFocusButtons, 1);
    assert.equal(usage.title, 'Title A');
  });

  test('it does not render the title if the guide is set to not show labels', async function (assert) {
    assert.expect(2);

    this.set('emberFreestyle.showLabels', false);

    await render(hbs`
      {{#freestyle-usage 'componentA' title='Title A'}}
        hello from component A
      {{/freestyle-usage}}
      `);

    assert.equal(usage.numTitles, 0);
    assert.equal(usage.numFocusButtons, 0);
  });

  test('it renders the passed in block', async function (assert) {
    assert.expect(1);

    await render(hbs`
      {{#freestyle-usage 'componentA'}}
        hello from component A
      {{/freestyle-usage}}
      `);

    assert.equal(usage.content, 'hello from component A');
  });

  test('it ignores blank lines when unindenting', async function (assert) {
    assert.expect(1);
    this.set('emberFreestyle.showCode', true);

    await render(hbs`
      <FreestyleUsage @slug='componentA'>
        {{this.indentedFarBeforeBlankLine}}

        {{this.afterBlankLine}}
      </FreestyleUsage>
    `);
    let rawSnippet = usage.usageSection.rawSource;

    assert.equal(
      rawSnippet.trim().split('\n').get('lastObject'),
      '{{this.afterBlankLine}}'
    );
  });

  test('it does not render anything if slug does not match the focus', async function (assert) {
    this.set('emberFreestyle.showCode', true);
    this.set('emberFreestyle.showLabels', true);

    // set focus to a different component
    this.set('emberFreestyle.focus', 'someOtherComponent');

    await render(hbs`
      {{#freestyle-usage 'componentA' title='Title A'}}
        hello from component A
      {{/freestyle-usage}}
      `);

    assert.equal(usage.numTitles, 0);
    assert.equal(usage.numFocusButtons, 0);
    assert.equal(usage.numCodeSection, 0);
  });

  test('it renders the passed in block for angle bracket components', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <FreestyleUsage @slug="componentA">
        hello from component A
      </FreestyleUsage>
      `);

    assert.equal(usage.content, 'hello from component A');
  });
});
