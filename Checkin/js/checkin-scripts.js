jQuery(document).ready(function($) {
	
	//------------- Hamburger menu
	
	$('.hamburger').click(function(){
		$(this).toggleClass('is-active');
		$('#main-menu').slideToggle();
	})
	
	$('#payment-switch').change(function() {
		$('.form-payment').toggleClass('active');
		$('.form-credit').toggleClass('active');
	})
	
	
});