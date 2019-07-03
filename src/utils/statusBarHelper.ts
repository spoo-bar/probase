import * as vscode from 'vscode';

export default class StatusBarHelper {

    public static createStatusBarItems(): void {
        var replaceParametersStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        replaceParametersStatusItem.text = "$(zap) Replace Parameters";
        replaceParametersStatusItem.tooltip = "Replace parameters in SQL";
        replaceParametersStatusItem.command = "extension.replaceSQLParameters";
        replaceParametersStatusItem.show();

        var removeDbNameStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        removeDbNameStatusItem.text = "$(trashcan) Remove Database Name";
        removeDbNameStatusItem.tooltip = "Remove database name from query";
        removeDbNameStatusItem.command = "extension.cleanDatabaseName";
        removeDbNameStatusItem.show();

        var openLogViewerStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        openLogViewerStatusItem.text = "$(clippy) Open SQL Log Viewer";
        openLogViewerStatusItem.tooltip = "Open SQL Log Viewer";
        openLogViewerStatusItem.command = "extension.openSQLLogViewer";
        openLogViewerStatusItem.show();

        this.createAdditionalStatusbarItems();
    }

    private static createAdditionalStatusbarItems(): void {

        var bornToday = new Employees().bornToday();
        if (bornToday.length > 0) {

            var statusText = this.getStatusText(bornToday);

            var openLogViewerStatusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
            openLogViewerStatusItem.text = "$(person) " + statusText;
            openLogViewerStatusItem.tooltip = statusText;
            openLogViewerStatusItem.show();
        }
    }
    
    private static getStatusText(bornToday: Employee[]) : string {
        var names : string = "";
        if(bornToday.length == 1) {
            names += bornToday[0].name;
        }
        else if(bornToday.length == 2) {
            names += bornToday[0].name + " and " + bornToday[1].name;
        }
        else {
            for(let emp of bornToday) {
                names += emp.name + " and "; 
            }
            names = names.substring(0, names.lastIndexOf("and "));
        }
            
        return `Happy Birthday, ${names}!!`;
    }
}
class Employee {

    name: string;
    dob: Date;

    constructor(name: string, date: Date) {
        this.name = name;
        this.dob = date;
    }

}

class Employees {
    employees: Employee[];

    /**
     *
     */
    constructor() {
        this.employees = [];
        this.employees.push(new Employee("Anubrotho", new Date(2019, 3, 10)));
        this.employees.push(new Employee("Balaji", new Date(2019, 1, 5)));
        this.employees.push(new Employee("Chayan", new Date(2019, 5, 13)));
        this.employees.push(new Employee("Boanerges", new Date(2019, 0, 18)));
        this.employees.push(new Employee("Dhureen", new Date(2019, 1, 3)));
        this.employees.push(new Employee("Girish", new Date(2019, 1, 23)));
        this.employees.push(new Employee("Harsha", new Date(2019, 8, 28)));
        this.employees.push(new Employee("Hemaraju", new Date(2019, 8, 28)));
        this.employees.push(new Employee("Janmejoy", new Date(2019, 9, 14)));
        this.employees.push(new Employee("Muraliprasad", new Date(2019, 9, 2)));
        this.employees.push(new Employee("Keertinath", new Date(2019, 4, 31)));
        this.employees.push(new Employee("Mayank", new Date(2019, 2, 9)));
        this.employees.push(new Employee("Mubeen", new Date(2019, 0, 25)));
        this.employees.push(new Employee("Muralidharan", new Date(2019, 7, 22)));
        this.employees.push(new Employee("Pradeep", new Date(2019, 4, 16)));
        this.employees.push(new Employee("Prakash", new Date(2019, 1, 18)));
        this.employees.push(new Employee("Prashanth", new Date(2019, 6, 5)));
        this.employees.push(new Employee("Praveen", new Date(2019, 6, 25)));
        this.employees.push(new Employee("Sahil", new Date(2019, 8, 17)));
        this.employees.push(new Employee("Shwetha", new Date(2019, 3, 23)));
        this.employees.push(new Employee("Spoorthi", new Date(2019, 10, 6)));
        this.employees.push(new Employee("Srivatsa", new Date(2019, 2, 10)));
        this.employees.push(new Employee("Venkatesh", new Date(2019, 5, 1)));
    }

    public bornToday(): Employee[] {
        let today = new Date();
        let bornToday: Employee[] = [];
        for (let emp of this.employees) {
            if (emp.dob.getMonth() == today.getMonth()) {
                if (emp.dob.getDate() == today.getDate()) {
                    bornToday.push(emp);
                }
            }
        }
        return bornToday;
    }
}

