import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import freestyleGuide from '../pages/freestyle-guide';

module('Acceptance | section navigation', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    await freestyleGuide.visit();
  });

  test('verifying header', function (assert) {
    assert.expect(2);
    assert.equal(freestyleGuide.header.title, 'Ember Freestyle');
    assert.equal(freestyleGuide.header.subtitle, 'Living Style Guide');
  });

  test('verifying menu sections', async function (assert) {
    assert.expect(6);

    assert.equal(freestyleGuide.menu.sections.length, 6);
    assert.equal(freestyleGuide.menu.sections.objectAt(0).text, 'All');
    assert.equal(freestyleGuide.menu.sections.objectAt(1).text, 'Albums');
    assert.equal(freestyleGuide.menu.sections.objectAt(3).text, 'Foo Things');
    assert.equal(
      freestyleGuide.menu.sections.objectAt(4).text,
      'Dynamic Properties'
    );
    assert.equal(freestyleGuide.menu.sections.objectAt(5).text, 'Visual Style');
  });

  test('navigating directly to a subsection', function (assert) {
    assert.expect(6);
    let sectionFooThings = freestyleGuide.menu.sections.objectAt(3);
    assert.equal(sectionFooThings.subsections.length, 2);
    assert.equal(
      sectionFooThings.subsections.objectAt(0).text,
      'Foo Subsection A'
    );
    assert.equal(
      sectionFooThings.subsections.objectAt(1).text,
      'Foo Subsection B'
    );

    let sectionVisualStyle = freestyleGuide.menu.sections.objectAt(5);
    assert.equal(sectionVisualStyle.subsections.length, 2);
    assert.equal(sectionVisualStyle.subsections.objectAt(0).text, 'Typography');
    assert.equal(sectionVisualStyle.subsections.objectAt(1).text, 'Color');
  });

  module('with allowRenderingAllSections set to false', function (hooks) {
    hooks.beforeEach(async function () {
      let service = this.owner.lookup('service:ember-freestyle');
      service.allowRenderingAllSections = false;
    });
    test('verifying menu sections', async function (assert) {
      assert.expect(5);

      assert.equal(freestyleGuide.menu.sections.length, 5);
      assert.equal(freestyleGuide.menu.sections.objectAt(0).text, 'Albums');
      assert.equal(freestyleGuide.menu.sections.objectAt(2).text, 'Foo Things');
      assert.equal(
        freestyleGuide.menu.sections.objectAt(3).text,
        'Dynamic Properties'
      );
      assert.equal(
        freestyleGuide.menu.sections.objectAt(4).text,
        'Visual Style'
      );
    });
  });
});
