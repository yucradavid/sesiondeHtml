import test from 'node:test';
import assert from 'node:assert/strict';
import { csvCell, serializeCsv } from '../js/core/teacher-report.js';

test('quotes and escapes CSV values', () => {
    assert.equal(csvCell('Ana "Luz"'), '"Ana ""Luz"""');
});

test('neutralizes spreadsheet formulas in user-controlled values', () => {
    assert.equal(csvCell('=HYPERLINK("https://example.com")'), '"\'=HYPERLINK(""https://example.com"")"');
    assert.equal(csvCell('  @SUM(A1:A2)'), '"\'  @SUM(A1:A2)"');
});

test('serializes a UTF-8 spreadsheet-friendly CSV with CRLF rows', () => {
    assert.equal(serializeCsv([['Nombre', 'Avance'], ['Ana', 50]]), '\uFEFF"Nombre","Avance"\r\n"Ana","50"');
});
