class DeskChoice extends HTMLElement {
    constructor() {
        super()    
		this.outerHTML = `<div class="card card-style mt-6 mb-3">
								<div class="content my-0">
									<div class="list-group list-custom-small">
										<a href="#" data-menu="menu-desk-switch">
											<i class="fa fa-shopping-bag color-red-dark"></i>
											<span>כל הקופות</span><i class="fa fa-angle-left"></i></a>
									</div>
								</div>
							</div>
							<div id="menu-desk-switch" class="menu menu-box-bottom menu-box-detached rounded-m" data-menu-height="305" data-menu-effect="menu-over">
							<div class="list-group list-custom-small ps-1 pe-3">
								<a href="#" class="shareToFacebook">
									<i class="font-18 fa fa-circle-o color-facebook"></i>
									<span class="font-13">Facebook</span>
									<i class="fa fa-circle-o"></i>
								</a>
								<a href="#" class="shareToTwitter">
									<i class="font-18 fa fa-circle-o color-twitter"></i>
									<span class="font-13">Twitter</span>
									<!-- <i class="fa fa-angle-left"></i> -->
								</a>
								<a href="#" class="shareToLinkedIn">
									<i class="font-18 fa fa-circle color-linkedin"></i>
									<span class="font-13">LinkedIn</span>
									<!-- <i class="fa fa-angle-left"></i> -->
								</a>
								<a href="#" class="shareToGooglePlus">
									<i class="font-18 fa fa-circle-o color-google"></i>
									<span class="font-13">Google +</span>
									<!-- <i class="fa fa-angle-left"></i> -->
								</a>
								<a href="#" class="shareToWhatsApp">
									<i class="font-18 fa fa-circle-o color-whatsapp"></i>
									<span class="font-13">WhatsApp</span>
									<!-- <i class="fa fa-angle-left"></i> -->
								</a>
								<a href="#" class="shareToMail border-0">
									<i class="font-18 fa fa-circle-o color-mail"></i>
									<span class="font-13">Email</span>
									<!-- <i class="fa fa-angle-left"></i> -->
								</a>
							</div>
						</div>`      		
    }

    connectedCallback() {
		
    }
}