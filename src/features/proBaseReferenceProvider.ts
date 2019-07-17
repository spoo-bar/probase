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

        let files: string[] = [];
        // Get all upgrade scripts files path
        fs.readdirSync(upgradeScriptsPath)
            .filter(file => fs.statSync(path.join(upgradeScriptsPath, file)).isDirectory())
            .map(folder => path.join(upgradeScriptsPath, folder))
            .forEach(folder => 
                fs.readdirSync(folder)
                    .filter(file => fs.statSync(path.join(folder, file)).isFile())
                    .forEach(file => files.push(path.join(folder, file))));        

        // Getting references of match
        let filesReference: Response[] = [];
        for(let file of files) {
            let content = fs.readFileSync(file, "utf-8");
            if(content) {
                if(content.includes(selectedWord)) {
                    content.split("\n").forEach(function (line, i) {
                        if(line.includes(selectedWord)) {
                            let referenceLocation = new ReferenceLocation();
                            referenceLocation.start = new Location();
                            referenceLocation.start.line = i + 1;
                            referenceLocation.start.offset = line.indexOf(selectedWord) + 1;

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

        // Formatting results 
        let result: vscode.Location[] = [];
        for(const ref of filesReference) {
            let uri = vscode.Uri.file(ref.filePath);
            let location = new vscode.Location(uri, new vscode.Range(
                Math.max(0, ref.location.start.line - 1), Math.max(ref.location.start.offset - 1, 0),
                Math.max(0, ref.location.end.line - 1), Math.max(0, ref.location.end.offset - 1)
            ));
            result.push(location);
        }

        return result;

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