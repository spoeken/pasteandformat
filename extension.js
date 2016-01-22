// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var window = vscode.window;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pasteandformat" is now active!'); 

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.pasteAndFormat', function () {
        // console.log(window.activeTextEditor.document);
        // console.log(window.activeTextEditor.selection);
        
        // Get current cursor position
        var start = window.activeTextEditor.selection.anchor;
        //Paste from clipboard
        vscode.commands.executeCommand('editor.action.clipboardPasteAction').then(function () {

            var end = window.activeTextEditor.selection.anchor; // Get cursor position after paste
            var selection = new vscode.Selection(start.line, start.character, end.line, end.character); // Create selection
            window.activeTextEditor.selection = selection; //Apply selection to editor
            
                
            
            // Listen for selection change event, so that we can deselect after formatting
            // This is really because of a bug in executeCommand
            // which doesn't really wait for the command to finish before continuing.
            // 'then' - apparently - only means: when the command has been called.
                

            var selectionChangeListener = window.onDidChangeTextEditorSelection(function (evt) {
                console.log(evt);
                console.log('kjsgadksjag daksjhd ');
                //Place cursor at the end so the pasted text no longer is selected
                // Find end of selection
                var line = window.activeTextEditor.selection.end.line;
                var character = window.activeTextEditor.selection.end.character;
                //Set both start and end of selection to the same point so that nothing is selected
                var newSelection = new vscode.Selection(line, character, line, character); // Create selection
                window.activeTextEditor.selection = newSelection;
                selectionChangeListener.dispose(); // Stop listening
            });
            // Format selection, when text is selected, that text is the only thing that will be formatted
            vscode.commands.executeCommand('editor.action.format').then(function () {
                // This is where I really would like the deselction to happen
                // but i sruns before formatting is done, I've tried window.onDidChangeTextEditorSelection, but that doesn't seem to work properly eighther
                // Until issue #1775 is solved I just use a timeout. 

                // setTimeout(function () {
                //     // Hopefully the format command is done when this happens
                //     var line = window.activeTextEditor.selection.end.line;
                //     var character = window.activeTextEditor.selection.end.character;
                //     //Set both start and end of selection to the same point so that nothing is selected
                //     var newSelection = new vscode.Selection(line, character, line, character); // Create selection
                //     window.activeTextEditor.selection = newSelection;
                // }, 100);


            });


        });

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;