class FooterBar extends HTMLElement {
    constructor() {
        super()
        this.outerHTML = `<div id="footer-bar" class="footer-bar-1">
        <a href="/"><i class="fa fa-home"></i><span>Home</span></a>
        <a href="#"><i class="fa fa-star"></i><span>Features</span></a>
        <a href="#" class="active-nav"><i class="fa fa-heart"></i><span>Pages</span></a>
        <a href="#"><i class="fa fa-search"></i><span>Search</span></a>
        <a href="#" data-menu="menu-settings"><i class="fa fa-cog"></i><span>Settings</span></a>
        </div>`
    }
   /*  connectedCallback() {
        
    } */
}