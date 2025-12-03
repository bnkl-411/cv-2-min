// utils/imageUtils.js

/**
 * Taille maximale autorisée pour les images (5 Mo en octets)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Valide la taille d'un fichier
 * @param {File} file - Fichier à valider
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Le fichier est trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} Mo). Taille maximale : 5 Mo.`
        };
    }
    return { valid: true };
};

/**
 * Valide le type d'un fichier
 * @param {File} file - Fichier à valider
 * @param {string[]} allowedTypes - Types MIME autorisés
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Type de fichier non autorisé. Formats acceptés : ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`
        };
    }
    return { valid: true };
};

/**
 * Convertit un fichier en base64
 * @param {File} file - Fichier à convertir
 * @returns {Promise<string>} - Image en base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Compresse une image
 * @param {string} base64 - Image en base64
 * @param {number} quality - Qualité de compression (0-1)
 * @param {number} maxWidth - Largeur maximale (optionnel)
 * @param {number} maxHeight - Hauteur maximale (optionnel)
 * @returns {Promise<string>} - Image compressée en base64
 */
export const compressImage = (base64, quality = 0.8, maxWidth = null, maxHeight = null) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Redimensionnement si nécessaire
            if (maxWidth && width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (maxHeight && height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Compression en JPEG
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
        };
        img.src = base64;
    });
};

/**
 * Obtient la taille d'une image base64 en octets
 * @param {string} base64 - Image en base64
 * @returns {number} - Taille en octets
 */
export const getBase64Size = (base64) => {
    const stringLength = base64.length - 'data:image/png;base64,'.length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes;
};

/**
 * Formate la taille en octets en format lisible
 * @param {number} bytes - Taille en octets
 * @returns {string} - Taille formatée
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Octets';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};