export class LocalStore {
    static inject = [ window.localStorage ];

    constructor(localStorage) {
        this.localStorage = window.localStorage;
    }

    saveJSON(key, value) {
        let stringValue = JSON.stringify(value);
        this.localStorage.setItem(key, stringValue);
    }

    getJSON(key) {
        let storedString = this.localStorage.getItem(key);

        if (null === storedString) {
            return storedString;
        }

        return JSON.parse(storedString);
    }
}