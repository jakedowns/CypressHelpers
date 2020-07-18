// const PAGE_A = "http://baseUrl.site/pageA"
// const PAGE_B = "http://subdomain.baseUrl.site/pageB"
// const PAGE_C = "http://sudomain2.baseUrl.site/pageC"

const PAGE_A = "/404"
const PAGE_B = "/contact/submit-feedback"
const PAGE_C = "/contact"

const PAGE_A_VALIDATOR = ()=>{
    cy.get('body.404').should('exist')
    cy.get('h1').invoke('text').should('include','404: Page Not Found')
}
const PAGE_B_VALIDATOR = ()=>{
    cy.get('body.contact-submit-feedback').should('exist')
    cy.get('.page__header h1').invoke('text').should('include','Submit Feedback')
}
const PAGE_C_VALIDATOR = ()=>{
    cy.get('body.contact').should('exist')
    cy.get('.page__header h1').invoke('text').should('include','Contact Us')
}

describe('Cypress Tab Helper',()=>{
    it('names the root window "root" by default',()=>{
        cy.visit(PAGE_A)
        PAGE_A_VALIDATOR()
        //
        cy.debugTabHelper().then(debug=>{
            expect(debug.myTabNames.length).to.eq(1)
            expect(debug.myTabNames[0]).to.eq('root')
        })
    })
    it('accepts a tab_name option when calling cy.visit for tracking the name of the root page',()=>{
        cy.visit(PAGE_A,{tab_name: 'myRootWindow'})
        PAGE_A_VALIDATOR()
        //
        cy.debugTabHelper().then(debug=>{
            expect(debug.myTabNames.length).to.eq(1)
            expect(debug.myTabNames[0]).to.eq('myRootWindow')
        })
    })
    it('can open a new tab',()=>{
        cy.openTab(PAGE_B,{tab_name: 'myNewTab'})
        PAGE_B_VALIDATOR()
        //
        cy.debugTabHelper().then(debug=>{
            expect(debug.myTabNames.length).to.eq(2)
            expect(debug.myTabNames[0]).to.eq('myRootWindow')
            expect(debug.myTabNames[1]).to.eq('myNewTab')
            expect(debug.active_tab_index).to.eq(1)
        })
    })
    it('can switch context back to the root window by name',()=>{
        cy.switchToTab('myRootWindow')
        PAGE_A_VALIDATOR()
        //
        cy.debugTabHelper().then(debug=>{
            expect(debug.myTabNames.length).to.eq(2)
            expect(debug.myTabNames[0]).to.eq('myRootWindow')
            expect(debug.myTabNames[1]).to.eq('myNewTab')
            expect(debug.active_tab_index).to.eq(0)
        })
    })
    it('can navgiate the popup to another url without switching to it first',()=>{
        cy.tabVisit(PAGE_C,'myNewTab')
        PAGE_C_VALIDATOR()
        //
        cy.debugTabHelper().then(debug=>{
            expect(debug.myTabNames.length).to.eq(2)
            expect(debug.myTabNames[0]).to.eq('myRootWindow')
            expect(debug.myTabNames[1]).to.eq('myNewTab')
            expect(debug.active_tab_index).to.eq(1)
        })
    })
    it('can open more tabs',()=>{
        let namesToCheck = []
        function additionalTestTab(i){
            return new Cypress.Promise((resolve, reject) =>{
                let tab_name = `myPopup${i}`;
                cy.openTab(PAGE_A,{tab_name})
                PAGE_A_VALIDATOR()
                //
                cy.debugTabHelper().then(debug=>{
                    namesToCheck.push(tab_name)
                    expect(debug.myTabs.length).to.eq(2+i+1)
                    expect(debug.myTabNames.length).to.eq(2+i+1)
                    expect(debug.myTabNames[0]).to.eq('myRootWindow')
                    expect(debug.myTabNames[1]).to.eq('myNewTab')
                    namesToCheck.forEach((name,i2)=>{
                        //console.log('checking',{namesToCheck,b:debug.myTabNames,name,i})
                        expect(debug.myTabNames[2+i2]).to.eq(name)
                    })
                    expect(debug.active_tab_index).to.eq(i+2)
                    resolve()
                })
            })
        }
        for(var i=0; i<5; i++){
            additionalTestTab(i)
        }
    })
    it('can close a tabs by name',()=>{
        cy.closeTab('myNewTab')
    })
    // it('can\'t close the root window',()=>{
    //     cy.switchToTab('myRootWindow')
    //     cy.closeTab()
    //     // TODO stub & expect error
    // })
    it('can close all tabs (execept root)',()=>{
        cy.closeAllTabs()
    })
})
