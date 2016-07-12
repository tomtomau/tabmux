class Page {
    constructor(url, tags) {
        this.url = url;
        this.tags = tags;
    }
}

class ScoredPage extends Page {
    constructor(page, score) {
        super(page.url, page.tags);
        this.score = score;
    }
}

export class PageService {
    constructor() {
        this.pages = [
            new Page("https://news.ycombinator.com/", [ "news", "ycombinator" ]),
        ];
    }

    suggestPages(query) {
        let tokenize = query.replace(",", " ").split(" ").filter(t => t.length);

        let pages = this.pages
            .map(page => this.score(tokenize, page))
            .filter(page => page.score > 0)
            .sort((a, b) => b.score - a.score)

        return pages;
    }

    score(tokens, page) {
        // If any of the tokens match the page tags
        let matches = tokens.filter(token => -1 !== page.tags.indexOf(token) || page.tags.filter(tag => tag.startsWith(token)).length);

        return new ScoredPage(page, matches.length);
    }
}