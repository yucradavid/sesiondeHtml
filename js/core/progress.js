export function completedMissions(progress, missionCount) {
    return Array.from({ length: missionCount }, (_, index) => Boolean(progress?.[`m${index + 1}`]))
        .filter(Boolean).length;
}

export function progressFor(student, sessionCatalog, sessionId, projectId) {
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
