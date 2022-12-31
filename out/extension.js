/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./extension.js":
/*!**********************!*\
  !*** ./extension.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("const vscode = __webpack_require__(/*! vscode */ \"vscode\");\n\nfunction activate(context) {\n  // Use the vscode.languages.registerHoverProvider method to register a hover\n  // provider for your language of choice\n  vscode.languages.registerHoverProvider('javascript', {\n    provideHover(document, position, token) {\n      // Use the vscode.window.showInformationMessage method to display a message\n      // when the user hovers over a function\n      vscode.window.showInformationMessage(\n        'You are hovering over a function. Click here to generate a unit test for it.',\n        'Generate unit test'\n      ).then((selection) => {\n        if (selection === 'Generate unit test') {\n          // Use the vscode.commands.executeCommand method to execute a command\n          // that will generate the unit test\n          vscode.commands.executeCommand('extension.generateUnitTest');\n        }\n      });\n      return {\n        contents: [\n          {\n            language: 'markdown',\n            value: 'You are hovering over a function. Click here to generate a unit test for it.'\n          }\n        ]\n      };\n    }\n  });\n\n  // Use the vscode.commands.registerCommand method to register a command that\n  // will be executed when the user clicks the \"Generate unit test\" button\n  vscode.commands.registerCommand('extension.generateUnitTest', () => {\n    // Use the vscode.window.activeTextEditor property to get a reference to the\n    // currently active text editor\n    const editor = vscode.window.activeTextEditor;\n\n    // Use the editor.selection property to get the current selection and\n    // editor.document to get the current document\n    const selection = editor.selection;\n    const document = editor.document;\n\n    // Use the document.getText method to get the text of the current selection\n    const selectedText = document.getText(selection);\n\n    // Use the vscode.workspace.openTextDocument method to open a new text\n    // document and the vscode.window.showTextDocument method to show it\n    vscode.workspace.openTextDocument({ content: `it('should test ${selectedText}', () => {});` }).then(newDoc => {\n      vscode.window.showTextDocument(newDoc);\n    });\n  });\n}\n\nexports.activate = activate;\n\n\n//# sourceURL=webpack://unit-tests-for-free/./extension.js?");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = vscode;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./extension.js");
/******/ 	
/******/ })()
;