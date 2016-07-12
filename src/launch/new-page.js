import { Page } from './model/page';

export class NewPage {
    static EVENT_NAME = "new-page";
    url = "";
    tags = "";

    static inject = [ Element ];

    constructor(element) {
        this.element = element;
    }

    /**
     * This is a lazy override so that when you add it again, it's empty
     */
    bind() {
        this.url = "";
        this.tags = "";
    }

    save() {
        let event = new CustomEvent(NewPage.EVENT_NAME, {
            bubbles: true,
            detail: {
                page: new Page(this.url, this.tags)
            }
        });

        this.element.dispatchEvent(event);
    }
}