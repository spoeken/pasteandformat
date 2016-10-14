var vscode = require('vscode');
var window = vscode.window;

function activate(context) {

    var disposable = vscode.commands.registerCommand('extension.pasteAndFormat', function () {


        //Check if current document is markdown

        if(window.activeTextEditor.document.languageId === 'markdown'){
            vscode.commands.executeCommand('workbench.action.markdown.togglePreview');
        } else {
            // Save current position
            var start = window.activeTextEditor.selection.active;
            // Paste from clipboard
            vscode.commands.executeCommand('editor.action.clipboardPasteAction').then(function () {

                var end = window.activeTextEditor.selection.active; // Get position after paste
                var selection = new vscode.Selection(start.line, start.character, end.line, end.character); // Create selection
                window.activeTextEditor.selection = selection; // Apply selection to editor

                // Format selection, when text is selected, that text is the only thing that will be formatted
                vscode.commands.executeCommand('editor.action.format').then(function () {
                    // This is where I really would like the deselection to happen but it runs before
                    // formatting is done, I've tried window.onDidChangeTextEditorSelection, but that doesn't
                    // seem to work how I would like it to eighther.
                    // Until issue #1775 is solved I just use a timeout.

                    setTimeout(function () {
                        // Hopefully the format command is done when this happens
                        var line = window.activeTextEditor.selection.end.line;
                        var character = window.activeTextEditor.selection.end.character;
                        // Set both start and end of selection to the same point so that nothing is selected
                        var newSelection = new vscode.Selection(line, character, line, character); // Create selection
                        window.activeTextEditor.selection = newSelection; // Apply selection to editor
                    }, 100);

                });

            });
        }



    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;