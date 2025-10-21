// draggable.js - Directive Vue.js pour le drag & drop

// Variable partagée entre tous les éléments draggables
let draggedElement = null;

export const draggable = {
    mounted(el, binding) {
        // Configuration
        const options = binding.value || {};
        const handle = options.handle || null;
        const onReorder = options.onReorder || (() => { });

        // Élément qui servira de poignée de drag
        const dragHandle = handle ? el.querySelector(handle) : el;

        if (!dragHandle) {
            console.warn('Drag handle not found');
            return;
        }

        // Rendre l'élément draggable
        el.setAttribute('draggable', 'true');

        // Style pour la poignée
        if (handle) {
            dragHandle.style.cursor = 'move';
        } else {
            el.style.cursor = 'move';
        }

        // Empêcher le drag si on ne commence pas par la poignée
        el.addEventListener('dragstart', (e) => {
            if (handle && !e.target.closest(handle)) {
                e.preventDefault();
                return;
            }

            draggedElement = el;  // Assignation à la variable globale
            el.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', el.innerHTML);

            console.log('Drag started:', draggedElement);
        });

        el.addEventListener('dragend', () => {
            console.log('Drag ended');
            el.classList.remove('dragging');
            document.querySelectorAll('[draggable="true"]').forEach(item => {
                item.classList.remove('drag-over');
            });
            draggedElement = null;  // Reset après la fin
        });

        el.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (el !== draggedElement && draggedElement) {
                el.classList.add('drag-over');
            }
        });

        el.addEventListener('dragleave', () => {
            el.classList.remove('drag-over');
        });

        el.addEventListener('drop', (e) => {
            e.preventDefault();
            el.classList.remove('drag-over');

            console.log('Drop - draggedElement:', draggedElement, 'target:', el);

            if (el !== draggedElement && draggedElement) {
                const parent = el.parentNode;
                const allItems = Array.from(parent.children);
                const draggedIndex = allItems.indexOf(draggedElement);
                const targetIndex = allItems.indexOf(el);

                // Déterminer la position d'insertion
                const rect = el.getBoundingClientRect();
                const middle = rect.top + rect.height / 2;

                if (e.clientY < middle) {
                    parent.insertBefore(draggedElement, el);
                } else {
                    parent.insertBefore(draggedElement, el.nextSibling);
                }

                // Callback avec les nouveaux indices
                const newItems = Array.from(parent.children);
                const newIndex = newItems.indexOf(draggedElement);

                onReorder({
                    oldIndex: draggedIndex,
                    newIndex: newIndex,
                    element: draggedElement
                });
            }
        });
    },

    unmounted(el) {
        // Cleanup
        el.removeAttribute('draggable');
        if (draggedElement === el) {
            draggedElement = null;
        }
    }
};

// Pour Vue 3
export default draggable;