import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

test('observation stays outside practice, respects pause and saves the empty start', () => {
    const elements = new Map();
    const storage = new Map();
    const context = vm.createContext({
        console,
        document: { getElementById(id) { if (!elements.has(id)) elements.set(id, {}); return elements.get(id); } },
        createAvatarValue: () => '', createAvatarSeed: () => '',
        setTimeout: () => 1, clearTimeout() {}, addEventListener() {},
        localStorage: { setItem: (key, value) => storage.set(key, value) }
    });
    context.window = context;
    const source = readFileSync(new URL('../js/core/app.js', import.meta.url), 'utf8');
    vm.runInContext(source.slice(source.indexOf('(function () {')), context);
    const app = context.SystemApp;
    let readOnly, focused = false;
    app.editor = { setOption: (_, value) => { readOnly = value; }, getValue: () => '', focus: () => { focused = true; } };
    app.studentId = 'test';
    app.currentProject = 'primera-pagina';
    app.currentProjectData = { exampleHTML: '<h1>Modelo</h1>' };
    app.observingExample = true;
    app.renderExample();
    assert.equal(elements.get('example-code').textContent, '<h1>Modelo</h1>');
    assert.equal(readOnly, true);
    app.startPractice();
    assert.equal(app.observingExample, true);
    app.classControl.active = true;
    app.startPractice();
    assert.equal(elements.get('worked-example').hidden, true);
    assert.equal(elements.get('example-code').textContent, '');
    assert.equal(elements.get('example-preview').srcdoc, '');
    assert.equal(readOnly, false);
    assert.equal(focused, true);
    assert.equal(storage.get(app.codeKey(app.currentProject)), '');
    assert.deepEqual(Object.keys(app.state), []);
});
