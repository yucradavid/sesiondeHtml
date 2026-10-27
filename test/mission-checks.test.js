import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Carga los scripts de sesiones como lo hace el navegador, con una ventana mínima.
function loadSessionScripts(...files) {
    const context = vm.createContext({});
    context.window = context;
    files.forEach(file => {
        vm.runInContext(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), context, { filename: file });
    });
    return context;
}

function styleDoc(css, hasCard = true) {
    return { querySelector: selector => selector === '.tarjeta' && hasCard ? {} : null, querySelectorAll: selector => (selector === 'style' ? [{ textContent: css }] : []) };
}

const { MissionChecks, SessionRegistry } = loadSessionScripts(
    'js/sesiones/index.js',
    'js/sesiones/sesion1.js',
    'js/sesiones/sesion2.js'
);

test('matches a selector inside lists, descendants and compound selectors', () => {
    assert.equal(MissionChecks.selectorMatches('h1, h2', 'h1'), true);
    assert.equal(MissionChecks.selectorMatches('main>h1', 'h1'), true);
    assert.equal(MissionChecks.selectorMatches('article.tarjeta', '.tarjeta'), true);
    assert.equal(MissionChecks.selectorMatches('.tarjeta a:hover', 'a:hover'), true);
    assert.equal(MissionChecks.selectorMatches('h1:hover', 'h1'), false);
    assert.equal(MissionChecks.selectorMatches('.mi-tarjeta', '.tarjeta'), false);
});

test('rejects empty text and placeholder text', () => {
    const element = text => ({ textContent: text });
    assert.equal(MissionChecks.hasOwnText(element('  '), 'Ejemplo'), false);
    assert.equal(MissionChecks.hasOwnText(element(' Ejemplo '), 'Ejemplo'), false);
    assert.equal(MissionChecks.hasOwnText(element('Mi texto'), 'Ejemplo'), true);
    assert.equal(MissionChecks.countWithText([element('Idea'), element(''), element('Otra')]), 2);
});

test('finds CSS properties without confusing similar names', () => {
    assert.equal(MissionChecks.hasStyle(styleDoc('h1, h2 { color: red; }'), 'h1', 'color'), true);
    assert.equal(MissionChecks.hasStyle(styleDoc('h1 { background-color: red; }'), 'h1', 'color'), false);
    assert.equal(MissionChecks.hasStyle(styleDoc('.tarjeta { border-radius: 8px; }'), '.tarjeta', 'border'), false);
    assert.equal(MissionChecks.hasStyle(styleDoc('/* h1 { color: red; } */'), 'h1', 'color'), false);
});

test('distinguishes rules inside @media', () => {
    const css = '.tarjeta { margin: 4px; } @media (max-width: 600px) { .tarjeta { padding: 2px; } }';
    assert.equal(MissionChecks.hasStyle(styleDoc(css), '.tarjeta', '*', { inMedia: true }), true);
    assert.equal(
        MissionChecks.hasStyle(styleDoc('.tarjeta { margin: 4px; }'), '.tarjeta', '*', { inMedia: true }),
        false
    );
});

test('every mission has a title, an instruction, two hints and a validator', async () => {
    for (const { id } of SessionRegistry.catalog) {
        const session = await SessionRegistry.load(id);
        assert.ok(session.purpose && session.closing.length, `${id} necesita propósito y cierre`);
        session.projects.forEach(project => {
            assert.ok(project.learn.length && project.minutes, `${project.id} necesita «aprenderás» y tiempo`);
            assert.ok(project.idea, `${project.id} necesita una idea clave`);
            [project.video, ...project.missions.map(mission => mission.video)].filter(Boolean).forEach(video => {
                assert.match(video.youtubeId, /^[\w-]{11}$/, `${project.id} tiene un video con id inválido`);
                assert.ok(video.title, `${project.id} tiene un video sin título`);
            });
            project.missions.forEach((mission, index) => {
                assert.equal(mission.id, `m${index + 1}`, `${project.id} debe numerar sus misiones en orden`);
                assert.ok(mission.title && mission.desc, `${project.id}/${mission.id} necesita texto`);
                assert.equal(mission.hints.length, 2, `${project.id}/${mission.id} necesita dos pistas`);
                assert.equal(typeof mission.validate, 'function');
            });
        });
    }
});

test('CSS missions fail on the starter and pass with a complete solution', async () => {
    const session = await SessionRegistry.load('sesion2');
    const solution = `
        body { background-color: lightyellow; font-family: Verdana, sans-serif; line-height: 1.6; }
        h1 { color: purple; text-align: center; }
        p { color: #334155; font-size: 18px; }
        .tarjeta { border: 2px solid #6366f1; border-radius: 12px; padding: 16px; margin: 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
        button { background-color: #10b981; color: white; }
        a:hover { color: crimson; }
        button:focus-visible { outline: 3px solid orange; }
        @media (max-width: 600px) { .tarjeta { margin: 8px; } }
    `;
    session.projects.forEach(project => {
        const starter = styleDoc(project.baseHTML.match(/<style>([\s\S]*)<\/style>/)?.[1] || '');
        project.missions.forEach(mission => {
            assert.equal(mission.validate(starter), false, `${project.id}/${mission.id} no debe cumplirse al inicio`);
            assert.equal(mission.validate(styleDoc(solution)), true, `${project.id}/${mission.id} debe aceptar la solución`);
        });
    });
});

test('the hover challenge accepts the link or the button', async () => {
    const session = await SessionRegistry.load('sesion2');
    const hoverMission = session.projects.find(project => project.id === 'interaccion-responsive').missions[1];
    assert.equal(hoverMission.validate(styleDoc('button:hover { background-color: #047857; }')), true);
    assert.equal(hoverMission.validate(styleDoc('a:hover { color: crimson; }')), true);
    assert.equal(hoverMission.validate(styleDoc('a :hover { color: crimson; }')), false);
});


test('HTML practice starts empty and has a separate complete model', async () => {
    const session = await SessionRegistry.load('sesion1');
    for (const project of session.projects) {
        assert.equal(project.baseHTML, '');
        assert.match(project.exampleHTML, /<h1>/);
        assert.match(project.exampleHTML, /<p>/);
    }
});

test('a CSS class rule needs its HTML connection', async () => {
    const session = await SessionRegistry.load('sesion2');
    const mission = session.projects.find(p => p.id === 'tarjetas').missions[0];
    assert.equal(mission.validate(styleDoc('.tarjeta { border: 2px solid blue; }', false)), false);
    assert.equal(mission.validate(styleDoc('.tarjeta { border: 2px solid blue; }', true)), true);
    assert.doesNotMatch(session.baseHTML, /class="tarjeta"/);
});


test('each subsession includes explanation, debugging and transfer prompts', async () => {
    for (const entry of SessionRegistry.catalog) {
        const session = await SessionRegistry.load(entry.id);
        for (const project of session.projects) {
            assert.equal(project.understanding.length, 3, project.id);
            assert.ok(project.understanding.every(prompt => typeof prompt === 'string' && prompt.trim().length > 20));
        }
    }
});
