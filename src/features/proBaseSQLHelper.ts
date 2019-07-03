import * as vscode from 'vscode'
import Helper from '../utils/helper';
const sqlFormatter = require('sql-formatter'); // TODO : replace this with import statement after writing a type definition https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam

export default class ProBaseSQLHelper {

    public static replaceParameters(): void {

        var currentTextEditor = vscode.window.activeTextEditor;

        if (currentTextEditor) {
            var document = currentTextEditor.document;
            if (document.languageId === "sql") {
                var text = document.getText();
                var sqlQueries = text.split(/\n\s*\n/); // Splitting on double new line
                var documentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount, 0));

                var newText: string = "";
                for (var sqlQuery of sqlQueries) {
                    newText += ProBaseSQLHelper.getNewSqlQuery(sqlQuery);
                }

                currentTextEditor.edit((editBuilder) => {
                    editBuilder.replace(documentRange, newText.trim()); // Replacing editor text
                });
            }
        }
    }

    public static cleanDatabaseName(): void {
        var currentTextEditor = vscode.window.activeTextEditor;

        if (currentTextEditor) {
            var document = currentTextEditor.document;
            if (document.languageId === "sql") {

                vscode.window.showInputBox({ prompt: "Input the database name", placeHolder: "ProArc7" }).then((dbName) => {
                    if (dbName) {
                        var text = sqlFormatter.format(document.getText(), { indent: '    ' });
                        var documentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount, 0));

                        var dbNameString_sql = `[${dbName}]..`;
                        var dbNameString_ora = `[${dbName}].`;

                        var newText: string = "";
                        for(let line of text.split("\n")) {
                            let newLine : string = "";
                            newLine = line.replace(dbNameString_sql, " ");
                            newLine = newLine.replace(dbNameString_ora, " ");
                            newText += newLine + "\n";
                        }
                        newText = sqlFormatter.format(newText, { indent: '    ' });
                        currentTextEditor!.edit((editBuilder) => {
                            editBuilder.replace(documentRange, newText.trim()); // Replacing editor text
                        });
                    }
                });
            }
        }
    }

    private static getNewSqlQuery(sqlQuery: string) {
        var newSql = this.replaceParametersInSql(sqlQuery); // Replacing parameters value in SQL
        if (Helper.ShouldFormatDocument())
            newSql = sqlFormatter.format(newSql, { indent: '    ' })
        return newSql + "\n\n";
    }

    private static replaceParametersInSql(sqlQuery: string): string {
        var splitSql = sqlQuery.split("Parameters :");
        if (splitSql.length == 1)
            splitSql = sqlQuery.split("Parameters:");
        if (splitSql.length == 2) {
            sqlQuery = splitSql[0];
            var parameters = this.getSqlParameterObject(splitSql[1]);
            for (var parameter of parameters) {
                var paramValue = this.getValidParamValue(parameter);
                sqlQuery = sqlQuery.replace(new RegExp(parameter.Name, "g"), paramValue);
            }

        }
        return sqlQuery;
    }

    private static getValidParamValue(parameter: SQLParameter): string {
        if (this.isNumber(parameter))
            return parameter.Value;
        else
            return `'${parameter.Value}'`
    }

    private static getSqlParameterObject(parameterString: string): SQLParameter[] {
        var parameterValues = parameterString.split(',');
        var parameters: SQLParameter[] = [];

        for (var parameter of parameterValues) {
            var paramName = parameter.split('=')[0];
            var paramValue = parameter.split('=')[1];
            parameters.push(new SQLParameter(paramName.trim(), paramValue.trim()));
        }

        return parameters;
    }

    private static isNumber(param: SQLParameter): boolean {
        return /^-?\d+$/.test(param.Value);
    }
}

class SQLParameter {

    Name: string;
    Value: string;

    public constructor(name: string, value: string) {
        this.Name = name;
        this.Value = value;
    }
}