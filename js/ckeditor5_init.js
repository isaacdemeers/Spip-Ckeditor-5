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
        Markdown,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromMarkdownExperimental,
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
                'indent'
            ],
            shouldNotGroupWhenFull: false
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
            Markdown,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromMarkdownExperimental,
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

    // Find all textareas and initialize CKEditor on them
    let textareas = document.querySelectorAll('textarea');
    console.log("Found textareas:", textareas);

    textareas.forEach(element => {
        // Get the original content from the textarea
        const originalContent = element.value;

        ClassicEditor.create(element, editorConfig)
            .then(editor => {
                // If the textarea was empty, we can set some placeholder content
                if (!originalContent.trim()) {
                    editor.setData('<p>Saisissez votre texte ici...</p>');
                }

                // Store the editor instance for later use
                element.ckeditorInstance = editor;

                console.log("Editor initialized successfully for:", element);
                return editor;
            })
            .catch(error => {
                console.error('CKEditor initialization error:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
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

    // Update textareas before form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function () {
            document.querySelectorAll('textarea').forEach(textarea => {
                if (textarea.ckeditorInstance) {
                    // Update the textarea with the current editor content
                    textarea.value = textarea.ckeditorInstance.getData();
                }
            });
        });
    });
});