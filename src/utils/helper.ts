import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import ProBaseError from './probaseError';
import Table from './table';

export default class Helper {

    public static IsDocumentationLoaded : string = "IsDocumentationLoaded";

    public static GetDbScriptsPath(): string {
        return vscode.workspace.getConfiguration().get("code.dbscriptsFolderPath") as string;
    }

    public static IsRepositorySetup(): boolean {
        var dbScriptRepoFolder = this.GetDbScriptsPath();
        if (!dbScriptRepoFolder)
            return false;
        else if (dbScriptRepoFolder === "")
            return false;
        return true;
    }

    public static GetTablesFolderPath(): string {
        if (Helper.IsRepositorySetup()) {
            if (fs.existsSync(Helper.GetDbScriptsPath())) {
                var tablesFolder = path.join(Helper.GetDbScriptsPath(), "Source", "LATEST_INSTALL", this.GetSQLFolder(), "tables");
                if (fs.existsSync(tablesFolder)) {
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

    public static LoadDocumentation(state: vscode.Memento): void {

        if (this.IsRepositorySetup()) {
            var documentationFilePath = path.join(this.GetDbScriptsPath(), "documentation.json");
            fs.readFile(documentationFilePath, "utf-8", function (err, content) {

                if (err)
                    throw new ProBaseError(err.name, err.message);

                state.update(Helper.IsDocumentationLoaded, true);
                JSON.parse(content).forEach((element: any) => {
                    var table: Table = Object.assign(new Table(), element);
                    state.update(table.Name.toLowerCase(), table);
                });
            });
        }
    }

    public static GetSQLLogPath() : string {
        return vscode.workspace.getConfiguration().get("code.sqlLogPath") as string;
    }

    public static ClearLogFile() : void {
        var logFilePath = this.GetSQLLogPath();
        fs.writeFile(logFilePath, '', function (err) {
            if(err)
                throw new ProBaseError(err.name, err.message);
        });
    }

    private static GetSQLFolder(): string {
        var sqlSource = this.GetSqlSource();
        switch (sqlSource) {
            case SQLSource.MSSQL: return "mssql_source";
            case SQLSource.Oracle: return "oracle_source";
            default: throw new ProBaseError("SqlSourceInvalid", sqlSource + " is not a valid Sql Source value.");
        }
    }

    private static GetSqlSource(): SQLSource {
        var sqlSourceValue = vscode.workspace.getConfiguration().get("code.sqlSource") as string;
        if (sqlSourceValue === "MS SQL")
            return SQLSource.MSSQL;
        else
            return SQLSource.Oracle;
    }
}

enum SQLSource {
    MSSQL,
    Oracle
}