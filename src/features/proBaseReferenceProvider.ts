import * as vscode from 'vscode'
import Helper from '../utils/helper';
import * as fs from 'fs';
import * as path from 'path';

export default class ProBaseReferenceProvider implements vscode.ReferenceProvider {


    provideReferences(
        document: vscode.TextDocument, 
        position: vscode.Position, 
        context: vscode.ReferenceContext, 
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location[]> {

        var selectedWord = document.getText(document.getWordRangeAtPosition(position));
        var upgradeScriptsPath = Helper.GetUpgradeScriptsFolderPath();  

        return this.getReferencesLocation(upgradeScriptsPath, selectedWord);
    }


    private getReferencesLocation(upgradeScriptsPath: string, selectedWord: string) {
        let result: vscode.Location[] = [];
        for (const reference of this.getReferences(upgradeScriptsPath, selectedWord)) {
            let uri = vscode.Uri.file(reference.filePath);
            let location = new vscode.Location(uri, new vscode.Range(Math.max(0, reference.location.start.line - 1), Math.max(reference.location.start.offset - 1, 0), Math.max(0, reference.location.end.line - 1), Math.max(0, reference.location.end.offset - 1)));
            result.push(location);
        }
        return result;
    }

    private getReferences(upgradeScriptsPath: string, word: string) {
        let filesReference: Response[] = [];
        for (let file of this.getUpgradeScriptsFilePath(upgradeScriptsPath)) {
            let content = fs.readFileSync(file, "utf-8");
            if (content) {
                if (content.includes(word)) {
                    content.split("\n").forEach(function (line, i) {
                        if (line.includes(word)) {
                            let referenceLocation = new ReferenceLocation();
                            referenceLocation.start = new Location();
                            referenceLocation.start.line = i + 1;
                            referenceLocation.start.offset = line.indexOf(word) + 1;
                            referenceLocation.end = new Location();
                            referenceLocation.end.line = i + 1;
                            referenceLocation.end.offset = referenceLocation.start.offset + vscode.WorkspaceEdit.length;
                            let response = new Response();
                            response.filePath = file;
                            response.location = referenceLocation;
                            filesReference.push(response);
                        }
                    });
                }
            }
        }
        return filesReference;
    }

    private getUpgradeScriptsFilePath(upgradeScriptsPath: string) {
        let files : string[] = [];
        fs.readdirSync(upgradeScriptsPath)
            .filter(file => fs.statSync(path.join(upgradeScriptsPath, file)).isDirectory())
            .map(folder => path.join(upgradeScriptsPath, folder))
            .forEach(folder => fs.readdirSync(folder)
                .filter(file => fs.statSync(path.join(folder, file)).isFile())
                .forEach(file => files.push(path.join(folder, file))));
        return files;
    }
}

class Response {
    filePath!: string;
    location!: ReferenceLocation;
}

class ReferenceLocation {
    start!: Location;
    end!: Location;
}

class Location {
    line!: number;
    offset!: number;
}