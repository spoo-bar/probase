import * as vscode from 'vscode'
import Helper from '../utils/helper';
import * as fs from 'fs';
import * as path from 'path';

export default class ProBaseDefinitionProvider implements vscode.DefinitionProvider {

    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {

        var selectedWord = document.getText(document.getWordRangeAtPosition(position));
        var wordDefinitionFile = path.join(Helper.GetTablesFolderPath(), selectedWord + ".sql");
        if (fs.existsSync(wordDefinitionFile)) {
            var fileUri = vscode.Uri.file(wordDefinitionFile);
            var position = new vscode.Position(0, 0);
            return new vscode.Location(fileUri, position)
        }
        return null;
    }

}