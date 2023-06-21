//https://www.section.io/engineering-education/how-to-create-a-web-component-with-vanilla-javascript/
//https://learn.javascript.ru/custom-elements
//const initFooter = () => {
    //alert(6)
    class FooterBar extends HTMLElement {
        constructor(){
            super()
            this.style.background = "#00ff00"
            console.log("Created custom element!")
            this.innerHTML =  `<h2>HELLO !!!</h2>`
            
            /* <div id="footer-bar" class="footer-bar-1">
                                <a href="home.html"><i class="fa fa-home"></i><span>Home</span></a>
                                <a href="#"><i class="fa fa-star"></i><span>Features</span></a>
                                <a href="#" class="active-nav"><i class="fa fa-heart"></i><span>Pages</span></a>
                                <a href="#"><i class="fa fa-search"></i><span>Search</span></a>
                                <a href="#" data-menu="menu-settings"><i class="fa fa-cog"></i><span>Settings</span></a>
                                </div>` */
            }
        //constructor() {
            //super()
            //this.shadow = this.attachShadow({mode: 'open'})
            
            //this.attachShadow({ mode: 'open' })
            /* this.shadowRoot.innerHtml = `<div id="footer-bar" class="footer-bar-1">
                <a href="home.html"><i class="fa fa-home"></i><span>Home</span></a>
                <a href="#"><i class="fa fa-star"></i><span>Features</span></a>
                <a href="#" class="active-nav"><i class="fa fa-heart"></i><span>Pages</span></a>
                <a href="#"><i class="fa fa-search"></i><span>Search</span></a>
                <a href="#" data-menu="menu-settings"><i class="fa fa-cog"></i><span>Settings</span></a>
                </div>` */
            //console.log(this.getAttribute('name'))
            /*  this.shadowRoot.querySelector('img').src = this.getAttribute('avatar'); */
        //}

       /*  connectedCallback() {            
            this.innerHtml = `<div id="footer-bar" class="footer-bar-1">
                <a href="home.html"><i class="fa fa-home"></i><span>Home</span></a>
                <a href="#"><i class="fa fa-star"></i><span>Features</span></a>
                <a href="#" class="active-nav"><i class="fa fa-heart"></i><span>Pages</span></a>
                <a href="#"><i class="fa fa-search"></i><span>Search</span></a>
                <a href="#" data-menu="menu-settings"><i class="fa fa-cog"></i><span>Settings</span></a>
                </div>`
                alert(123)
        } */

        //render() {
            //this.h3
        //}
    }
    //window.customElements.define('footer-bar', FooterBar)
//}