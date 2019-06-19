import * as vscode from 'vscode'
import * as fs from 'fs';
import Helper from '../utils/helper';
import ProBaseError from '../utils/probaseError';

export default class ProBaseLogProvider {

    LogPanel : vscode.WebviewPanel | undefined = undefined;
    LogInterval : NodeJS.Timer = setInterval(this.updateTraceLog, 1000);

    constructor(context : vscode.ExtensionContext) {
        if(this.LogPanel) {
            this.LogPanel.reveal(vscode.ViewColumn.Beside);
        }
        else {
            this.LogPanel = vscode.window.createWebviewPanel('log', 'SQL Log', vscode.ViewColumn.Beside, {});
            this.LogPanel.onDidDispose(() => { clearInterval(this.LogInterval); }, null, context.subscriptions);
        }        
    }

    private updateTraceLog() {
        var logPath = Helper.GetSQLLogPath();
        fs.readFile(logPath, "utf-8", function (err, content) {
            if (err)
                throw new ProBaseError(err.name, err.message);

            let logs : Log[] = [];
            JSON.parse(content).forEach((element: any) => {
                var log: Log = Object.assign(new Log(), element);
                logs.push(log);
            });
        });
    }
}

class Log {
    User !: string;
    PID !: string;
    SubSystem !: string;
    Module !: string;
    Message !: string;
    Date  !: string;
    Time !: string;
}

