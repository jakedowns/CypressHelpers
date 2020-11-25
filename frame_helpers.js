// frame-helpers

let originalWindow = null;
let inside_frame = null;
let was_inside_frame = null;
function frameExit(force){
    //cy.log('frameExit',{force})
    if(inside_frame && !force){
        was_inside_frame = inside_frame;
    }
    if(!originalWindow){
        originalWindow = cy.state('window')
    }
    cy.state('window',originalWindow)
    cy.state('document',originalWindow.document)
    inside_frame = null;
}
function frameRestore(){
    //cy.log('frameRestore',{was_inside_frame})
    if(was_inside_frame){
        cy.frameEnter(was_inside_frame).then(()=>{
            was_inside_frame = null
        })
    }
    //return cy.wrap(true)
}
Cypress.Commands.add('frameExit',()=>{
    frameExit();
})

Cypress.Commands.add('frameWindow',(id)=>{
    return cy.get(id).then($el=>{
        return cy.wrap($el.prop('contentWindow'))
    })
})

function bind_wait_for_load(id,$el,frame_window,resolve){
    // attach a listener
    $el[0].onload = ()=>{
        $el[0].onload = null
        function checkReady(){
            // thought checking document.domain would work but it never seems to update
            // if(popup.document.domain !== "localhost"){
            // checking body length is important for chrome tho, otherwise it will try and execute tests on about:blank
            if(!frame_window.document.body || frame_window.document.body.innerHTML.length===0){
                setTimeout(()=>{
                    checkReady()
                },32); // arbitrary delay
            }else{
                //frameRestore()
                cy.frameEnter(id)
                resolve(cy.wrap($el));
            }
        }
        checkReady();
    }
}

Cypress.Commands.add('frameReload',(id)=>{
    return cy.frameVisit(id)
})

Cypress.Commands.add('frameVisit',(id,url)=>{
    //cy.log('frameVisit',id,url)
    frameExit(true) // reset context
    return cy.get(id).then($el => {
        let frame_window = $el.prop('contentWindow')
        return new Cypress.Promise((resolve)=>{
            bind_wait_for_load(id,$el,frame_window,resolve);
            if(!url){
                frame_window.location.reload();
            }else{
                frame_window.location.href = url;
            }
        })
    })
})

Cypress.Commands.add('frameEnter',(id)=>{
    //cy.log('frameEnter',id)
    frameExit(true) // reset context
    inside_frame = id
    return cy.frameWindow(id).then(frame_window => {
        cy.state('window',frame_window)
        cy.state('document',frame_window.document)
        return cy.wrap(frame_window)
    })
})

Cypress.Commands.add('frameBody',(id)=>{
    return cy.get(id).then($el=>{
        return cy.wrap($el.prop('contentWindow').document.body)
    })
})

Cypress.Commands.add('frameResize',(id,width,height,delay)=>{
    frameExit()
    //cy.log('frameResize',JSON.stringify({
    //     id,
    //     width,
    //     height,
    //     delay
    // })
    cy.get(id).then($el=>{
        cy.wrap(new Cypress.Promise((resolve)=>{
            let currentWidth = $el.width()
            let currentHeight = $el.height()
            let nextWidth = width || currentWidth;
            let nextHeight = height || currentHeight;
            $el.attr('width',`${nextWidth}px`)
            $el.attr('height',`${nextHeight}px`)
            resolve()
        }))
        frameRestore()
    })
})
