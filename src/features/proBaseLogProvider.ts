import * as vscode from 'vscode'
import * as fs from 'fs';
import * as path from 'path';
import Helper from '../utils/helper';
import ProBaseError from '../utils/probaseError';
import ProBaseSQLHelper from './proBaseSQLHelper';

export default class ProBaseLogProvider {

    LogPanel: vscode.WebviewPanel | undefined = undefined;
    LogInterval: NodeJS.Timer = setInterval(() => this.updateTraceLog(this.LogPanel), 500);
    State: vscode.Memento;

    constructor(context: vscode.ExtensionContext) {
        this.State = context.workspaceState;
        if (this.LogPanel) {
            this.LogPanel.reveal(vscode.ViewColumn.Beside);
        }
        else {
            this.LogPanel = vscode.window.createWebviewPanel('log', 'SQL Log', vscode.ViewColumn.Two, { enableScripts: true });
            this.LogPanel.onDidDispose(() => { clearInterval(this.LogInterval); }, null, context.subscriptions);
            this.LogPanel!.webview.onDidReceiveMessage(message => {
                switch (message.command) {
                    case 'run-sql': vscode.workspace.openTextDocument({ language: 'sql', content: message.content }).then(newDocument => {
                        vscode.window.showTextDocument(newDocument, vscode.ViewColumn.One).then(() => {
                            ProBaseSQLHelper.replaceParameters();
                        });
                    });
                        break;
                    case 'clear-log' : Helper.ClearLogFile();;
                        break;
                }

            }, undefined, context.subscriptions);
        }
    }

    public static ShowLog(logProvider: ProBaseLogProvider) {
        var webViewHtmlPath = path.join(__dirname, "../utils/logWebView.html");
        fs.readFile(webViewHtmlPath, "utf-8", function (err, content) {

            if (err)
                throw new ProBaseError(err.name, err.message);

            logProvider.LogPanel!.webview.html = content;
            logProvider.updateTraceLog(logProvider.LogPanel);
        });
    }

    private updateTraceLog(logPanel: vscode.WebviewPanel | undefined) {
        let logPath = Helper.GetSQLLogPath();
        fs.readFile(logPath, "utf-8", function (err, content) {

            if (err) {
                if (err.code !== "EBUSY")
                    throw new ProBaseError(err.name, err.message);
            }

            JSON.parse(content).forEach((element: any, index: Number) => {
                let log: Log = Object.assign(new Log(), element);
                logPanel!.webview.postMessage(log);
            });
        });
    }

}

class Log {
    GUID !: string;
    User !: string;
    PID !: string;
    SubSystem !: string;
    Module !: string;
    Message !: string;
    Date  !: string;
    Time !: string;
}

