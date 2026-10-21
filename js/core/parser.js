window.LabParser = {
    parse(code) {
        return new DOMParser().parseFromString(code, 'text/html');
    }
};
