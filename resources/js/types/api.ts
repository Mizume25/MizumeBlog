/** Archivo de Apis utilizadas */

import { ArticleConfig } from './interfaces';

/** Cifrado Token */
function getCsrfToken(): string {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

/** Fetch Api Principal */
async function apiFetch(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
            ...options.headers,
        },
    });

    let data;
    try {
        data = await response.json();
    } catch {
        // La respuesta no es JSON (probablemente página de error HTML de Laravel)
        throw new Error(`Error ${response.status}: respuesta no válida del servidor`);
    }

    if (!response.ok) {
        throw new Error(data.message ?? 'Error en la petición');
    }

    return data;
}

export const artworkApi = {
    getAvailable: (postId: number | undefined, artworkId: number | undefined) => {
        if (postId == null || artworkId == null) {
            return Promise.reject(new Error('Faltan datos para obtener las imágenes disponibles'));
        }

        return apiFetch(`/api/post/${postId}/artwork/${artworkId}`);
    },

    replaceImage: (postId: number | undefined, imageId: number | undefined, artworkImageId: number | undefined) => {
        if (postId == null || imageId == null || artworkImageId == null) {
            return Promise.reject(new Error('Faltan datos para reemplazar la imagen'));
        }

        return apiFetch(`/api/post/${postId}/replace/${imageId}`, {
            method: 'PUT',
            body: JSON.stringify({ artwork_image_id: artworkImageId }),
        });
    },

    associateImage: (postId: number | undefined, artworkImageId: number | undefined, key: string) => {
        if (postId == null || artworkImageId == null || !key.trim()) {
            return Promise.reject(new Error('Faltan datos para asociar la imagen'));
        }

        return apiFetch(`/api/post/${postId}/associate/${artworkImageId}`, {
            method: 'POST',
            body: JSON.stringify({ key }),
        });
    },

    syncWorks: (postId: number | undefined, workIds: number[]) => {
        if (postId == null) {
            return Promise.reject(new Error('Falta el id del post para sincronizar obras'));
        }

        return apiFetch(`/api/post/${postId}/symlink`, {
            method: 'PUT',
            body: JSON.stringify({ works: workIds.map((id) => ({ id })) }),
        });
    },
    getPendingKeys: (postId: number | undefined) => {
        if (postId == null) {
            return Promise.reject(new Error('Falta el id del post'));
        }
        return apiFetch(`/api/post/${postId}/pendingKeys`);
    },
    associateMultipleImages: (postId: number | undefined, payload: { key: string; artwork_image_id: number }[]) => {
        if (postId == null || payload.length === 0) {
            return Promise.reject(new Error('Faltan datos para asociar las imágenes'));
        }

        return apiFetch(`/api/post/${postId}/associate/bulk`, {
            method: 'POST',
            body: JSON.stringify({ associations: payload }),
        });
    },
};

export const configApi = {
    updateHome: (postId: number | undefined, home: string) => {
        if (postId == null) return Promise.reject(new Error('Debes elegir un post a modificar'));

        return apiFetch(`/api/post/${postId}/format/home`, {
            method: 'PUT',
            body: JSON.stringify({ home: home }),
        });
    },
    updateAccent: (postId: number | undefined, accent: string) => {
        if (postId == null) return Promise.reject(new Error('Debes elegir un post a modificar'));

        return apiFetch(`/api/post/${postId}/format/accent`, {
            method: 'PUT',
            body: JSON.stringify({ accent: accent }),
        });
    },
    updateArticle: (postId: number | undefined, article: ArticleConfig) => {
        if (postId == null) return Promise.reject(new Error('Debes elegir un post a modificar'));

        return apiFetch(`/api/post/${postId}/format/article`, {
            method: 'PUT',
            body: JSON.stringify({
                height: article.height,
                position: article.position,
            }),
        });
    },
    updateCard: (postId: number | undefined, card: string) => {
        if (postId == null) return Promise.reject(new Error('Debes elegir un post a modificar'));

        return apiFetch(`/api/post/${postId}/format/card'`, {
            method: 'PUT',
            body: JSON.stringify({
                card: card,
            }),
        });
    },
};
