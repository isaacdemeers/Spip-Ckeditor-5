/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

// Store references to our CKEditor modules
let CKEditorModules = null;
let CKEditorTranslations = null;

// Function to initialize the editor with the correct configuration
function initializeEditor() {
    if (!CKEditorModules) {
        console.error("CKEditor modules not loaded");
        return;
    }

    const {
        ClassicEditor,
        Autoformat,
        AutoImage,
        Autosave,
        BlockQuote,
        Bold,
        CloudServices,
        Emoji,
        Essentials,
        FindAndReplace,
        Heading,
        HorizontalLine,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromOffice,
        RemoveFormat,
        SimpleUploadAdapter,
        SourceEditing,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        WordCount
    } = CKEditorModules;

    const editorConfig = {
        toolbar: {
            items: [
                // Première ligne avec les outils standards
                'sourceEditing',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                '|',
                'link',
                'insertImage',
                'insertTable',
                'blockQuote',
                '|',
                'bulletedList',
                'numberedList',
                'todoList',
                'outdent',
                'indent',
                // Séparation entre les lignes
                '|',
                '-',  // Crée un saut de ligne dans la barre d'outils
                // Boutons personnalisés sur la deuxième ligne
                'addTestButton'
            ],
            shouldNotGroupWhenFull: true
        },
        plugins: [
            Autoformat,
            AutoImage,
            Autosave,
            BlockQuote,
            Bold,
            CloudServices,
            Emoji,
            Essentials,
            FindAndReplace,
            Heading,
            HorizontalLine,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromOffice,
            RemoveFormat,
            SimpleUploadAdapter,
            SourceEditing,
            SpecialCharacters,
            SpecialCharactersArrows,
            SpecialCharactersCurrency,
            SpecialCharactersEssentials,
            SpecialCharactersLatin,
            SpecialCharactersMathematical,
            SpecialCharactersText,
            Strikethrough,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TextTransformation,
            TodoList,
            WordCount
        ],
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage'
            ]
        },
        language: 'fr',
        licenseKey: LICENSE_KEY,
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        mention: {
            feeds: [
                {
                    marker: '@',
                    feed: [
                        /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
                    ]
                }
            ]
        },
        menuBar: {
            isVisible: true
        },
        placeholder: 'Type or paste your content here!',
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        },
        translations: CKEditorTranslations ? [CKEditorTranslations] : []
    };

    // Find all textareas that haven't been initialized yet
    let textareas = document.querySelectorAll('textarea:not([data-ckeditor-initialized])');
    console.log("Found textareas:", textareas);

    textareas.forEach(element => {
        // Mark this textarea as being processed
        element.setAttribute('data-ckeditor-initialized', 'true');

        // Get the original content from the textarea
        const originalContent = element.value;

        ClassicEditor.create(element, editorConfig)
            .then(editor => {
                // Store the editor instance for later use
                element.ckeditorInstance = editor;

                window.editor = editor; // Pour le débogage

                // Ajouter le bouton de test si le module CustomButtons est disponible
                if (window.CustomButtons) {
                    window.CustomButtons.addTestButton(editor);
                }

                // Initialiser la conversion SPIP si le convertisseur est disponible
                if (window.SpipConverter) {
                    window.SpipConverter.initForTextarea(element, editor);
                } else {
                    // Fallback si le convertisseur n'est pas disponible
                    if (!originalContent.trim()) {
                        editor.setData('<p>Saisissez votre texte ici...</p>');
                    }

                    // Synchronize editor content with textarea on change
                    editor.model.document.on('change:data', () => {
                        element.value = editor.getData();
                    });
                }

                console.log("Editor initialized successfully for:", element);
                return editor;
            })
            .catch(error => {
                // If initialization fails, remove the marker so we can try again
                element.removeAttribute('data-ckeditor-initialized');
                console.error('CKEditor initialization error:', error);
            });
    });
}

// Function to initialize CKEditor on the page
function initCKEditorOnPage() {
    console.log("CKEditor 5 initialization started");

    if (typeof jQuery !== "undefined") {
        // Disable functions that cause errors
        jQuery.fn.markItUp = function () { return this; };
        jQuery.fn.previsu_spip = function () { return this; };
        jQuery.fn.barre_previsualisation = function () { return this; };

        // Prevent barrebouilles function execution
        window.barrebouilles = function () { return; };

        // Remove event handlers on the textarea
        setTimeout(function () {
            if (jQuery("#text_area").length) {
                jQuery("#text_area").off();
            }
        }, 100);
    }

    // Load CKEditor from the configured path
    import(window.ckeditor5_path)
        .then(module => {
            CKEditorModules = module;
            console.log("CKEditor modules loaded successfully");

            // Load translations if available
            if (window.ckeditor5_translations_path) {
                return import(window.ckeditor5_translations_path)
                    .then(translationsModule => {
                        CKEditorTranslations = translationsModule.default;
                        console.log("CKEditor translations loaded successfully");
                    })
                    .catch(error => {
                        console.warn("Failed to load translations:", error);
                    });
            }
        })
        .then(() => {
            // Initialize the editor with the loaded modules
            initializeEditor();
        })
        .catch(error => {
            console.error("Error loading CKEditor:", error);
        });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    initCKEditorOnPage();

    // Update textareas before form submission (keep this as a fallback)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function () {
            document.querySelectorAll('textarea').forEach(textarea => {
                if (textarea.ckeditorInstance) {
                    // Update the textarea with the current editor content
                    textarea.value = textarea.ckeditorInstance.getData();
                    console.log('Textarea updated on form submit:', textarea.value);
                }
            });
        });
    });

    // Handle SPIP AJAX navigation if jQuery is available
    if (typeof jQuery !== "undefined") {
        jQuery(document).on('ajaxComplete', function (event, xhr, settings) {
            // Check if there are textareas without CKEditor instances
            const textareas = document.querySelectorAll('textarea:not([data-ckeditor-initialized])');
            if (textareas.length > 0) {
                console.log("Found new textareas after AJAX, initializing CKEditor");
                initCKEditorOnPage();
            }
        });
    }
});

// For SPIP's prive.js ajax_reload_page function
if (window.jQuery) {
    jQuery(document).on('spip:loaded', function () {
        console.log("SPIP loaded event detected, checking for textareas");
        const textareas = document.querySelectorAll('textarea:not([data-ckeditor-initialized])');
        if (textareas.length > 0) {
            initCKEditorOnPage();
        }
    });
}