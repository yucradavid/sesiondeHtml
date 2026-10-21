window.LabEditor = {
    create(textarea, onChange) {
        const editor = CodeMirror.fromTextArea(textarea, {
            mode: 'htmlmixed',
            theme: 'dracula',
            lineNumbers: true,
            autoCloseTags: true,
            lineWrapping: true
        });
        editor.addKeyMap({
            Tab: cm => {
                const cursor = cm.getCursor();
                const line = cm.getLine(cursor.line).slice(0, cursor.ch);
                const match = line.match(/(^|\s)(![a-z]*|[a-z][a-z0-9]*(?:>[a-z][a-z0-9]*(?:\*\d+)?)?|\w+\*\d+)$/i);
                if (!match) return CodeMirror.Pass;

                const abbreviation = match[2].toLowerCase();
                const start = { line: cursor.line, ch: cursor.ch - abbreviation.length };
                let expansion;
                let cursorOffset;

                if (abbreviation === '!') {
                    expansion = '<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Mi página</title>\n</head>\n<body>\n  <!-- Escribe tu contenido aquí -->\n</body>\n</html>';
                    cursorOffset = expansion.indexOf('Escribe tu contenido aquí');
                } else {
                    const listMatch = abbreviation.match(/^(ul|ol)>li\*(\d+)$/);
                    const repeatedMatch = abbreviation.match(/^(h[1-6]|p|li)\*(\d+)$/);
                    if (listMatch) {
                        const tag = listMatch[1];
                        const count = Math.min(Number(listMatch[2]), 10);
                        expansion = `<${tag}>\n${Array.from({ length: count }, () => '  <li></li>').join('\n')}\n</${tag}>`;
                        cursorOffset = expansion.indexOf('<li>') + 4;
                    } else if (repeatedMatch) {
                        const tag = repeatedMatch[1];
                        const count = Math.min(Number(repeatedMatch[2]), 10);
                        expansion = Array.from({ length: count }, () => `<${tag}></${tag}>`).join('\n');
                        cursorOffset = tag.length + 2;
                    } else {
                        const tag = abbreviation;
                        const snippets = {
                            h1: '<h1></h1>',
                            h2: '<h2></h2>',
                            h3: '<h3></h3>',
                            p: '<p></p>',
                            ul: '<ul>\n  <li></li>\n</ul>',
                            ol: '<ol>\n  <li></li>\n</ol>',
                            li: '<li></li>',
                            header: '<header>\n  \n</header>',
                            main: '<main>\n  \n</main>',
                            section: '<section>\n  \n</section>',
                            article: '<article>\n  \n</article>',
                            footer: '<footer>\n  \n</footer>',
                            nav: '<nav>\n  \n</nav>',
                            div: '<div>\n  \n</div>',
                            strong: '<strong></strong>',
                            em: '<em></em>',
                            a: '<a href="">Texto del enlace</a>',
                            img: '<img src="" alt="">',
                            button: '<button></button>',
                            br: '<br>'
                        };
                        expansion = snippets[tag];
                        if (!expansion) return CodeMirror.Pass;
                        cursorOffset = expansion.indexOf('></') + 1;
                        if (tag === 'ul' || tag === 'ol') cursorOffset = expansion.indexOf('<li>') + 4;
                        if (['header', 'main', 'section', 'article', 'footer', 'nav', 'div'].includes(tag)) {
                            cursorOffset = expansion.indexOf('\n  \n') + 3;
                        }
                        if (tag === 'a') cursorOffset = expansion.indexOf('""') + 1;
                        if (tag === 'img') cursorOffset = expansion.indexOf('""') + 1;
                    }
                }

                const before = cm.getRange({ line: start.line, ch: 0 }, start);
                const indentation = before.match(/^\s*/)?.[0] || '';
                const formatted = expansion.split('\n').map((part, index) =>
                    index === 0 ? part : `${indentation}${part}`
                ).join('\n');
                cm.replaceRange(formatted, start, cursor);
                const cursorPosition = expansion.slice(0, cursorOffset).split('\n');
                cm.setCursor({
                    line: start.line + cursorPosition.length - 1,
                    ch: cursorPosition[cursorPosition.length - 1].length
                        + (cursorPosition.length === 1 ? start.ch : indentation.length)
                });
            }
        });
        editor.on('change', onChange);
        return editor;
    },

    initResizer() {
        const resizer = document.getElementById('drag-me');
        const leftSide = document.getElementById('panel-editor');
        const rightSide = document.getElementById('panel-preview');
        const workspace = resizer.parentNode;
        let startX = 0;
        let startWidth = 0;

        const stopResize = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            document.body.style.cursor = '';
            leftSide.style.userSelect = '';
            leftSide.style.pointerEvents = '';
            rightSide.style.pointerEvents = '';
        };

        const resize = event => {
            const dx = event.clientX - startX;
            const width = ((startWidth + dx) * 100) / workspace.getBoundingClientRect().width;
            leftSide.style.flex = `0 0 ${Math.max(15, Math.min(75, width))}%`;
        };

        resizer.addEventListener('mousedown', event => {
            startX = event.clientX;
            startWidth = leftSide.getBoundingClientRect().width;
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            document.body.style.cursor = 'col-resize';
            leftSide.style.userSelect = 'none';
            leftSide.style.pointerEvents = 'none';
            rightSide.style.pointerEvents = 'none';
        });
    }
};
