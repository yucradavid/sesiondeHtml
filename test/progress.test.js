import test from 'node:test';
import assert from 'node:assert/strict';
import { completedMissions, progressFor } from '../js/core/progress.js';

const catalog = [
    {
        id: 'sesion1',
        projects: [
            { id: 'first', missions: 3 },
            { id: 'second', missions: 2 }
        ]
    },
    { id: 'sesion2', missions: 2 }
];

test('counts completed missions only within the configured mission range', () => {
    assert.equal(completedMissions({ m1: true, m2: false, m3: true, m4: true }, 3), 2);
});

test('summarizes all projects and preserves legacy flat progress on the first project', () => {
    const result = progressFor(
        { progress: { sesion1: { m1: true, m2: false, m3: true } } },
        catalog,
        'sesion1',
        'all'
    );
    assert.equal(result.completed, 2);
    assert.equal(result.total, 5);
    assert.deepEqual(result.projects.map(project => project.completed), [2, 0]);
});

test('summarizes the selected project without including other project progress', () => {
    const result = progressFor(
        { progress: { sesion1: { first: { m1: true }, second: { m1: true, m2: true } } } },
        catalog,
        'sesion1',
        'first'
    );
    assert.equal(result.completed, 1);
    assert.equal(result.total, 3);
});

test('summarizes sessions without projects', () => {
    const result = progressFor(
        { progress: { sesion2: { m1: true, m2: true } } },
        catalog,
        'sesion2',
        'all'
    );
    assert.equal(result.completed, 2);
    assert.equal(result.total, 2);
    assert.deepEqual(result.projects, []);
});
