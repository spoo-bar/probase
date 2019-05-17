'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// The module 'sqlops' contains the Azure Data Studio extensibility API
// This is a complementary set of APIs that add SQL / Data-specific functionality to the app
// Import the module and reference it with the alias sqlops in your code below

import * as sqlops from 'sqlops';
import ProBaseDefinitionProvider from './features/proBaseDefinitionProvider';
import ProBaseHoverProvider from './features/proBaseHoverProvider';
import Helper from './utils/helper';
import ProBaseSQLHelper from './features/proBaseSQLHelper';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


    //Enables Go to Definition and Peek Definition
    context.subscriptions.push(vscode.languages.registerDefinitionProvider({ language: "sql" }, new ProBaseDefinitionProvider()))

    //Enables intellisense on hover
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "sql" }, new ProBaseHoverProvider(context.globalState)))

    //Updates documentation
    context.subscriptions.push(vscode.commands.registerCommand('extension.updateDocumentation', () => {
        Helper.LoadDocumentation(context.globalState);
    }));

    //Replaces SQL Parameter values
    createStatusBarItems();
    context.subscriptions.push(vscode.commands.registerCommand('extension.replaceSQLParameters', () => {
        ProBaseSQLHelper.replaceParameters();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.showCurrentConnection', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        sqlops.connection.getCurrentConnection().then(connection => {
            let connectionId = connection ? connection.connectionId : 'No connection found!';
            vscode.window.showInformationMessage(connectionId);
        }, error => {
            console.info(error);
        });
    }));

    if (!context.globalState.get(Helper.IsDocumentationLoaded)) {
        Helper.LoadDocumentation(context.globalState);
    }
}

function createStatusBarItems() {
    var replaceParametersStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    replaceParametersStatusItem.text = "$(beaker) Replace Parameters";
    replaceParametersStatusItem.tooltip = "Replace parameters in SQL";
    replaceParametersStatusItem.command = "extension.replaceSQLParameters";
    replaceParametersStatusItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() {
}