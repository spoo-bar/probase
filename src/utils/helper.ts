import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import ProBaseError from './probaseError';

export default class Helper {

    public static GetDbScriptsPath() : string {
        return vscode.workspace.getConfiguration().get("code.dbscriptsFolderPath") as string;
    }

    public static IsRepositorySetup(): boolean {
        var dbScriptRepoFolder = this.GetDbScriptsPath();
        if(!dbScriptRepoFolder)
            return false;
        else if (dbScriptRepoFolder === "")
            return false;
        return true;
    }

    public static GetTablesFolderPath() : string {
        if(Helper.IsRepositorySetup()) {
            if(fs.existsSync(Helper.GetDbScriptsPath())) {
                var tablesFolder = path.join(Helper.GetDbScriptsPath(), "Source", "LATEST_INSTALL", "mssql_source", "tables");
                if(fs.existsSync(tablesFolder)) {
                    return tablesFolder;
                }
                else {
                    throw new ProBaseError("DbScriptsPathInvalid", "The path " + tablesFolder + " is invalid.");
                }
            }
            else {
                throw new ProBaseError("DbScriptsPathInvalid", "DbScript Repository path is invalid and does not exist.");
            }
        }
        else {
            throw new ProBaseError("RepositoryNotSetup", "DbScripts Repository path not setup in File > Preferences > Settings");
        }
    }
}