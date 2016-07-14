import { PageService } from './services/page-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { NewPage } from './new-page';

export class LaunchIndex {
    inputEl = null;
    search = "";
    suggestions = [];

    adding = false;

    static inject = [ PageService, EventAggregator, Element ];

    constructor(pageService, eventAggregator, element) {
        this.pageService = pageService;
        this.eventAggregator = eventAggregator;
        this.element = element;
    }

    bind() {
        this.eventAggregator.subscribe("KS_NEW", e => {
            this.add();
            window.setTimeout(() => {
                document.querySelector('#focus-load').focus()
            }, 1);
        });

        this.eventAggregator.subscribe("KS_GOOGLE", e => {
            this.google();
        });

        this.eventAggregator.subscribe("KS_GO", e => {
            this.go();
        });

        this.eventAggregator.subscribe("KS_ESCAPE", e => {
            if (this.adding) {
                this.adding = false;
            }
        });

        this.element.addEventListener(NewPage.EVENT_NAME, e => {
            this.pageService.addPage(e.detail.page);
            this.adding = false;
        });
    }

    google() {
        if (this.search.length > 0) {
            let encoded = encodeURI(this.search);

            window.location.href = `http://google.com/search?q=${encoded}`;
        }
    }

    go() {
        if (this.search.length > 0) {
            // TODO: Prefix with http :(
            window.location.href = this.search;
        }
    }

    attached() {
        this.inputEl.focus();

        this.inputEl.addEventListener('keyup', e => {
            this._triggerSearch();
        });
    }

    _triggerSearch() {
        if (this.search.length > 2) {
            this.suggest();
        } else if (this.search === "?") {
            this.suggestions = this.pageService.pages;
        } else {
            this.suggestions = [];
        }
    }

    delete(suggestion) {
        this.pageService.deletePage(suggestion);
        this._triggerSearch();
    }

    suggest() {
        this.suggestions = this.pageService.suggestPages(this.search);
    }

    add() {
        this.adding = true;
    }
}