import * as vscode from 'vscode'

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
                    var newSql = this.replaceParametersInSql(sqlQuery); // Replacing parameters value in SQL
                    newText += newSql + "\n\n";
                }

                currentTextEditor.edit((editBuilder) => {
                    editBuilder.replace(documentRange, newText.trim()); // Replacing editor text
                });
            }
        }
    }

    private static replaceParametersInSql(sqlQuery: string): string {
        var splitSql = sqlQuery.split("Parameters :");
        if (splitSql.length == 2) {
            sqlQuery = splitSql[0];
            var parameters = this.getSqlParameterObject(splitSql[1]);
            for (var parameter of parameters) {
                var paramValue = this.getValidParamValue(parameter);
                sqlQuery = sqlQuery.replace(parameter.Name, paramValue);
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