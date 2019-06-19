import * as vscode from 'vscode'
import * as fs from 'fs';
import Helper from '../utils/helper';
import ProBaseError from '../utils/probaseError';

export default class ProBaseLogProvider {

    LogPanel : vscode.WebviewPanel | undefined = undefined;
    LogInterval : NodeJS.Timer = setInterval(() => this.updateTraceLog(this.LogPanel), 1000000);
    State : vscode.Memento;

    constructor(context : vscode.ExtensionContext) {
        this.State = context.workspaceState;
        if(this.LogPanel) {
            this.LogPanel.reveal(vscode.ViewColumn.Beside);
        }
        else {
            this.LogPanel = vscode.window.createWebviewPanel('log', 'SQL Log', vscode.ViewColumn.Beside, {});
            this.LogPanel.onDidDispose(() => { clearInterval(this.LogInterval); }, null, context.subscriptions);
        }        
    }

    public ShowLog() {
        this.updateTraceLog(this.LogPanel);
    }

    private updateTraceLog(logPanel : vscode.WebviewPanel | undefined) {
        let logPath = Helper.GetSQLLogPath();
        fs.readFile(logPath, "utf-8", function (err, content) {
            if (err)
                throw new ProBaseError(err.name, err.message);

            let details : string = '';
            let logs : [] = JSON.parse(content);
            logs.forEach((element: any, index: Number) => {
                let log: Log = Object.assign(new Log(), element);
                details += '<p>' + log.Message + '</p>';

                if(index  === logs.length - 1) {
                    let html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Cat Coding</title>
                    </head>
                    <body>
                        ${details}
                    </body>
                    </html>`;
                    logPanel!.webview.html = html;
                }
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

