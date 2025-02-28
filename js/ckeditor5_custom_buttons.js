/**
 * Gestion des boutons personnalisés pour CKEditor 5
 */
const CustomButtons = {
    /**
     * Ajoute un bouton de test à l'éditeur spécifié
     * @param {Object} editor - Instance de l'éditeur CKEditor
     */
    addTestButton: function (editor) {
        // Attendre un court instant pour s'assurer que l'interface est complètement chargée
        setTimeout(() => {
            // Trouver la barre d'outils de cet éditeur spécifique
            const editorElement = editor.ui.view.element;
            const toolbarItemsContainer = editorElement.querySelector('.ck-toolbar__items');

            if (toolbarItemsContainer && !toolbarItemsContainer.querySelector('.custom-btn')) {
                // Créer notre bouton personnalisé
                const customButton = document.createElement('button');
                customButton.textContent = 'Test Button';
                customButton.className = 'ck ck-button custom-btn';
                customButton.setAttribute('type', 'button');

                // Ajouter un gestionnaire d'événements au bouton
                customButton.addEventListener('click', () => {

                    // Insérer un texte dans cet éditeur spécifique
                    const now = new Date();
                    editor.model.change(writer => {
                        editor.model.insertContent(writer.createText('Horodatage: ' + now.toString()));
                    });
                });

                // Ajouter le bouton à la barre d'outils
                toolbarItemsContainer.appendChild(customButton);

            }
        }, 500);
    }
};

// Exporter l'objet CustomButtons
window.CustomButtons = CustomButtons; 