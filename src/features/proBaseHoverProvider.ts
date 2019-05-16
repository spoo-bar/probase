import * as vscode from 'vscode'
import Table from '../utils/table';
import Column from '../utils/column';

export default class ProBaseHoverProvider implements vscode.HoverProvider {

    State: vscode.Memento;

    public constructor(state: vscode.Memento) {
        this.State = state;
    }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        var selectedWord = document.getText(document.getWordRangeAtPosition(position));
        var table = this.State.get(selectedWord.toLowerCase()) as Table;
        if (table)
            return new vscode.Hover(this.buildIntellisense(table));
    }

    private buildIntellisense(table: Table): string | vscode.MarkdownString | { language: string; value: string; } {

        var tableDetails = this.buildTableIntellisense(table);
        var markdown = new vscode.MarkdownString(tableDetails);

        if (table.Columns) {

            markdown.appendMarkdown("\n***\n");

            for (var column of table.Columns) {
                var columnDetails = this.buildColumnIntellisense(column);
                markdown.appendMarkdown(columnDetails + ` - ${column.DataType}[${column.DataLength}]`);
            }
        }

        return markdown;
    }

    private buildColumnIntellisense(column: Column) {
        var columnDetails = `\n\n   \`${column.Name}\``;

        if (column.Nullable) {
            columnDetails += " *(nullable)*";
        }

        if (column.Description) {
            columnDetails += ` - ${column.Description}`;
        }

        return columnDetails;
    }

    private buildTableIntellisense(table: Table) {
        var tableDetails = `### ${table.Name}`;
        if (table.Description) {
            tableDetails += ` - ${table.Description}`;
        }
        return tableDetails;
    }
}