/// <reference types="cypress" />

declare namespace Cypress {
    interface TabOptions {
        timeout?: number,
        tab_name: string,
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/open
        windowFeatures?: string
    }

    interface TabVisitOptions extends Cypress.VisitOptions {
        /**
         * Defaults to `root`.
         */
        tab_name?: string
    }

    interface TabDebugData {
        active_tab_index: number,
        myTabNames: string[],
        myTabs: Window[],
    }

    interface Chainable<Subject = any> {
        openTab(url: string, opts: Cypress.TabOptions): Chainable<Subject>;

        /**
         * Pass an index or name to close a specific window, otherwise, pass nothing to delete the most recently opened
         * window in the stack.
         */
        closeTab(index_or_name?: number | string): void;

        /**
         *  Methods like `cy.reload`, `win.location.reload`, etc break our context aware popups. Use this special visit
         *  function that maintains our context awareness when navigating on the currently active context.
         */
        tabVisit(url: string, window_name: string): Chainable<Subject>;

        switchToTab(tab_name: string): Chainable<Subject>;

        /**
         * Close all popup windows.
         */
        closeAllTabs(): void;

        debugTabHelper(): Cypress.TabDebugData;

        /**
         * Adds a `tab_name` option to the original `visit` method.
         */
        visit(url: string, options?: Partial<Cypress.TabVisitOptions>): Chainable<Subject>;
    }
}
