const vscode = require('vscode');


// class QuickFixProvider extends vscode.CodeActionProvider {
//   // Provide code actions for the given document and range
//   provideCodeActions(document, range) {
//     // Get the list of diagnostics for the document
//     const diagnostics = vscode.languages.getDiagnostics(document.uri);

//     // Filter the diagnostics to find the one that includes the given range
//     const diagnostic = diagnostics.find(d => d.range.contains(range));

//     // Return the code actions for the diagnostic
//     return diagnostic ? vscode.CodeActionProvider.getCodeActions(diagnostic) : [];
//   }
// }


class CodeActionProvider {

  fixDiagnostic(document, diagnostics) {
    // Get the range of the diagnostic
    for (const diagnostic in diagnostics) {

      // const quickFixProvider = new QuickFixProvider();
      // const quickFixes = quickFixProvider.provideCodeActions(vscode.window.activeTextEditor.document, diagnostic.range);

      // // Apply the first quick fix
      // vscode.workspace.applyEdit(quickFixes[0].edit);
    }
  }

  // Provide code actions for the given document and range
  provideCodeActions(document) {
    // Get the list of diagnostics for the document
    const diagnostics = vscode.languages.getDiagnostics(document.uri);
    for (const diagnostic in diagnostics) {
      console.log("diagnostic", diagnostic);
      this.fixDiagnostic(document, diagnostic);
    }

    console.log("Diagnostics", diagnostics);

    // Filter the diagnostics to find syntax errors
    const syntaxErrors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);

    // Create a code action for each syntax error
    const codeActions = syntaxErrors.map(error => {
      const codeAction = new vscode.CodeAction(
        `Fix syntax error: ${error.message}`,
        vscode.CodeActionKind.QuickFix
      );
      codeAction.command = {
        title: 'Fix syntax error',
        command: 'extension.fixSyntaxError',
        arguments: [document, error]
      };

      codeAction.edit = new vscode.WorkspaceEdit();
      codeAction.diagnostics = [error];

      vscode.commands.executeCommand(codeAction.command.command, ...codeAction.command.arguments);

      console.log("executed the codeAction", codeAction);
      return codeAction;
    });

    // Return the code actions
    return codeActions;
  }
}

module.exports = CodeActionProvider;
