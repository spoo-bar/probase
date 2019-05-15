import * as vscode from 'vscode'

export default class ProBaseError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    
    public constructor(errorName : string, errorMessage : string, errorStack? : string | undefined) {
        this.name = errorName;
        this.message = errorMessage;
        this.stack = errorStack;
        
        vscode.window.showErrorMessage(this.message);
    }

}