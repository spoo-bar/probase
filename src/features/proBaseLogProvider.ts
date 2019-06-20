import * as vscode from 'vscode'
import * as fs from 'fs';
import Helper from '../utils/helper';
import ProBaseError from '../utils/probaseError';

export default class ProBaseLogProvider {

    LogPanel : vscode.WebviewPanel | undefined = undefined;
    LogInterval : NodeJS.Timer = setInterval(() => this.updateTraceLog(this.LogPanel), 1000);
    State : vscode.Memento;

    constructor(context : vscode.ExtensionContext) {
        this.State = context.workspaceState;
        if(this.LogPanel) {
            this.LogPanel.reveal(vscode.ViewColumn.Beside);
        }
        else {
            this.LogPanel = vscode.window.createWebviewPanel('log', 'SQL Log', vscode.ViewColumn.Beside, {enableScripts: true});
            this.LogPanel.onDidDispose(() => { clearInterval(this.LogInterval); }, null, context.subscriptions);
        }        
    }

    public ShowLog() {
        this.LogPanel!.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SQL Logs</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
            <script>
                window.addEventListener('message', event => {
                    const message = event.data;

                    //Checking if element already exists and do nothing if it does
                    var ele = document.getElementById(message.ID);
                    if(typeof(ele) != undefined && ele != null)
                        return;

                    var logItemsDiv = document.getElementById('logItems');
                    var logItem = document.createElement('div');
                    logItem.id = message.ID;
                    logItem.className += 'logItemDiv';

                    var playIconLink = document.createElement('button');
                    var playIcon = document.createElement('i');
                    playIcon.className += 'icon fa fa-play';
                    playIcon.style.color = 'green';
                    playIconLink.appendChild(playIcon);
                    logItem.appendChild(playIconLink);

                    var logMessage = document.createTextNode(message.Message);
                    logItem.appendChild(logMessage);
                    logItemsDiv.appendChild(logItem);
                });
            </script>
            <style>
                .logItemDiv {
                    padding: 15px;
                }
                .icon {
                    padding-right: 10px;
                }
            </style>
        </head>
        <body>
            <main>
                <div id="logItems">
                </div>
            </main>
        </body>
        </html>`;
        this.updateTraceLog(this.LogPanel);
    }

    private updateTraceLog(logPanel : vscode.WebviewPanel | undefined) {
        let logPath = Helper.GetSQLLogPath();
        fs.readFile(logPath, "utf-8", function (err, content) {
            if (err)
                throw new ProBaseError(err.name, err.message);

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

