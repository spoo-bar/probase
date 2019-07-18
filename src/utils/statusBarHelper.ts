import * as vscode from 'vscode';

export default class StatusBarHelper {

    public static createStatusBarItems(): void {
        var replaceParametersStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        replaceParametersStatusItem.text = "$(zap) Replace Parameters";
        replaceParametersStatusItem.tooltip = "Replace parameters in SQL";
        replaceParametersStatusItem.command = "extension.replaceSQLParameters";
        replaceParametersStatusItem.show();

        var removeDbNameStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        removeDbNameStatusItem.text = "$(trashcan) Remove Database Name";
        removeDbNameStatusItem.tooltip = "Remove database name from query";
        removeDbNameStatusItem.command = "extension.cleanDatabaseName";
        removeDbNameStatusItem.show();

        var openLogViewerStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        openLogViewerStatusItem.text = "$(clippy) Open SQL Log Viewer";
        openLogViewerStatusItem.tooltip = "Open SQL Log Viewer";
        openLogViewerStatusItem.command = "extension.openSQLLogViewer";
        openLogViewerStatusItem.show();
    }
}