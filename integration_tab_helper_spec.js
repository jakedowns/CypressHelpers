import {CONSTS} from '../support/constants'
let {AMS_URL,API_URL} = CONSTS;

const PAGE_A = "http://baseUrl.site/pageA"
const PAGE_B = "http://subdomain.baseUrl.site/pageB"
const PAGE_C = "http://sudomain2.baseUrl.site/pageC"

// todo test tabVisit on root
describe('Cypress Tab Helper',()=>{
    it('names the root window "root" by default',()=>{
        cy.visit(PAGE_A).then(()=>{
            cy.debugTabHelper().then(debug=>{
                expect(debug.myTabNames.length).to.eq(1)
                expect(debug.myTabNames[0]).to.eq('root')
            })
        })
        cy.get('h1').invoke('text').should('include','404: Page Not Found')
    })
    it('accepts a tab_name option when calling cy.visit for tracking the name of the root page',()=>{
        cy.visit(PAGE_A,{tab_name: 'myRootWindow'}).then(()=>{
            cy.debugTabHelper().then(debug=>{
                expect(debug.myTabNames.length).to.eq(1)
                expect(debug.myTabNames[0]).to.eq('myRootWindow')
            })
        })
        cy.get('h1').invoke('text').should('include','404: Page Not Found')
    })
    it('can open a new tab',()=>{
        cy.openTab(PAGE_B,{tab_name: 'myNewTab'}).then(()=>{
            cy.get('.page__header h1').invoke('text').should('include','Submit Feedback')
            cy.debugTabHelper().then(debug=>{
                expect(debug.myTabNames.length).to.eq(2)
                expect(debug.myTabNames[0]).to.eq('myRootWindow')
                expect(debug.myTabNames[1]).to.eq('myNewTab')
                expect(debug.active_tab_index).to.eq(1)
            })
        })
    })
    it('can switch context back to the root window by name',()=>{
        cy.switchToTab('myRootWindow')
        cy.debugTabHelper().then(debug=>{
            expect(debug.myTabNames.length).to.eq(2)
            expect(debug.myTabNames[0]).to.eq('myRootWindow')
            expect(debug.myTabNames[1]).to.eq('myNewTab')
            expect(debug.active_tab_index).to.eq(0)
        })
        cy.get('h1').invoke('text').should('include','404: Page Not Found')
    })
    it('can navgiate the popup to another url without switching to it first',()=>{
        cy.tabVisit(PAGE_C,'myNewTab').then(()=>{
            cy.debugTabHelper().then(debug=>{
                expect(debug.myTabNames.length).to.eq(2)
                expect(debug.myTabNames[0]).to.eq('myRootWindow')
                expect(debug.myTabNames[1]).to.eq('myNewTab')
                expect(debug.active_tab_index).to.eq(1)
            })
            cy.window().then(win=>{
                console.log('huh3?',win.ATABNAME)
            })
            cy.get('.page__header h1').invoke('text').should('include','Contact Us')
        })
    })
    it('can open more tabs',()=>{
        let namesToCheck = []
        function additionalTestTab(i){
            return new Cypress.Promise((resolve, reject) =>{
                let tab_name = `myPopup${i}`;
                cy.openTab(PAGE_A,{tab_name}).then(()=>{
                    cy.debugTabHelper().then(debug=>{
                        namesToCheck.push(tab_name)
                        expect(debug.myTabs.length).to.eq(2+i+1)
                        expect(debug.myTabNames.length).to.eq(2+i+1)
                        expect(debug.myTabNames[0]).to.eq('myRootWindow')
                        expect(debug.myTabNames[1]).to.eq('myNewTab')
                        namesToCheck.forEach((name,i2)=>{
                            console.log('checking',{namesToCheck,b:debug.myTabNames,name,i})
                            expect(debug.myTabNames[2+i2]).to.eq(name)
                        })
                        expect(debug.active_tab_index).to.eq(i+2)
                        resolve()
                    })
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
