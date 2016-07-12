import { Page } from './page';

export class ScoredPage extends Page {
    constructor(page, score) {
        super(page.url, page.tags);
        this.score = score;
    }
}