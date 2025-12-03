// directives/croppable.js
export const croppable = {
    mounted(el, binding) {
        const img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (!img) return;

        let isDragging = false;
        let isResizing = false;
        let dragStart = { x: 0, y: 0 };
        let cropPosition = { x: 0, y: 0 };
        let cropSize = 250;
        const minCropSize = 50;
        const maxCropSize = 400;

        // Create crop overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            border: 3px solid #3b82f6;
            background: rgba(59, 130, 246, 0.2);
            width: ${cropSize}px;
            height: ${cropSize}px;
            cursor: move;
            pointer-events: auto;
            top: 0;
            left: 0;
            box-sizing: border-box;
        `;

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: -12px;
            right: -12px;
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border: 2px solid white;
            border-radius: 50%;
            cursor: nwse-resize;
            z-index: 10;
        `;
        overlay.appendChild(resizeHandle);

        const container = img.parentElement;
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        container.appendChild(overlay);

        const updateOverlayConstraints = () => {
            const imgRect = img.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const maxX = imgRect.width - cropSize;
            const maxY = imgRect.height - cropSize;

            cropPosition.x = Math.max(0, Math.min(cropPosition.x, maxX));
            cropPosition.y = Math.max(0, Math.min(cropPosition.y, maxY));

            overlay.style.left = cropPosition.x + 'px';
            overlay.style.top = cropPosition.y + 'px';
            overlay.style.width = cropSize + 'px';
            overlay.style.height = cropSize + 'px';
        };

        const handleMouseDown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const overlayRect = overlay.getBoundingClientRect();
            const x = e.clientX - overlayRect.left;
            const y = e.clientY - overlayRect.top;

            if (x >= 0 && x <= cropSize && y >= 0 && y <= cropSize) {
                isDragging = true;
                dragStart = { x, y };
            }
        };

        const handleResizeMouseDown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            const overlayRect = overlay.getBoundingClientRect();
            dragStart = {
                x: e.clientX,
                y: e.clientY,
                size: cropSize,
                posX: cropPosition.x,
                posY: cropPosition.y
            };
        };

        const handleMouseMove = (e) => {
            if (isResizing) {
                const deltaX = e.clientX - dragStart.x;
                const deltaY = e.clientY - dragStart.y;
                const delta = Math.max(deltaX, deltaY);

                let newSize = dragStart.size + delta;

                // Constrain size
                const imgRect = img.getBoundingClientRect();
                const maxSizeFromImage = Math.min(
                    imgRect.width - cropPosition.x,
                    imgRect.height - cropPosition.y
                );

                newSize = Math.max(minCropSize, Math.min(newSize, maxCropSize, maxSizeFromImage));

                cropSize = newSize;
                overlay.style.width = cropSize + 'px';
                overlay.style.height = cropSize + 'px';

            } else if (isDragging) {
                const containerRect = container.getBoundingClientRect();
                const x = e.clientX - containerRect.left - dragStart.x;
                const y = e.clientY - containerRect.top - dragStart.y;

                const imgRect = img.getBoundingClientRect();
                const maxX = imgRect.width - cropSize;
                const maxY = imgRect.height - cropSize;

                cropPosition.x = Math.max(0, Math.min(x, maxX));
                cropPosition.y = Math.max(0, Math.min(y, maxY));

                overlay.style.left = cropPosition.x + 'px';
                overlay.style.top = cropPosition.y + 'px';
            }
        };

        const handleMouseUp = () => {
            isDragging = false;
            isResizing = false;
        };

        overlay.addEventListener('mousedown', handleMouseDown);
        resizeHandle.addEventListener('mousedown', handleResizeMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Wait for image to load
        if (img.complete) {
            updateOverlayConstraints();
        } else {
            img.addEventListener('load', updateOverlayConstraints);
        }

        // Store cleanup function and crop function
        el._croppableCleanup = () => {
            overlay.removeEventListener('mousedown', handleMouseDown);
            resizeHandle.removeEventListener('mousedown', handleResizeMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            overlay.remove();
        };

        el._getCroppedImage = () => {
            const canvas = document.createElement('canvas');
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const displayWidth = img.width;
            const displayHeight = img.height;

            const scaleX = naturalWidth / displayWidth;
            const scaleY = naturalHeight / displayHeight;

            const cropSizeOriginal = cropSize * scaleX;
            canvas.width = cropSizeOriginal;
            canvas.height = cropSizeOriginal;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                img,
                cropPosition.x * scaleX,
                cropPosition.y * scaleY,
                cropSizeOriginal,
                cropSizeOriginal,
                0, 0,
                cropSizeOriginal,
                cropSizeOriginal
            );

            return canvas.toDataURL('image/png');
        };
    },

    unmounted(el) {
        if (el._croppableCleanup) {
            el._croppableCleanup();
        }
    }
};