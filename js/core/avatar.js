const avatarStyles = ['adventurer', 'bottts', 'pixel-art', 'lorelei'];

export function createAvatarSeed() {
    return globalThis.crypto?.randomUUID?.()
        || `avatar-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function createAvatarValue(style, seed) {
    const safeStyle = avatarStyles.includes(style) ? style : avatarStyles[0];
    return `${safeStyle}:${seed || createAvatarSeed()}`;
}

export function avatarUrl(value) {
    const [storedStyle, ...seedParts] = String(value || '').split(':');
    const style = avatarStyles.includes(storedStyle) ? storedStyle : avatarStyles[0];
    const seed = seedParts.join(':') || value || createAvatarSeed();
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

function fallbackAvatarUrl(value) {
    const seed = String(value || 'student');
    const hash = [...seed].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
    const backgroundHue = hash % 360;
    const hairHue = (backgroundHue + 145) % 360;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="60" fill="hsl(${backgroundHue} 55% 32%)"/><path d="M18 116c4-25 20-38 42-38s38 13 42 38" fill="hsl(${hairHue} 55% 55%)"/><path d="M35 49c0-19 10-30 25-30s25 11 25 30v12c0 17-11 29-25 29S35 78 35 61z" fill="#f2c9a5"/><path d="M33 50c0-24 11-37 29-37 17 0 27 13 27 35-7-2-14-8-18-15-8 9-22 15-38 17z" fill="hsl(${hairHue} 45% 28%)"/><circle cx="50" cy="58" r="3" fill="#172033"/><circle cx="70" cy="58" r="3" fill="#172033"/><path d="M52 72c5 5 11 5 16 0" fill="none" stroke="#9f4b54" stroke-linecap="round" stroke-width="3"/></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function setAvatarImage(image, value) {
    image.referrerPolicy = 'no-referrer';
    image.src = fallbackAvatarUrl(value);
    const dicebearImage = new Image();
    dicebearImage.referrerPolicy = 'no-referrer';
    dicebearImage.onload = () => {
        image.src = dicebearImage.src;
    };
    dicebearImage.src = avatarUrl(value);
}

export { avatarStyles };
