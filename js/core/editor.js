window.LabEditor = {
    create(textarea, onChange) {
        const editor = CodeMirror.fromTextArea(textarea, {
            mode: 'htmlmixed',
            theme: 'dracula',
            lineNumbers: true,
            autoCloseTags: true,
            lineWrapping: true
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
