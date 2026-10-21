window.LabDB = {
    saveStudent(payload) {
        localStorage.setItem(`student_${payload.name}`, JSON.stringify(payload));
    },

    getStudentRecords() {
        const records = [];
        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (!key || !key.startsWith('student_')) continue;

            const raw = localStorage.getItem(key);
            if (!raw) continue;
            try {
                const data = JSON.parse(raw);
                if (data && typeof data.name === 'string' && data.state && typeof data.state === 'object') {
                    records.push(data);
                } else {
                    console.error(`Se omitió el registro local inválido "${key}".`);
                }
            } catch (error) {
                console.error(`No se pudo leer el registro local "${key}".`, error);
            }
        }
        return records;
    }
};
