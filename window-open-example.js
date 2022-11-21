cy.visit('/page-with-window-open',{

    // NOTE: we define a "tab_name" for the "Root Tab" so we can switch back to it
    tab_name: 'myRootWindow',

    onBeforeLoad(win) {
        // stub window.open with a custom version
        cy.stub(win, 'open', (url, target, features)=>{
            // our custom window.open that allows cypress to switch between the windows ("called tabs in the helpers")
            cy.openTab(url, {
                tab_name: 'MySecondWindow', // make this something you can call later to switch Cypress contexts between the parent window and the new window

                window_features: features,
            })
        }).as('windowOpen');
    }
})

// cy.click('Open New Window');

cy.get('@windowOpen').should('have.been.calledOnce')

const EXPECTED_WINDOW_OPEN_URL = 'https://mydomain.com/some-other-page';
cy.wrap(window.callMyJSThatCallsWindowOpen()).then(()=>{
    cy.get('@windowOpen').should('be.calledWith', EXPECTED_WINDOW_OPEN_URL)

    // switch to the new window
    cy.switchToTab('MySecondWindow')

    // TEST STUFF INSIDE THE SECOND WINDOW

    // Close the Tab
    cy.closeTab('MySecondWindow')

    // Switch back to the root window
    // NOTE: you can switch back and forth without closing the tab too
    cy.switchToTab('MyRootWindow')

})
