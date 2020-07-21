# CypressHelpers
cypress tips and tricks i've found

## Tip 1: Switching "Tabs" / Switching between windows

## Cypress Tab Helper Commands Reference
See tab-helpers.js. Just add it to your `support/commands.js` file
They're really popup-windows or child-windows, but i call them tabs for api brevity
- `cy.openTab(url, opts)`
- `cy.tabVisit(url, window_name)`
- `cy.switchToTab(tab_name)`
- `cy.closeTab(index_or_name)` - pass nothing to close active tab
- `cy.closeAllTabs()`
- `cy.visit` added support for `options.window_name` (defaults to `root`)
- debugTabHelper

### Why?
If you're like me, when you first started using Cypress you fell in love immedately but then were annoyed by some of their opinionated descisions.
For example: not supporting switching between "tabs" or pop-up windows.
Luckily, vp of eng of Cypress, [@bahmutov](https://twitter.com/bahmutov) posted on his peronal Blog and Github repo about frame-busting and "Cypress using child window": 
- [Original Blog Post](https://glebbahmutov.com/blog/cypress-using-child-window/) 
- [His `cypress-open-child-window` Repo](https://github.com/bahmutov/cypress-open-child-window) 
  - [My Fork of his Repo](https://github.com/jakedowns/cypress-open-child-window)
    - [My PR](https://github.com/bahmutov/cypress-open-child-window/pull/4) "expanded to support switching between the windows and closing the popup and continuing to test against the original context"
While there are a few ways to achieve this, i found Dr. Gleb Bahmutov's technique the most straight-forward.

Here is how i've expanded upon that original concept with some convience helpers to keep my tests readable when testing multiple windows:

Note: this only works if you're within the same "baseDomain":

OK: 
- `base.domain/pageA`
- `sub.base.domain/pageB`

NOT OK:
- `some.otherdomain/pageC`


