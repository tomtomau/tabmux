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


        this.element.addEventListener(NewPage.EVENT_NAME, e => {
            this.pageService.addPage(e.detail.page);
            this.adding = false;
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