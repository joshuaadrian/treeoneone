let manifest = null;

async function loadManifest() {
    try {
        const response = await fetch('/dist/mix-manifest.json');
        manifest = await response.json();
    } catch (error) {
        console.error('Error loading mix-manifest.json:', error);
        manifest = {};
    }
}

export async function getAssetPath(path) {
    if (!manifest) {
        await loadManifest();
    }

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    if (manifest[`/${cleanPath}`]) {
        return `/dist${manifest[`/${cleanPath}`]}`;
    }

    // Fallback to original path if not found in manifest
    console.warn(`Asset not found in manifest: ${path}`);
    return `/dist/${cleanPath}`;
}

// Helper function to load CSS
export async function loadCSS(path) {
    const href = await getAssetPath(path);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Helper function to load JavaScript
export async function loadJS(path) {
    const src = await getAssetPath(path);
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
} 