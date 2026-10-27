import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../js/core/supabase.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '')
    .replace(/^export /gm, '');
const completion = { sessionId: 'sesion1', projectId: 'primera-pagina', missionId: 'm1' };
function harness({ user = { id: 'student-a', is_anonymous: true }, error = null, authError = null } = {}) {
    const rows = [];
    const client = {
        auth: { getUser: async () => ({ data: { user }, error: authError }) },
        from(table) {
            assert.equal(table, 'mission_completions');
            // No SELECT ni UPSERT: el estudiante solo puede insertar su historial.
            return { insert: async row => { rows.push(JSON.parse(JSON.stringify(row))); return { error }; } };
        }
    };
    const context = vm.createContext({
        createClient: () => client,
        supabaseConfig: { url: 'https://test.invalid', anonKey: 'test' },
        teacherEmail: 'teacher@example.test'
    });
    vm.runInContext(source, context);
    return { record: context.recordMissionCompletion, rows };
}

test('student records a completion without read or update access', async () => {
    const { record, rows } = harness();
    await record('student-a', completion);
    assert.deepEqual(rows, [{ student_id: 'student-a', session_id: 'sesion1', project_id: 'primera-pagina', mission_id: 'm1' }]);
});

test('repeating the same mission tolerates only its unique index conflict', async () => {
    const { record } = harness({ error: { code: '23505', message: 'duplicate key value violates unique constraint "mission_completions_student_mission_idx"' } });
    await record('student-a', completion);
});

test('RLS, network, foreign key and unrelated uniqueness errors remain visible', async () => {
    for (const error of [
        { code: '42501', message: 'new row violates row-level security policy' },
        { code: '23503', message: 'foreign key violation' },
        { code: '23505', message: 'duplicate key value violates unique constraint "mission_completions_pkey"' },
        { message: 'Failed to fetch' }
    ]) {
        const { record } = harness({ error });
        await assert.rejects(record('student-a', completion), received => received === error);
    }
});

test('another student, teacher and missing login cannot submit a completion', async () => {
    for (const user of [{ id: 'student-b', is_anonymous: true }, { id: 'teacher', is_anonymous: false }, null]) {
        const { record, rows } = harness({ user });
        await assert.rejects(record('student-a', completion));
        assert.equal(rows.length, 0);
    }
});
