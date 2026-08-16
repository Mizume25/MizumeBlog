/** Archivo de Apis utilizadas */

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

    const data = await response.json();

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
};