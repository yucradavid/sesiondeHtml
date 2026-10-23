(function () {
    const catalog = [
        { id: 'sesion1', title: 'Sesión 1: Mi primera página web', src: 'js/sesiones/sesion1.js' },
        { id: 'sesion2', title: 'Sesión 2: Le doy estilo a mi página', src: 'js/sesiones/sesion2.js' }
    ];
    const sessions = new Map();
    const pendingLoads = new Map();

    window.SessionRegistry = {
        catalog,
        register(session) {
            if (!session || !catalog.some(item => item.id === session.id)) {
                throw new Error('Se intentó registrar una sesión desconocida.');
            }
            sessions.set(session.id, session);
        },
        async load(sessionId) {
            if (sessions.has(sessionId)) return sessions.get(sessionId);
            const entry = catalog.find(item => item.id === sessionId);
            if (!entry) throw new Error(`No existe la sesión "${sessionId}".`);
            if (!pendingLoads.has(sessionId)) {
                const loadPromise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = entry.src;
                    script.onload = () => {
                        const session = sessions.get(sessionId);
                        if (session) resolve(session);
                        else reject(new Error(`El archivo de ${sessionId} no registró la sesión.`));
                    };
                    script.onerror = () => reject(new Error(`No se pudo cargar ${entry.src}.`));
                    document.head.appendChild(script);
                }).catch(error => {
                    pendingLoads.delete(sessionId);
                    throw error;
                });
                pendingLoads.set(sessionId, loadPromise);
            }
            return pendingLoads.get(sessionId);
        }
    };

    // Validaciones compartidas por las misiones de todas las sesiones.
    const EMPTY_VALUES = new Set(['', 'none', 'initial', 'unset']);
    const PROPERTY_LONGHANDS = {
        background: ['background-color', 'background-image'],
        border: ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
        'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
        margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
        outline: ['outline-style'],
        padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
    };
    const FALLBACK_PROPERTY_PATTERNS = {
        border: 'border(?:-(?:top|right|bottom|left|width|style|color)(?:-[a-z]+)?)?'
    };
    let parsedStyles = { text: null, rules: null };

    function textOf(element) {
        return element?.textContent?.replace(/\s+/g, ' ').trim() || '';
    }

    function hasOwnText(element, ...placeholders) {
        const text = textOf(element);
        return Boolean(text) && !placeholders.includes(text);
    }

    function countWithText(elements, ...placeholders) {
        return [...elements].filter(element => hasOwnText(element, ...placeholders)).length;
    }

    function normalizeSelector(selector) {
        return selector.trim().replace(/\s*([>+~])\s*/g, ' $1 ').replace(/\s+/g, ' ').toLowerCase();
    }

    // Acepta «h1», «h1, h2», «main h1» o «article.tarjeta» cuando se pide «h1» o «.tarjeta».
    function selectorMatches(selectorText, target) {
        const wanted = normalizeSelector(target);
        return selectorText.split(',').map(normalizeSelector).some(part =>
            part === wanted
            || part.endsWith(` ${wanted}`)
            || (/^[.#:]/.test(wanted) && part.endsWith(wanted))
        );
    }

    function styleText(doc) {
        return [...doc.querySelectorAll('style')].map(style => style.textContent).join('\n');
    }

    function flattenRules(rules, inMedia) {
        return [...rules].flatMap(rule => {
            if (rule.selectorText !== undefined && rule.style) {
                return [{ selectorText: rule.selectorText, style: rule.style, inMedia }];
            }
            if (rule.cssRules) return flattenRules(rule.cssRules, inMedia || Boolean(rule.media));
            return [];
        });
    }

    function parseWithBrowser(cssText) {
        if (typeof CSSStyleSheet !== 'function') return null;
        if (parsedStyles.text === cssText) return parsedStyles.rules;
        try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(cssText);
            parsedStyles = { text: cssText, rules: flattenRules(sheet.cssRules, false) };
            return parsedStyles.rules;
        } catch (error) {
            return null;
        }
    }

    // Respaldo para navegadores sin hojas de estilo construibles.
    function parseWithPatterns(cssText) {
        const rules = [];
        const collect = (text, inMedia) => {
            for (const [, selectorText, body] of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
                rules.push({ selectorText: selectorText.trim(), body, inMedia });
            }
        };
        const withoutComments = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
        const outsideMedia = withoutComments.replace(
            /@media[^{]*\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/gi,
            (match, inner) => {
                collect(inner, true);
                return '';
            }
        );
        collect(outsideMedia, false);
        return rules;
    }

    function patternHasProperty(body, property) {
        if (property === '*') return /:/.test(body);
        const name = FALLBACK_PROPERTY_PATTERNS[property] || `${property}(?:-[a-z-]+)?`;
        return new RegExp(`(?:^|[;\\s])${name}\\s*:`, 'i').test(body);
    }

    function browserHasProperty(style, property) {
        if (property === '*') return style.length > 0;
        return (PROPERTY_LONGHANDS[property] || [property]).some(name =>
            !EMPTY_VALUES.has(style.getPropertyValue(name).trim().toLowerCase())
        );
    }

    function hasStyle(doc, selector, properties, { inMedia = false } = {}) {
        const wantedProperties = [].concat(properties);
        const cssText = styleText(doc);
        const browserRules = parseWithBrowser(cssText);
        const rules = browserRules || parseWithPatterns(cssText);
        return rules.some(rule =>
            (!inMedia || rule.inMedia)
            && selectorMatches(rule.selectorText, selector)
            && wantedProperties.some(property => browserRules
                ? browserHasProperty(rule.style, property)
                : patternHasProperty(rule.body, property))
        );
    }

    window.MissionChecks = { textOf, hasOwnText, countWithText, selectorMatches, hasStyle };
})();
