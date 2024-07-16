$(function(){

    $(".dropdown_btn").click(function(){
			
		if($(".dropdown_btn").hasClass("close")){
			$(".dropdown_btn").removeClass("close");
			$("body").removeClass("openmenu");
		}else{
			$(".dropdown_btn").addClass("close");
			$(".header_menu").addClass("active")
			$(".header").addClass("active")
			$("body").addClass("openmenu");
		}
		return false;
	})

});