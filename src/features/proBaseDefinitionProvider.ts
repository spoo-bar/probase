import * as vscode from 'vscode'
import Helper from '../utils/helper';
import * as fs from 'fs';
import * as path from 'path';
import * as sqlops from 'sqlops';

export default class ProBaseDefinitionProvider implements vscode.DefinitionProvider {

    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {

        var selectedWord = document.getText(document.getWordRangeAtPosition(position));
        var wordDefinitionFile = path.join(Helper.GetTablesFolderPath(), selectedWord + ".sql");
        this.selectTableNode(selectedWord);       

        if (fs.existsSync(wordDefinitionFile)) {
            var fileUri = vscode.Uri.file(wordDefinitionFile);
            var position = new vscode.Position(0, 0);
            return new vscode.Location(fileUri, position)
        }
        return null;
    }


    private selectTableNode(selectedWord: string) {
        if(sqlops) {
            if(sqlops.connection) {
                sqlops.connection.getCurrentConnection().then(connection => {
                    if (connection) {
                        const dbName: string = connection.options.database;
                        sqlops.objectexplorer.getNode(connection.connectionId).then(serverNode => {
                            if (serverNode) {
                                serverNode.getChildren().then(serverNodeChildren => {
                                    if (serverNodeChildren) {
                                        for (var serverNodeChild of serverNodeChildren) {
                                            if (serverNodeChild.label === "Databases") {
                                                serverNodeChild.getChildren().then(databaseNodeChildren => {
                                                    if (databaseNodeChildren) {
                                                        for (var databaseNodeChild of databaseNodeChildren) {
                                                            if (databaseNodeChild.label === dbName) {
                                                                databaseNodeChild.getChildren().then(databaseChildren => {
                                                                    if (databaseChildren) {
                                                                        for (var databaseChild of databaseChildren) {
                                                                            if (databaseChild.label === "Tables") {
                                                                                databaseChild.getChildren().then(tablesChildren => {
                                                                                    if (tablesChildren) {
                                                                                        for (var tablesChild of tablesChildren) {
                                                                                            const tableName = "dbo." + selectedWord;
                                                                                            if (tablesChild.label.toLowerCase() === tableName.toLowerCase()) {
                                                                                                tablesChild.setSelected(true, true);
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    }
}