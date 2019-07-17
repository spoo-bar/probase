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
import StatusBarHelper from './utils/statusBarHelper';
import ProBaseReferenceProvider from './features/proBaseReferenceProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    StatusBarHelper.createStatusBarItems();

    //Enables Go to Definition and Peek Definition
    context.subscriptions.push(vscode.languages.registerDefinitionProvider({ language: "sql" }, new ProBaseDefinitionProvider()));

    //Enables Peek Reference 
    context.subscriptions.push(vscode.languages.registerReferenceProvider({ language: "sql" }, new ProBaseReferenceProvider()));

    //Enables intellisense on hover
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "sql" }, new ProBaseHoverProvider(context.globalState)));

    //Updates documentation
    context.subscriptions.push(vscode.commands.registerCommand('extension.updateDocumentation', () => {
        Helper.LoadDocumentation(context.globalState);
    }));

    //Replaces SQL Parameter values
    context.subscriptions.push(vscode.commands.registerCommand('extension.replaceSQLParameters', () => {
        ProBaseSQLHelper.replaceParameters();
    }));

    //Cleans the database name from the SQL
    context.subscriptions.push(vscode.commands.registerCommand('extension.cleanDatabaseName', () => {
        ProBaseSQLHelper.cleanDatabaseName();
    }));
    
    //Opens the SQL logs in a new view
    context.subscriptions.push(vscode.commands.registerCommand('extension.openSQLLogViewer', () => {
        var logProvider = new ProBaseLogProvider(context, Helper.GetSQLLogPath());
        ProBaseLogProvider.ShowLog(logProvider, true);
    }));

    //Imports and opens logs
    context.subscriptions.push(vscode.commands.registerCommand('extension.importLog', () => {
        vscode.window.showOpenDialog({ canSelectFiles: true, canSelectFolders: false, canSelectMany: false, filters: { 'Proarc SQL Logs': ['json'] } }).then((uris) => {
            if(uris) {
                var logProvider = new ProBaseLogProvider(context, uris[0].fsPath);
                ProBaseLogProvider.ShowLog(logProvider, false);
            }
        });
    }));

    if (!context.globalState.get(Helper.IsDocumentationLoaded)) {
        Helper.LoadDocumentation(context.globalState);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
    Helper.ClearLogFile();
}