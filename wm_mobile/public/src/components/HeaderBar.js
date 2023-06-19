class HeaderBar extends HTMLElement {
    constructor() {
        super()    
        this.outerHTML = `<div class="header header-fixed header-logo-center">
        <span class="header-title">${this.getAttribute('title')}</span>
        <a href="#" onClick="history.back()" class="header-icon header-icon-1"><i class="fas fa-arrow-right"></i></a>
        </div>`    
    }

    /* connectedCallback() {
       
    } */
}