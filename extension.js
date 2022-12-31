const vscode = require('vscode');
const { exec } = require('child_process');
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const { listenerCount } = require('process');
const eslint = require('eslint');

function runUnitTests(testFileName) {
  // Open the file containing the unit tests
  vscode.workspace.openTextDocument(testFileName).then((document) => {
    // Execute the unit tests using Python's unittest module
    exec(`python -m unittest ${testFileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }

      // Display the results of the unit tests
      if (stderr) {
        vscode.window.createOutputChannel('Unit Test Results').appendLine(stderr);
      } else {
        vscode.window.showInformationMessage('All unit tests passed!');
      }
    });
  });
}

function showError(errorMessage) {
  vscode.window.showErrorMessage(errorMessage);
}

function escapeQuotations(string) {
  // Escape single quotes
  string = string.replace(/'/g, "\\'");

  // Escape double quotes
  string = string.replace(/"/g, '\\"');

  string = string.replace(/(\r\n|\n|\r)/gm, "");

  console.log("escaped: " + string);
  return string;
}

function createFileIfNotExists(filePath, language) {

  if (language == "python") {
    filePath = filePath + "_test.py";
  } else if (language == "javascript") {
    filePath = filePath + "_test.js";
  } else if (language == "java") {
    filePath = filePath + "_test.java";
  } else if (language == "c") {
    filePath = filePath + "_test.c";
  } else if (language == "c++") {
    filePath = filePath + "_test.cpp";
  } else if (language == "c#") {
    filePath = filePath + "_test.cs";
  } else if (language == "go") {
    filePath = filePath + "_test.go";
  } else if (language == "kotlin") {
    filePath = filePath + "_test.kt";
  } else if (language == "php") {
    filePath = filePath + "_test.php";
  } else if (language == "ruby") {
    filePath = filePath + "_test.rb";
  } else if (language == "swift") {
    filePath = filePath + "_test.swift";
  } else if (language == "typescript") {
    filePath = filePath + "_test.ts";
  } else {
    console.log("Language not supported");
    return;
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // Create the file if it doesn't exist
    fs.writeFileSync(filePath, '');
  }
  return filePath;
}

async function generateUnitTests(inputCode) {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Write unit tests for the following code: " + inputCode,
      max_tokens: 4097-inputCode.length,
      temperature: 0.7,
    });
    return response;
  } catch (error) {
    console.log("FAILED TO GENERATE UNIT TESTS");
    console.log(error.response.data.error.message);
    console.log(error.message);
    return error;
  }
}

function activate() {
  console.log('Congratulations, your extension "unit-tests-for-free" is now active!');
  // Use the vscode.languages.registerHoverProvider method to register a hover
  // provider for your language of choice
  const language = vscode.window.activeTextEditor.document.languageId;
  vscode.languages.registerHoverProvider(language, {
    provideHover(document, position, token) {
      // Use the vscode.window.showInformationMessage method to display a message
      // when the user hovers over a function

      vscode.window.showInformationMessage(
        'Click here to generate a unit test for this function.', 'Generate unit tests'
      ).then((selection) => {
        if (selection === 'Generate unit tests') {
          // Use the vscode.commands.executeCommand method to execute a command
          // that will generate the unit test
          vscode.commands.executeCommand('extension.generateUnitTest');
        }
      });
      return {
        contents: [
          {
            language: 'markdown',
            value: 'Click here to generate a unit test for this function.'
          }
        ],
        commands: [
          {
            title: 'Generate unit test',
            command: 'extension.generateUnitTest'
          }
        ]
      };
    }
  });

  // Use the vscode.commands.registerCommand method to register a command that
  // will be executed when the user clicks the "Generate unit test" button
  vscode.commands.registerCommand('extension.generateUnitTest', () => {
    // Use the vscode.window.activeTextEditor property to get a reference to the
    // currently active text editor
    console.log('Congratulations, called the "extension.generateUnitTest" command!');

    const editor = vscode.window.activeTextEditor;

    // Use the editor.selection property to get the current selection and
    // editor.document to get the current document
    const selection = editor.selection;
    const document = editor.document;

    const language = document.languageId;

    console.log("Currently reading code in the following language: " + document.languageId);

    // Use the document.getText method to get the text of the current selection
    const selectedText = document.getText(selection);

    // Get the current file path
    const filePath = editor.document.fileName;

    // Append "_test" to the file name and add the ".py" extension
    let testFileName = `${filePath.slice(0, -3)}`;

    // Call the function with the file path you want to create
    testFileName = createFileIfNotExists(testFileName, language);

    // Use OpenAI to generate a unit test for the selected text
    // const command = `python -c "from easychatgpt import ChatClient; chat = ChatClient("saspg1@yahoo.com", "aiswarya"); chat.interact("Write python unit tests for this function: \\"${selectedText}\\"")"`;

    console.log(selectedText);

    let parsedSelectedText = escapeQuotations(selectedText);
    console.log(parsedSelectedText);

    // const command = `python -c 'import pip; pip.main(["install", "-U", "easychatgpt"]); from easychatgpt import ChatClient; chat = ChatClient("saspg1@yahoo.com", "aiswarya"); chat.interact("Write python unit tests for this function: ${parsedSelectedText}")'`;

    // const command = `python -c """import pip; python -m pip install easychatgpt; from easychatgpt import ChatClient; chat = ChatClient("saspg1@yahoo.com", "aiswarya"); chat.interact("Write python unit tests for this function: ${parsedSelectedText}")"""`;

    // const options = {
    //   timeout: 10000 // 10 seconds
    // };

    generateUnitTests(parsedSelectedText).then((result) => {

      const fileUri = vscode.Uri.file(testFileName);
      vscode.workspace.openTextDocument(fileUri).then((document) => {
        vscode.window.showTextDocument(document, { viewColumn: 1, preserveFocus: true }).then((editor) => {
          editor.edit((edit) => {
            const lastLine = document.lineCount - 1;
            const lastLineEnd = document.lineAt(lastLine).range.end;
            if (result.data.error) {
              console.log("Error generating unit tests");
              showError(result.data.error.message);
            } else {
              try {
                edit.insert(lastLineEnd, result.data.choices[0].text);
              } catch (error) {
                showError('Error generating unit tests: ' + error.message);
              }
            };
          });
        });

        // Lint the document after saving
        // vscode.workspace.onDidSaveTextDocument((document) => {
        //   // Run the ESLint linter on the saved document
        //   try {
        //     console.log("Linting the document");
        //     vscode.commands.executeCommand('eslint.executeAutofix', document.uri);
        //   } catch (error) {
        //     showError('Error linting the document: ' + error.message);
        //   }
        //   vscode.commands.executeCommand('eslint.executeOnTextDocument', document.uri);
        //   console.log("Finished linting the document");
        // });

        // Run the unit tests and attempt to iterate on failed tests
        runUnitTests(testFileName);
      });
    });

    // generateUnitTests(parsedSelectedText).then(result => console.log(result.data.choices[0].text));

    // const fileUri = vscode.Uri.file(testFileName);
    // vscode.workspace.openTextDocument(fileUri).then(document => {
    //   vscode.window.showTextDocument(document, { viewColumn: 1, preserveFocus: true }).then(editor => {
    //     editor.edit(edit => {
    //         const lastLine = document.lineCount - 1;
    //         const lastLineEnd = document.lineAt(lastLine).range.end;
    //         edit.insert(lastLineEnd, result);
    //       });
    //     });
    //   });
    // });
    console.log("Finished executing command");
  });
}

exports.activate = activate;
