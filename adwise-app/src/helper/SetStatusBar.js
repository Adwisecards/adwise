export class SetStatusBar {
    static statusBar;

    static setStatusBar(statusBar) {
        this.statusBar = statusBar;
    }

    static getStatusBar() {
        return this.statusBar;
    }
}
