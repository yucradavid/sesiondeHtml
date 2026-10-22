export function csvCell(value) {
    const text = String(value ?? '');
    const safeText = /^\s*[=+\-@]/.test(text) ? `'${text}` : text;
    return `"${safeText.replace(/"/g, '""')}"`;
}

export function serializeCsv(rows) {
    return `\uFEFF${rows.map(row => row.map(csvCell).join(',')).join('\r\n')}`;
}
