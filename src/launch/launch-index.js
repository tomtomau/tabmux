import { PageService } from './services/page-service';
import { EventAggregator } from 'aurelia-event-aggregator';

export class LaunchIndex {
    inputEl = null;
    search = "";
    suggestions = [];

    adding = false;

    static inject = [ PageService, EventAggregator ];

    constructor(pageService, eventAggregator) {
        this.pageService = pageService;
        this.eventAggregator = eventAggregator;
    }

    bind() {
        this.eventAggregator.subscribe("KS_NEW", e => {
            this.add();
            window.setTimeout(() => {
                document.querySelector('#focus-load').focus()
            }, 1);
        });
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

    add() {
        this.adding = true;
    }
}