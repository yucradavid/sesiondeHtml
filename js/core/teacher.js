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
import { createAvatarCharacter } from './avatar.js';

const sessionCatalog = [
    {
        id: 'sesion1',
        title: 'Sesión 1: Proyectos con HTML',
        projects: [
            { id: 'primera-pagina', title: '1. Mi primera página', missions: 3 },
            { id: 'portada', title: '2. Portada de película o libro', missions: 4 },
            { id: 'tarea-escolar', title: '3. Mi tarea escolar', missions: 5 },
            { id: 'cv', title: '4. Mi currículum', missions: 5 }
        ]
    },
    {
        id: 'sesion2',
        title: 'Sesión 2: Diseño (CSS)',
        projects: [
            { id: 'colores', title: '1. Primeros colores', missions: 3 },
            { id: 'tipografia', title: '2. Texto con personalidad', missions: 3 },
            { id: 'tarjetas', title: '3. Tarjetas y espacios', missions: 5 },
            { id: 'interaccion-responsive', title: '4. Interacción y diseño adaptable', missions: 4 }
        ]
    }
];
let stopWatchingStudents;
let stopWatchingHelp;
let currentStudents = {};
let currentHelpRequests = {};
let classIsActive = false;
let toastTimeout;

function showError(error) {
    console.error('Error en el panel docente:', error);
    const toast = document.getElementById('teacher-toast');
    toast.textContent = `No se pudo completar la operación: ${error.message}`;
    toast.classList.remove('hidden');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.add('hidden'), 6000);
    const errorElement = document.getElementById('teacher-error');
    if (!document.getElementById('teacher-login').classList.contains('hidden')) {
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');
    }
}

function completedMissions(progress, missionCount) {
    return Array.from({ length: missionCount }, (_, index) => Boolean(progress?.[`m${index + 1}`]))
        .filter(Boolean).length;
}

function progressFor(student, sessionId, projectId) {
    const session = sessionCatalog.find(item => item.id === sessionId);
    const savedProgress = student.progress?.[sessionId] || {};
    if (session?.projects?.length) {
        const projects = projectId === 'all'
            ? session.projects
            : session.projects.filter(project => project.id === projectId);
        const progress = projects.map(project => {
            const savedProject = savedProgress[project.id]
                || (project.id === session.projects[0].id
                    && Object.keys(savedProgress).some(key => /^m\d+$/.test(key))
                    ? savedProgress
                    : {});
            return {
                project,
                completed: completedMissions(savedProject, project.missions),
                total: project.missions
            };
        });
        return {
            completed: progress.reduce((total, item) => total + item.completed, 0),
            total: progress.reduce((total, item) => total + item.total, 0),
            projects: progress
        };
    }

    return {
        completed: completedMissions(savedProgress, session?.missions || 0),
        total: session?.missions || 0,
        projects: []
    };
}

function renderStudents(students) {
    currentStudents = students;
    const grid = document.getElementById('students-grid');
    grid.replaceChildren();
    const entries = Object.entries(students);
    const onlineCount = entries.filter(([, student]) => student.online).length;
    const sessionId = document.getElementById('teacher-session').value || sessionCatalog[0].id;
    const projectId = document.getElementById('teacher-project').value || 'all';
    const summaries = entries.map(([, student]) => progressFor(student, sessionId, projectId));
    const average = summaries.length
        ? Math.round(summaries.reduce((total, summary) => total + (summary.total ? summary.completed / summary.total : 0), 0) / summaries.length * 100)
        : 0;
    document.getElementById('student-count').textContent = `Conectados: ${onlineCount} / ${entries.length}`;
    document.getElementById('total-students').textContent = String(entries.length);
    document.getElementById('online-students').textContent = String(onlineCount);
    document.getElementById('average-progress').textContent = `${average}%`;
    document.getElementById('pending-help-count').textContent = String(
        Object.values(currentHelpRequests).filter(request => request?.status === 'pending').length
    );

    if (entries.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-slate-400';
        empty.textContent = 'Todavía no hay estudiantes registrados en esta clase.';
        grid.appendChild(empty);
        return;
    }

    const search = document.getElementById('student-search').value.trim().toLocaleLowerCase();
    const filter = document.getElementById('student-filter').value;
    const filteredEntries = entries.filter(([uid, student]) => {
        const matchesSearch = (student.name || '').toLocaleLowerCase().includes(search);
        const matchesFilter = filter === 'online' ? student.online
            : filter === 'help' ? currentHelpRequests[uid]?.status === 'pending'
                : true;
        return matchesSearch && matchesFilter;
    });
    filteredEntries.sort(([leftId, left], [rightId, right]) => {
        const leftNeedsHelp = currentHelpRequests[leftId]?.status === 'pending';
        const rightNeedsHelp = currentHelpRequests[rightId]?.status === 'pending';
        return Number(rightNeedsHelp) - Number(leftNeedsHelp)
            || Number(Boolean(right.online)) - Number(Boolean(left.online));
    });
    if (filteredEntries.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'text-slate-400';
        empty.textContent = 'No hay estudiantes que coincidan con este filtro.';
        grid.appendChild(empty);
        return;
    }
    const sessionTitle = sessionCatalog.find(session => session.id === sessionId)?.title || sessionId;
    filteredEntries.forEach(([uid, student]) => {
        const card = document.createElement('article');
        card.className = 'student-card flex justify-between items-center gap-3';
        const details = document.createElement('div');
        const identity = document.createElement('div');
        identity.className = 'teacher-student-identity';
        const avatar = createAvatarCharacter(student.avatar, student.name, 'roster');
        const name = document.createElement('h2');
        name.className = 'text-white font-bold';
        name.textContent = student.name || 'Estudiante';
        identity.append(avatar, name);
        const presence = document.createElement('p');
        presence.className = student.online ? 'text-sm text-green-400' : 'text-sm text-slate-400';
        presence.textContent = student.online ? 'Conectado ahora' : 'Desconectado';
        const helpState = document.createElement('p');
        helpState.className = 'text-xs text-amber-300';
        helpState.textContent = currentHelpRequests[uid]?.status === 'pending' ? 'Pidió ayuda' : '';
        const session = document.createElement('p');
        session.className = 'text-xs text-slate-400';
        const summary = progressFor(student, sessionId, projectId);
        session.textContent = `${sessionTitle}: ${summary.completed}/${summary.total} misiones completadas`;
        const projectProgress = document.createElement('p');
        projectProgress.className = 'mt-1 text-xs text-purple-200';
        projectProgress.textContent = summary.projects.length
            ? summary.projects.map(item => `${item.project.title.replace(/^\d+\.\s*/, '')}: ${item.completed}/${item.total}`).join(' · ')
            : 'Diseño (CSS)';
        const progressTrack = document.createElement('div');
        progressTrack.className = 'teacher-progress-track';
        progressTrack.setAttribute('role', 'progressbar');
        progressTrack.setAttribute('aria-label', `Avance de ${student.name || 'estudiante'}`);
        const progressFill = document.createElement('span');
        const percentage = summary.total ? Math.round(summary.completed / summary.total * 100) : 0;
        progressFill.style.width = `${percentage}%`;
        progressTrack.setAttribute('aria-valuenow', String(percentage));
        progressTrack.setAttribute('aria-valuemin', '0');
        progressTrack.setAttribute('aria-valuemax', '100');
        progressTrack.appendChild(progressFill);
        details.append(identity, presence, helpState, session, projectProgress, progressTrack);

        const score = document.createElement('span');
        score.className = 'text-lg font-bold text-yellow-300';
        score.textContent = `${percentage}% · ${summary.completed * 10} pts`;
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

    entries.sort(([, left], [, right]) => Number(right.status === 'pending') - Number(left.status === 'pending'));
    entries.forEach(([studentId, request]) => {
        const card = document.createElement('article');
        card.className = 'student-card';
        const title = document.createElement('h3');
        title.className = 'teacher-help-title font-bold text-white';
        const student = currentStudents[studentId];
        const avatar = createAvatarCharacter(student?.avatar, student?.name, 'roster');
        const studentName = document.createElement('span');
        studentName.textContent = `${student?.name || 'Estudiante'} — ${request.status === 'pending' ? 'necesita ayuda' : 'respondida'}`;
        title.append(avatar, studentName);
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
            const replyForm = document.createElement('form');
            replyForm.className = 'mt-3';
            const replyInput = document.createElement('textarea');
            replyInput.className = 'w-full rounded border border-slate-600 bg-slate-800 p-3 text-white';
            replyInput.rows = 2;
            replyInput.maxLength = 500;
            replyInput.placeholder = `Escribe una orientación para ${student?.name || 'el estudiante'}`;
            replyInput.setAttribute('aria-label', 'Respuesta del docente');
            const answerButton = document.createElement('button');
            answerButton.type = 'submit';
            answerButton.className = 'mt-2 rounded bg-purple-600 px-3 py-2 text-sm text-white';
            answerButton.textContent = 'Enviar respuesta';
            replyForm.append(replyInput, answerButton);
            replyForm.addEventListener('submit', async event => {
                event.preventDefault();
                const response = replyInput.value.trim();
                if (!response) {
                    replyInput.focus();
                    return;
                }
                answerButton.disabled = true;
                answerButton.textContent = 'Enviando…';
                try {
                    await replyToHelpRequest(studentId, response);
                } catch (error) {
                    showError(error);
                    answerButton.disabled = false;
                    answerButton.textContent = 'Enviar respuesta';
                }
            });
            card.appendChild(replyForm);
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
        const selectedSession = sessionCatalog.find(session => session.id === control.sessionId);
        const selectedProject = selectedSession?.projects.find(project => project.id === control.projectId);
        document.getElementById('class-status').textContent = control.active
            ? `Práctica en curso: ${selectedSession?.title || control.sessionId} · ${selectedProject?.title || 'todas las subsesiones'}`
            : 'Práctica en pausa';
        document.getElementById('start-class').textContent = control.active ? 'Pausar práctica' : 'Dar comienzo a la práctica';
        classIsActive = Boolean(control.active);
        document.getElementById('teacher-project-help').textContent = classIsActive
            ? 'La práctica está en curso. Paúsala para cambiar la sesión o la subsesión asignada.'
            : 'Elige una subsesión para trabajar solo en ella o habilita todas.';
        document.getElementById('teacher-session').value = control.sessionId || sessionCatalog[0].id;
        populateProjectSelector(control.sessionId || sessionCatalog[0].id, control.projectId || 'all');
        document.getElementById('teacher-session').disabled = classIsActive;
        document.getElementById('teacher-project').disabled = classIsActive
            || !(sessionCatalog.find(session => session.id === control.sessionId)?.projects?.length);
        renderStudents(currentStudents);
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
        button.disabled = true;
        try {
            await updateClassControl({
                active: !classIsActive,
                sessionId: document.getElementById('teacher-session').value,
                projectId: document.getElementById('teacher-project').value
            });
        } catch (error) {
            showError(error);
        } finally {
            button.disabled = false;
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

function populateProjectSelector(sessionId, selectedProjectId = 'all') {
    const selector = document.getElementById('teacher-project');
    const session = sessionCatalog.find(item => item.id === sessionId);
    const projects = session?.projects || [];
    selector.replaceChildren();

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = projects.length ? 'Todas las subsesiones' : 'Toda la sesión';
    selector.appendChild(allOption);
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.title;
        selector.appendChild(option);
    });

    selector.value = projects.some(project => project.id === selectedProjectId) ? selectedProjectId : 'all';
    selector.disabled = projects.length === 0;
}

populateProjectSelector(sessionSelector.value);
sessionSelector.addEventListener('change', () => {
    populateProjectSelector(sessionSelector.value);
    renderStudents(currentStudents);
});
document.getElementById('teacher-project').addEventListener('change', () => renderStudents(currentStudents));
document.getElementById('student-search').addEventListener('input', () => renderStudents(currentStudents));
document.getElementById('student-filter').addEventListener('change', () => renderStudents(currentStudents));
