import { PageService } from './services/page-service';

export class LaunchIndex {
    inputEl = null;
    search = "";
    suggestions = [];

    static inject = [ PageService ];

    constructor(pageService) {
        this.pageService = pageService;
    }

    attached() {
        this.inputEl.focus();

        this.inputEl.addEventListener('keyup', e => {
            if (this.search.length > 2) {
                this.suggest();
            } else {
                this.suggestions = [];
            }
        });
    }

    suggest() {
        this.suggestions = this.pageService.suggestPages(this.search);
    }
}