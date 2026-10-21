import {
    replyToHelpRequest,
    resolveHelpRequest,
    signInTeacher,
    signOutUser,
    updateClassControl,
    watchAuth,
    watchClassControl,
    watchHelpRequests,
    watchStudents
} from './supabase.js';
import { teacherEmail } from './supabase-config.js';

const sessionCatalog = [
    { id: 'sesion1', title: 'Sesión 1: Proyectos con HTML' },
    { id: 'sesion2', title: 'Sesión 2: Diseño (CSS)' }
];
let stopWatchingStudents;
let stopWatchingHelp;
let currentStudents = {};
let currentHelpRequests = {};

function showError(error) {
    console.error('Error en el panel docente:', error);
    const errorElement = document.getElementById('teacher-error');
    errorElement.textContent = error.message;
    errorElement.classList.remove('hidden');
}

function progressFor(student) {
    const progress = student.progress || {};
    const countCompleted = value => {
        if (value === true) return 1;
        if (!value || typeof value !== 'object') return 0;
        return Object.values(value).reduce((count, child) => count + countCompleted(child), 0);
    };
    const completed = countCompleted(progress);
    return { completed, points: completed * 10 };
}

function renderStudents(students) {
    currentStudents = students;
    const grid = document.getElementById('students-grid');
    grid.replaceChildren();
    const entries = Object.entries(students);
    document.getElementById('student-count').textContent =
        `Conectados: ${entries.filter(([, student]) => student.online).length} / ${entries.length}`;

    if (entries.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-slate-400';
        empty.textContent = 'Todavía no hay estudiantes registrados en esta clase.';
        grid.appendChild(empty);
        return;
    }

    entries.sort(([, left], [, right]) => Number(Boolean(right.online)) - Number(Boolean(left.online)));
    entries.forEach(([uid, student]) => {
        const card = document.createElement('article');
        card.className = 'student-card flex justify-between items-center gap-3';
        const details = document.createElement('div');
        const name = document.createElement('h2');
        name.className = 'text-white font-bold';
        name.textContent = `${student.avatar || '👤'} ${student.name || 'Estudiante'}`;
        const presence = document.createElement('p');
        presence.className = student.online ? 'text-sm text-green-400' : 'text-sm text-slate-400';
        presence.textContent = student.online ? 'Conectado ahora' : 'Desconectado';
        const helpState = document.createElement('p');
        helpState.className = 'text-xs text-amber-300';
        helpState.textContent = currentHelpRequests[uid]?.status === 'pending' ? 'Pidió ayuda' : '';
        const session = document.createElement('p');
        session.className = 'text-xs text-slate-400';
        session.textContent = `Sesión: ${student.sessionId || '—'}`;
        details.append(name, presence, helpState, session);

        const score = document.createElement('span');
        score.className = 'text-lg font-bold text-yellow-300';
        score.textContent = `${progressFor(student).points} pts`;
        card.append(details, score);

        grid.appendChild(card);
    });
}

function renderHelpRequests(requests) {
    currentHelpRequests = requests;
    const list = document.getElementById('help-requests');
    list.replaceChildren();
    const entries = Object.entries(requests).filter(([, request]) => request?.status);
    if (entries.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-slate-400';
        empty.textContent = 'No hay solicitudes de ayuda.';
        list.appendChild(empty);
        return;
    }

    entries.forEach(([studentId, request]) => {
        const card = document.createElement('article');
        card.className = 'student-card';
        const title = document.createElement('h3');
        title.className = 'font-bold text-white';
        const student = currentStudents[studentId];
        title.textContent = `${student?.avatar || '👤'} ${student?.name || 'Estudiante'} — ${request.status === 'pending' ? 'necesita ayuda' : 'respondida'}`;
        const message = document.createElement('p');
        message.className = 'my-2 text-slate-300';
        message.textContent = request.message || 'Solicita apoyo con la práctica.';
        card.append(title, message);
        if (request.teacherMessage) {
            const reply = document.createElement('p');
            reply.className = 'text-green-300';
            reply.textContent = `Tu respuesta: ${request.teacherMessage}`;
            card.appendChild(reply);
        }

        const actions = document.createElement('div');
        actions.className = 'flex gap-2 mt-3';
        if (request.status === 'pending') {
            const answerButton = document.createElement('button');
            answerButton.className = 'rounded bg-purple-600 px-3 py-2 text-sm text-white';
            answerButton.textContent = 'Responder';
            answerButton.addEventListener('click', async () => {
                const response = window.prompt(`Respuesta para ${student?.name || 'el estudiante'}:`);
                if (!response?.trim()) return;
                try {
                    await replyToHelpRequest(studentId, response.trim());
                } catch (error) {
                    showError(error);
                }
            });
            actions.appendChild(answerButton);
        }

        const resolveButton = document.createElement('button');
        resolveButton.className = 'rounded bg-slate-600 px-3 py-2 text-sm text-white';
        resolveButton.textContent = 'Cerrar solicitud';
        resolveButton.addEventListener('click', async () => {
            try {
                await resolveHelpRequest(studentId);
            } catch (error) {
                showError(error);
            }
        });
        actions.appendChild(resolveButton);
        card.appendChild(actions);
        list.appendChild(card);
    });
}

function subscribeToClass() {
    stopWatchingStudents?.();
    stopWatchingHelp?.();
    stopWatchingStudents = watchStudents(renderStudents, showError);
    stopWatchingHelp = watchHelpRequests(requests => {
        renderHelpRequests(requests);
        renderStudents(currentStudents);
    }, showError);
    watchClassControl(control => {
        document.getElementById('class-status').textContent = control.active
            ? `Práctica en curso: ${sessionCatalog.find(session => session.id === control.sessionId)?.title || control.sessionId}`
            : 'Práctica en pausa';
        document.getElementById('start-class').textContent = control.active ? 'Pausar práctica' : 'Dar comienzo a la práctica';
        document.getElementById('teacher-session').value = control.sessionId || sessionCatalog[0].id;
    }, showError);
}

window.TeacherPanel = {
    async login() {
        const email = document.getElementById('teacher-email').value.trim();
        const password = document.getElementById('teacher-pass').value;
        document.getElementById('teacher-error').classList.add('hidden');
        try {
            await signInTeacher(email, password);
        } catch (error) {
            showError(error);
        }
    },

    async toggleClass() {
        const button = document.getElementById('start-class');
        const isActive = button.textContent.trim() === 'Pausar práctica';
        try {
            await updateClassControl({
                active: !isActive,
                sessionId: document.getElementById('teacher-session').value
            });
        } catch (error) {
            showError(error);
        }
    },

    async logout() {
        try {
            await signOutUser();
        } catch (error) {
            showError(error);
        }
    }
};

try {
    watchAuth(user => {
        const isTeacher = user?.email === teacherEmail;
        document.getElementById('teacher-login').classList.toggle('hidden', isTeacher);
        document.getElementById('teacher-dashboard').classList.toggle('hidden', !isTeacher);
        if (isTeacher) subscribeToClass();
        else {
            stopWatchingStudents?.();
            stopWatchingHelp?.();
        }
    });
} catch (error) {
    showError(error);
}

const sessionSelector = document.getElementById('teacher-session');
sessionCatalog.forEach(session => {
    const option = document.createElement('option');
    option.value = session.id;
    option.textContent = session.title;
    sessionSelector.appendChild(option);
});
