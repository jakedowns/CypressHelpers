describe('WindowTest',()=>{

    it('can visit page, trigger window.open, and visit opened window',()=>{
        cy.visit('http://localhost:8081',{

            // NOTE: we define a "tab_name" for the "Root Tab" so we can switch back to it
            // tab_name: 'myRootWindow',
            // note if you don't define a tab_name, it will be "root" by default

            onBeforeLoad(win) {
                // stub window.open with a custom version
                cy.stub(win, 'open', (url, target, features)=>{
                    console.warn('window.open was called: ',{url,target,features})
                    // our custom window.open that allows cypress to switch between the windows ("called tabs in the helpers")
                    cy.openTab(url, {
                        // make this something you can call later to switch Cypress contexts between the parent window and the new window
                        // this is required
                        tab_name: 'MySecondWindow',

                        // these can control window size and position
                        window_features: features,
                    })

                    return true;
                }).as('windowOpen');
            }
        })

        cy.get('h1').should('have.text', 'root page')

        // --- OR 1. trigger button with onclick handler that calls window.open
        // cy.get('.trigger_button').click();

        // --- OR 2. trigger JS that calls window.open
        cy.window().then(window=>{
            window.callMyJSThatCallsWindowOpen()
        })

        const EXPECTED_WINDOW_OPEN_URL = 'http://localhost:8081/popup.html';

        cy.get('@windowOpen').should('have.been.calledOnce')
        cy.get('@windowOpen').should('be.calledWith', EXPECTED_WINDOW_OPEN_URL)

        // switch to the new window
        // (we should already be in the context of the popup)
        //cy.switchToTab('MySecondWindow')

        // TEST STUFF INSIDE THE SECOND WINDOW
        cy.get('h1').should('have.text', 'popup page')

        // Close the Tab
        cy.closeTab('MySecondWindow')

        // Switch back to the root window
        // NOTE: you can switch back and forth without closing the tab too
        // if you only opened ONE window, closeTab will switch you back to the root window
        // cy.switchToTab('MyRootWindow')
        // cy.switchToTab('root')

        // test we're back in the root window
        cy.get('h1').should('have.text', 'root page')
    })
})
