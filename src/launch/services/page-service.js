import { Page } from '../model/page';
import { ScoredPage } from '../model/scored-page';
import { LocalStore } from './local-store';

export class PageService {
    static STORAGE_KEY = "pages";
    static inject = [ LocalStore ];
    pages = [];

    constructor(localStore) {
        this.localStore = localStore;
        this.pull();
    }

    suggestPages(query) {
        let tokenize = query.replace(",", " ").split(" ").filter(t => t.length);

        let pages = this.pages
            .map(page => this.score(tokenize, page))
            .filter(page => page.score > 0)
            .sort((a, b) => b.score - a.score);

        return pages;
    }

    score(tokens, page) {
        // If any of the tokens match the page tags
        let matches = tokens.filter(token => -1 !== page.tags.indexOf(token) || page.tags.filter(tag => tag.startsWith(token)).length);

        return new ScoredPage(page, matches.length);
    }

    addPage(page) {
        this.pages.push(page);
        this.push();
    }

    deletePage(page) {
        let index = this.pages.indexOf(page);

        if (-1 !== index) {
            this.pages.splice(index, 1);
            this.push();
        }
    }

    /**
     * Push the current state
     */
    push() {
        this.localStore.saveJSON(PageService.STORAGE_KEY, this.pages);
    }

    pull() {
        let storedPages = this.localStore.getJSON(PageService.STORAGE_KEY);

        if (null !== storedPages && Array.isArray(storedPages)) {
            // Convert out
            this.pages = storedPages.map(j => new Page(j.url, j.tags));
        } else {
            this.pages = [];
        }
    }
}