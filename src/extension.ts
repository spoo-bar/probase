'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// The module 'sqlops' contains the Azure Data Studio extensibility API
// This is a complementary set of APIs that add SQL / Data-specific functionality to the app
// Import the module and reference it with the alias sqlops in your code below

import ProBaseDefinitionProvider from './features/proBaseDefinitionProvider';
import ProBaseHoverProvider from './features/proBaseHoverProvider';
import Helper from './utils/helper';
import ProBaseSQLHelper from './features/proBaseSQLHelper';
import ProBaseLogProvider from './features/proBaseLogProvider';

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
    
    //Opens the SQL logs in a new view
    context.subscriptions.push(vscode.commands.registerCommand('extension.openSQLLogViewer', () => {
        var logProvider = new ProBaseLogProvider(context);
        ProBaseLogProvider.ShowLog(logProvider);
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

    var openLogViewerStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    openLogViewerStatusItem.text = "$(clippy) Open SQL Log Viewer";
    openLogViewerStatusItem.tooltip = "Open SQL Log Viewer";
    openLogViewerStatusItem.command = "extension.openSQLLogViewer";
    openLogViewerStatusItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() {
}