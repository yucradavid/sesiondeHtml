import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { supabaseConfig, teacherEmail } from './supabase-config.js';

const isConfigured = Boolean(
    supabaseConfig.url &&
    supabaseConfig.anonKey &&
    teacherEmail &&
    !Object.values(supabaseConfig).some(value => value.startsWith('REEMPLAZAR_')) &&
    !teacherEmail.startsWith('REEMPLAZAR_')
);

let client;

function getSupabase() {
    if (!isConfigured) {
        throw new Error('Supabase aún no está configurado. Sigue los pasos de arquitectura_modular_del_laboratorio.md.');
    }
    if (!client) client = createClient(supabaseConfig.url, supabaseConfig.anonKey);
    return client;
}

function throwIfError(error) {
    if (error) throw error;
}

async function currentUser() {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.getUser();
    throwIfError(error);
    if (!data.user) throw new Error('Inicia sesión para realizar esta acción.');
    return data.user;
}

function isTeacher(user) {
    return user?.email?.toLowerCase() === teacherEmail.toLowerCase();
}

export function isSupabaseConfigured() {
    return isConfigured;
}

export async function signInStudent() {
    const supabase = getSupabase();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    throwIfError(sessionError);
    const activeUser = sessionData.session?.user;
    if (activeUser?.is_anonymous) return activeUser;
    if (activeUser) {
        const { error } = await supabase.auth.signOut();
        throwIfError(error);
    }
    const { data, error } = await supabase.auth.signInAnonymously();
    throwIfError(error);
    if (!data.user) throw new Error('Supabase no devolvió la sesión del estudiante.');
    return data.user;
}

export async function resumeStudent() {
    const supabase = getSupabase();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    throwIfError(sessionError);
    const user = sessionData.session?.user;
    if (!user?.is_anonymous) return null;

    const { data: profile, error } = await supabase
        .from('students')
        .select('name, avatar, progress')
        .eq('id', user.id)
        .maybeSingle();
    throwIfError(error);
    return profile ? { user, profile } : null;
}

export async function signInTeacher(email, password) {
    const supabase = getSupabase();
    if (email.trim().toLowerCase() !== teacherEmail.toLowerCase()) {
        throw new Error(`Usa la cuenta docente configurada: ${teacherEmail}`);
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email: teacherEmail,
        password
    });
    throwIfError(error);
    if (!data.user || !isTeacher(data.user)) {
        await supabase.auth.signOut();
        throw new Error('La cuenta no tiene acceso de docente.');
    }
    return data.user;
}

export async function signOutUser() {
    const { error } = await getSupabase().auth.signOut();
    throwIfError(error);
}

export function watchAuth(callback) {
    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
    });
    return () => subscription.unsubscribe();
}

export async function enterClassroom(user, name, avatar) {
    const supabase = getSupabase();
    const { data: previous, error: readError } = await supabase
        .from('students')
        .select('name, avatar, progress')
        .eq('id', user.id)
        .maybeSingle();
    throwIfError(readError);

    const { data: control, error: controlError } = await supabase
        .from('classroom_control')
        .select('session_id')
        .eq('id', 1)
        .maybeSingle();
    throwIfError(controlError);

    const studentName = name.trim() || previous?.name;
    if (!studentName) throw new Error('Escribe tu nombre para crear tu cuenta de estudiante.');
    const studentAvatar = avatar || (previous?.avatar && previous.avatar.includes(':')
        ? previous.avatar
        : 'adventurer:student');
    const { error } = await supabase.from('students').upsert({
        id: user.id,
        name: studentName,
        avatar: studentAvatar,
        session_id: control?.session_id || 'sesion1',
        progress: previous?.progress || {},
        updated_at: new Date().toISOString()
    });
    throwIfError(error);
    return {
        name: studentName,
        avatar: studentAvatar,
        progress: previous?.progress || {},
        sessionId: control?.session_id || 'sesion1'
    };
}

export function watchClassControl(callback, onError) {
    const supabase = getSupabase();
    let channel;
    let active = true;
    const publish = async () => {
        const { data, error } = await supabase
            .from('classroom_control')
            .select('active, session_id, project_id, updated_at')
            .eq('id', 1)
            .maybeSingle();
        if (error) {
            onError?.(error);
            return;
        }
        if (active) callback(data
            ? { active: data.active, sessionId: data.session_id, projectId: data.project_id || 'all' }
            : { active: false, sessionId: 'sesion1', projectId: 'all' });
    };

    publish();
    channel = supabase.channel('classroom-control-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'classroom_control' }, publish)
        .subscribe(status => {
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                onError?.(new Error(`No se pudo escuchar el estado de la práctica: ${status}`));
            }
        });
    return () => {
        active = false;
        if (channel) supabase.removeChannel(channel);
    };
}

export function watchHelpRequest(userId, callback, onError) {
    const supabase = getSupabase();
    let channel;
    let active = true;
    const publish = async () => {
        const { data, error } = await supabase
            .from('help_requests')
            .select('status, teacher_message')
            .eq('student_id', userId)
            .maybeSingle();
        if (error) {
            onError?.(error);
            return;
        }
        if (active) callback(data
            ? { status: data.status, teacherMessage: data.teacher_message }
            : null);
    };
    publish();
    channel = supabase.channel(`student-help-${userId}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'help_requests',
            filter: `student_id=eq.${userId}`
        }, publish)
        .subscribe(status => {
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                onError?.(new Error(`No se pudo escuchar la respuesta del docente: ${status}`));
            }
        });
    return () => {
        active = false;
        if (channel) supabase.removeChannel(channel);
    };
}

export function watchStudents(callback, onError, onRealtimeStatus) {
    const supabase = getSupabase();
    let rows = [];
    let presence = {};
    let active = true;
    let presenceChannel;
    let studentsChannel;
    onRealtimeStatus?.(false);
    const publish = () => {
        if (active) callback(Object.fromEntries(rows.map(student => [
            student.id,
            {
                name: student.name,
                avatar: student.avatar,
                sessionId: student.session_id,
                progress: student.progress || {},
                online: Boolean(presence[student.id])
            }
        ])));
    };
    const refresh = async () => {
        const { data, error } = await supabase
            .from('students')
            .select('id, name, avatar, session_id, progress')
            .order('name');
        if (error) {
            onError?.(error);
            return;
        }
        rows = data || [];
        publish();
    };
    refresh();
    presenceChannel = supabase.channel('classroom-presence', {
        config: { presence: { key: 'teacher-listener' } }
    })
        .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            presence = {};
            Object.values(state).flat().forEach(present => {
                if (present.userId) presence[present.userId] = present;
            });
            publish();
        })
        .subscribe(status => {
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                onError?.(new Error(`No se pudo escuchar conexiones de estudiantes: ${status}`));
            }
        });
    studentsChannel = supabase.channel('student-row-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, refresh)
        .subscribe(status => {
            onRealtimeStatus?.(status === 'SUBSCRIBED');
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                onError?.(new Error(`No se pudo escuchar el progreso: ${status}`));
            }
        });
    return () => {
        active = false;
        supabase.removeChannel(presenceChannel);
        supabase.removeChannel(studentsChannel);
    };
}

export function watchHelpRequests(callback, onError) {
    const supabase = getSupabase();
    let active = true;
    let channel;
    const refresh = async () => {
        const { data, error } = await supabase
            .from('help_requests')
            .select('student_id, message, status, teacher_message, created_at')
            .order('created_at', { ascending: false });
        if (error) {
            onError?.(error);
            return;
        }
        if (active) callback(Object.fromEntries((data || []).map(request => [
            request.student_id,
            {
                message: request.message,
                status: request.status,
                teacherMessage: request.teacher_message
            }
        ])));
    };
    refresh();
    channel = supabase.channel('help-request-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'help_requests' }, refresh)
        .subscribe(status => {
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                onError?.(new Error(`No se pudo escuchar las solicitudes de ayuda: ${status}`));
            }
        });
    return () => {
        active = false;
        if (channel) supabase.removeChannel(channel);
    };
}

export async function updateClassControl(control) {
    const user = await currentUser();
    if (!isTeacher(user)) throw new Error('Solo el docente puede controlar la práctica.');
    const { error } = await getSupabase().from('classroom_control').upsert({
        id: 1,
        active: Boolean(control.active),
        session_id: control.sessionId || 'sesion1',
        project_id: control.projectId || 'all',
        updated_at: new Date().toISOString()
    });
    throwIfError(error);
}

export async function updateStudentProfile(userId, profile) {
    const user = await currentUser();
    if (user.id !== userId) throw new Error('No puedes cambiar el perfil de otro estudiante.');
    const updates = {};
    if (profile.sessionId) updates.session_id = profile.sessionId;
    if (profile.avatar) updates.avatar = profile.avatar;
    if (!Object.keys(updates).length) return;
    const { error } = await getSupabase()
        .from('students')
        .update(updates)
        .eq('id', userId);
    throwIfError(error);
}

export async function updateStudentNameAsTeacher(userId, name) {
    const user = await currentUser();
    if (!isTeacher(user)) throw new Error('Solo el docente puede editar el nombre del estudiante.');
    const normalizedName = name.trim();
    if (normalizedName.length < 1 || normalizedName.length > 60) {
        throw new Error('El nombre debe tener entre 1 y 60 caracteres.');
    }
    const { error } = await getSupabase()
        .from('students')
        .update({ name: normalizedName, updated_at: new Date().toISOString() })
        .eq('id', userId);
    throwIfError(error);
}

export async function saveStudentProgress(userId, sessionId, progress) {
    const user = await currentUser();
    if (user.id !== userId) throw new Error('No puedes guardar el progreso de otro estudiante.');
    const supabase = getSupabase();
    const { data: student, error: readError } = await supabase
        .from('students')
        .select('progress')
        .eq('id', userId)
        .single();
    throwIfError(readError);
    const updatedProgress = { ...(student.progress || {}), [sessionId]: progress };
    const { error } = await supabase.from('students').update({
        progress: updatedProgress,
        updated_at: new Date().toISOString()
    }).eq('id', userId);
    throwIfError(error);
}

export async function recordMissionCompletion(userId, completion) {
    const user = await currentUser();
    if (user.id !== userId || !user.is_anonymous) {
        throw new Error('Solo la cuenta del estudiante puede registrar su avance.');
    }
    const { error } = await getSupabase().from('mission_completions').upsert({
        student_id: userId,
        session_id: completion.sessionId,
        project_id: completion.projectId,
        mission_id: completion.missionId
    }, {
        onConflict: 'student_id,session_id,project_id,mission_id',
        ignoreDuplicates: true
    });
    throwIfError(error);
}

export function watchMissionCompletions(callback, onError) {
    const supabase = getSupabase();
    let active = true;
    let channel;
    const refresh = async () => {
        const { data, error } = await supabase
            .from('mission_completions')
            .select('student_id, session_id, project_id, mission_id, completed_at')
            .order('completed_at', { ascending: false })
            .limit(20);
        if (error) {
            onError?.(error);
            return;
        }
        if (active) callback(data || []);
    };
    refresh();
    channel = supabase.channel('mission-completion-updates')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mission_completions' }, refresh)
        .subscribe(status => {
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                onError?.(new Error(`No se pudo escuchar el historial de misiones: ${status}`));
            }
        });
    return () => {
        active = false;
        if (channel) supabase.removeChannel(channel);
    };
}

export async function requestTeacherHelp(userId, request) {
    const user = await currentUser();
    if (user.id !== userId) throw new Error('No puedes pedir ayuda por otra persona.');
    const { error } = await getSupabase().from('help_requests').upsert({
        student_id: userId,
        message: request.message,
        status: 'pending',
        teacher_message: null,
        created_at: new Date().toISOString(),
        answered_at: null
    });
    throwIfError(error);
}

export async function replyToHelpRequest(studentId, teacherMessage) {
    const user = await currentUser();
    if (!isTeacher(user)) throw new Error('Solo el docente puede responder solicitudes.');
    const { error } = await getSupabase().from('help_requests').update({
        status: 'answered',
        teacher_message: teacherMessage,
        answered_at: new Date().toISOString()
    }).eq('student_id', studentId);
    throwIfError(error);
}

export async function resolveHelpRequest(studentId) {
    const user = await currentUser();
    if (!isTeacher(user)) throw new Error('Solo el docente puede cerrar solicitudes.');
    const { error } = await getSupabase().from('help_requests').delete().eq('student_id', studentId);
    throwIfError(error);
}

export async function trackStudentPresence(user, profile) {
    const supabase = getSupabase();
    const channel = supabase.channel('classroom-presence', {
        config: { presence: { key: user.id } }
    });
    await new Promise((resolve, reject) => {
        channel.on('presence', { event: 'sync' }, () => {
            const classmatesById = new Map();
            Object.values(channel.presenceState()).flat().forEach(present => {
                if (!present.userId || present.userId === user.id) return;
                classmatesById.set(present.userId, {
                    userId: present.userId,
                    name: present.name || 'Estudiante',
                    avatar: present.avatar || 'adventurer:student',
                    sessionId: present.sessionId || 'sesion1'
                });
            });
            profile.onClassmates?.([...classmatesById.values()]);
        });
        channel.subscribe(async status => {
            if (status === 'SUBSCRIBED') {
                const { error } = await channel.track({
                    userId: user.id,
                    name: profile.name,
                    avatar: profile.avatar,
                    sessionId: profile.sessionId
                });
                if (error) reject(error);
                else resolve();
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                reject(new Error(`No se pudo anunciar la conexión del estudiante: ${status}`));
            }
        });
    });
    return async () => {
        await supabase.removeChannel(channel);
    };
}
