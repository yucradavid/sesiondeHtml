(function () {
    const DEMO_PASSWORD = 'admin123';

    function renderRecords() {
        const grid = document.getElementById('students-grid');
        grid.replaceChildren();
        const records = LabDB.getStudentRecords();
        if (records.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'text-slate-400';
            empty.textContent = 'Todavía no hay estudiantes guardados en este navegador.';
            grid.appendChild(empty);
            return;
        }

        records.forEach(data => {
            const card = document.createElement('article');
            card.className = 'student-card flex justify-between items-center';
            const details = document.createElement('div');
            const name = document.createElement('h2');
            name.className = 'text-white font-bold';
            name.textContent = data.name;
            const update = document.createElement('p');
            update.className = 'text-xs text-slate-400';
            update.textContent = `Visto: ${data.lastUpdate || 'Sin fecha'} | ${data.session || 'Sin sesión'}`;
            details.append(name, update);

            const progress = document.createElement('span');
            progress.className = 'text-lg font-bold text-blue-400';
            const completed = Object.values(data.state).filter(Boolean).length;
            const total = Object.keys(data.state).length;
            progress.textContent = `${completed}/${total}`;
            card.append(details, progress);
            grid.appendChild(card);
        });
    }

    window.TeacherPanel = {
        login() {
            const password = document.getElementById('teacher-pass').value;
            if (password !== DEMO_PASSWORD) {
                document.getElementById('login-error').classList.remove('hidden');
                return;
            }
            document.getElementById('teacher-login').classList.add('hidden');
            document.getElementById('teacher-dashboard').classList.remove('hidden');
            renderRecords();
        }
    };
})();
