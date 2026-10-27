import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../js/core/supabase.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace(/^export /gm, '');
function setup() {
    const timers = new Map(); let next = 0;
    const context = vm.createContext({
        supabaseConfig: { url: 'https://test.invalid', anonKey: 'test' }, teacherEmail: 'teacher@example.test',
        setInterval(fn, delay) { assert.equal(delay, 10000); timers.set(++next, fn); return next; },
        clearInterval(id) { timers.delete(id); }
    });
    vm.runInContext(source, context);
    return { make: context.realtimeReadFallback, timers };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('channel failures poll once per interval and recover without duplicate warnings', async () => {
    const { make, timers } = setup(); let reads = 0; const errors = [];
    const watcher = make(async () => { reads++; }, error => errors.push(error), 'Clase');
    watcher.status('CHANNEL_ERROR'); await flush();
    watcher.status('TIMED_OUT'); watcher.status('CLOSED');
    assert.equal(timers.size, 1); assert.equal(errors.length, 1); assert.equal(reads, 1);
    [...timers.values()][0](); await flush(); assert.equal(reads, 2);
    watcher.status('SUBSCRIBED'); await flush();
    assert.equal(timers.size, 0); assert.equal(reads, 3);
    watcher.status('TIMED_OUT'); await flush(); assert.equal(timers.size, 1);
    watcher.stop(); watcher.status('CLOSED');
    assert.equal(timers.size, 0);
});

test('slow reads do not overlap and stopped watchers ignore later ticks', async () => {
    const { make, timers } = setup(); let reads = 0; let finish;
    const watcher = make(() => { reads++; return new Promise(resolve => { finish = resolve; }); }, () => {}, 'Clase');
    watcher.status('TIMED_OUT'); const tick = [...timers.values()][0];
    tick(); tick(); assert.equal(reads, 1);
    finish(); await flush(); tick(); assert.equal(reads, 2);
    watcher.stop(); finish(); await flush(); tick(); assert.equal(reads, 2);
});

test('read failures are reported instead of becoming unhandled rejections', async () => {
    const { make } = setup(); const error = new Error('Network unavailable'); const errors = [];
    const watcher = make(async () => { throw error; }, e => errors.push(e), 'Clase');
    await watcher.refresh(); assert.deepEqual(errors, [error]); watcher.stop();
});
