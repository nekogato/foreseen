var swiperArr = [];

if (!("ontouchstart" in document.documentElement)) {
document.documentElement.className += " no-touch";
}

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();



function doscroll(){
	
	
	var scrolltop = $(window).scrollTop();
	var hh = $(window).height();
	var scrolltop2 = $(".fancybox-content").scrollTop();
	var buffer = 100
	scrolltop2 = (scrolltop2 == undefined) ? 0 : scrolltop2
	
	if ($(".fancybox-content").length > 0) {
		hh = $(".fancybox-content").height() > hh ? $(".fancybox-content").height() : hh;
	}

	// console.log(scrolltop + scrolltop2 + hh + buffer)

	if($(".team_sub_section_menu").length>0){
		var offsettop = 80;
		if($(".mobile_show").is(":visible")){
			offsettop = 40;
		}

		$(".tab_item").each(function(){
			var mytop = $(this).offset().top -  scrolltop - $(".tab_top").outerHeight() - offsettop;
			$(this).attr("data-top",Math.round($(this).offset().top -  scrolltop - $(".tab_top").outerHeight() - offsettop))
			
			if(mytop+$(this).outerHeight() < 0){
				$(this).next().addClass("active")
			}else{
				$(this).next().removeClass("active")
			}
		})
		$(".tab_item:first").addClass("active")
		var myid = $(".tab_item.active:last").attr("data-id");
		$(".team_sub_section_menu a.active").removeClass("active");
		$(".team_sub_section_menu a[data-target='"+myid+"']").addClass("active");
	}

	if(scrolltop>0){
		$("body").addClass("nottop")
	}else{
		$("body").removeClass("nottop")
	}


	$(".scrollin").not($(".scrollin_p .scrollin")).each(function(i){
		var $this = $(this);
		var mytop = $this.offset().top;
		var myh = $this.height();

		// added for fancybox 
		var fbtop = ($(".fancybox-content").length > 0) ? $(".fancybox-content").offset().top : 0;
		// console.log(fbtop)

		var dis = (scrolltop+scrolltop2+hh+buffer)-mytop-fbtop;
		// console.log(dis)
		if(dis>0 ){
			$this.removeClass("leavescreen");
			$this.addClass("onscreen");
			/*
			if(dis<hh+myh){
				$this.find(".scrollin").removeClass("stop");
			}else{
				$this.find(".scrollin").addClass("stop");
			}
			*/
		}else{
			$this.removeClass("onscreen");
			$this.addClass("leavescreen");
		}
	});


	
	$(".scrollin_p").each(function(i){
		var $this = $(this);
		var mytop = $this.offset().top;
		var myh = $this.height();
		
		var dis = (scrolltop+hh)-mytop;
		//$(this).attr("data-dis",scrolltop+","+hh+","+mytop+","+dis)
		if(dis>0){
			
			$this.find(".scrollin").removeClass("leavescreen");
			$this.find(".scrollin").addClass("onscreen");
			/*
			if(dis<hh+myh){
				$this.find(".scrollin").removeClass("stop");
			}else{
				$this.find(".scrollin").addClass("stop");
			}
			*/
		}else{
			$this.find(".scrollin").removeClass("onscreen");
			$this.find(".scrollin").addClass("leavescreen");
			//$this.find(".scrollin").removeClass("stop");
		}
	});

	$(".content.active .scrollin.onscreen").not($(".scrollin_p .scrollin")).not($(".scrollin.onscreen.stop")).not($(".startani")).each(function(i){
		$(this).css({
			"-webkit-transition-delay": i*100+100+"ms",
			"transition-delay": i*100+100+"ms",
		})
		
		if($(this).hasClass("moredelay")){
			$(this).css({
				"-webkit-transition-delay": i*100+600+"ms",
				"transition-delay": i*100+600+"ms",
			})
		}
		if($(this).hasClass("lessdelay")){
			$(this).css({
				"-webkit-transition-delay": i*80+100+"ms",
				"transition-delay": i*80+100+"ms",
			})
		}
		
		
		if($(this).hasClass("nodelay")){
			$(this).css({
			"-webkit-transition-delay": 0+"ms",
			"transition-delay": 0+"ms",
			})
		}
		
		$(this).addClass("startani");
	});
	
	$(".scrollin.onscreen").not($(".scrollin_p .scrollin")).not($(".scrollin.onscreen.stop")).not($(".startani")).each(function(i){
		$(this).css({
			"-webkit-transition-delay": i*100+100+"ms",
			"transition-delay": i*100+100+"ms",
		})
		
		if($(this).hasClass("moredelay")){
			$(this).css({
				"-webkit-transition-delay": i*100+600+"ms",
				"transition-delay": i*100+600+"ms",
			})
		}
		if($(this).hasClass("lessdelay")){
			$(this).css({
				"-webkit-transition-delay": i*80+100+"ms",
				"transition-delay": i*80+100+"ms",
			})
		}
		
		
		if($(this).hasClass("nodelay")){
			$(this).css({
			"-webkit-transition-delay": 0+"ms",
			"transition-delay": 0+"ms",
			})
		}
		
		$(this).addClass("startani");
	});

	$(".scrollin_p").each(function(){
		$(this).find(".scrollin.onscreen").not($(".scrollin.onscreen.stop")).not($(".startani")).each(function(i){
			$(this).css({
				"-webkit-transition-delay": i*100+100+"ms",
				"transition-delay": i*100+100+"ms",
			})
			
			if($(this).hasClass("moredelay")){
				$(this).css({
					"-webkit-transition-delay": i*100+600+"ms",
					"transition-delay": i*100+600+"ms",
				})
			}
			
			if($(this).hasClass("nodelay")){
				$(this).css({
				"-webkit-transition-delay": 0+"ms",
				"transition-delay": 0+"ms",
				})
			}
			
			$(this).addClass("startani");
		});
	})
	
	
	$(".scrollin.leavescreen").each(function(i){
		$(this).css({
			"-webkit-transition-delay": 0+"ms",
    		"transition-delay": 0+"ms",
		})
		$(this).removeClass("startani");
	});
	
	$(".scrollin.stop").each(function(i){
		$(this).css({
			"-webkit-transition-delay": 0+"ms",
    		"transition-delay": 0+"ms",
		})
		$(this).addClass("startani");
	});

	$(".bottom_logo_section.leavescreen").each(function(i){
		$(this).removeClass("played");
	});
	
	$(".bottom_logo_section.onscreen").each(function(){
		if(!$(this).hasClass("played")){
			logo_animate();
			$(this).addClass("played")
		}
	})
}

function doscroll2(){
	
	
	var scrolltop = $(".box_section_list").scrollTop();
	var hh = $(".box_section_list").height();
	

	
	$(".box_section_list .scrollin").not($(".scrollin_p .scrollin")).each(function(i){
		var $this = $(this);
		var mytop = $this.offset().top;
		var myh = $this.height();
		
		var dis = (scrolltop+hh)-mytop;

		
		if(dis>0 ){
			$this.removeClass("leavescreen");
			$this.addClass("onscreen");
			/*
			if(dis<hh+myh){
				$this.find(".scrollin").removeClass("stop");
			}else{
				$this.find(".scrollin").addClass("stop");
			}
			*/
		}else{
			$this.removeClass("onscreen");
			$this.addClass("leavescreen");
		}
	});

	
	
	$(".box_section_list .scrollin_p").each(function(i){
		var $this = $(this);
		var mytop = $this.offset().top;
		var myh = $this.height();
		
		var dis = (scrolltop+hh)-mytop;
		//$(this).attr("data-dis",scrolltop+","+hh+","+mytop+","+dis)
		if(dis>0){
			
			$this.find(".scrollin").removeClass("leavescreen");
			$this.find(".scrollin").addClass("onscreen");
			/*
			if(dis<hh+myh){
				$this.find(".scrollin").removeClass("stop");
			}else{
				$this.find(".scrollin").addClass("stop");
			}
			*/
		}else{
			$this.find(".scrollin").removeClass("onscreen");
			$this.find(".scrollin").addClass("leavescreen");
			//$this.find(".scrollin").removeClass("stop");
		}
	});
	
	$(".box_section_list .scrollin.onscreen").not($(".scrollin_p .scrollin")).not($(".scrollin.onscreen.stop")).not($(".startani")).each(function(i){
		$(this).css({
			"-webkit-transition-delay": i*100+100+"ms",
			"transition-delay": i*100+100+"ms",
		})
		
		if($(this).hasClass("moredelay")){
			$(this).css({
				"-webkit-transition-delay": i*100+600+"ms",
				"transition-delay": i*100+600+"ms",
			})
		}
		if($(this).hasClass("lessdelay")){
			$(this).css({
				"-webkit-transition-delay": i*80+100+"ms",
				"transition-delay": i*80+100+"ms",
			})
		}
		
		
		if($(this).hasClass("nodelay")){
			$(this).css({
			"-webkit-transition-delay": 0+"ms",
			"transition-delay": 0+"ms",
			})
		}
		
		$(this).addClass("startani");
	});

	$(".box_section_list .scrollin_p").each(function(){
		$(this).find(".scrollin.onscreen").not($(".scrollin.onscreen.stop")).not($(".startani")).each(function(i){
			$(this).css({
				"-webkit-transition-delay": i*100+100+"ms",
				"transition-delay": i*100+100+"ms",
			})
			
			if($(this).hasClass("moredelay")){
				$(this).css({
					"-webkit-transition-delay": i*100+600+"ms",
					"transition-delay": i*100+600+"ms",
				})
			}
			
			if($(this).hasClass("nodelay")){
				$(this).css({
				"-webkit-transition-delay": 0+"ms",
				"transition-delay": 0+"ms",
				})
			}
			
			$(this).addClass("startani");
		});
	})
	
	
	$(".box_section_list .scrollin.leavescreen").each(function(i){
		$(this).css({
			"-webkit-transition-delay": 0+"ms",
    		"transition-delay": 0+"ms",
		})
		$(this).removeClass("startani");
	});
	
	$(".box_section_list .scrollin.stop").each(function(i){
		$(this).css({
			"-webkit-transition-delay": 0+"ms",
    		"transition-delay": 0+"ms",
		})
		$(this).addClass("startani");
	});

}

function loading_finish(){
	if($(".map_box").length){
		initmap();
		function initmap() {

			$(".map_box").each(function(){
				var $this = $(this);
				var mylng= $this.attr("data-lng");
				var mylat= $this.attr("data-lat");
				var mytitle= $this.attr("data-title");

				// Basic options for a simple Google Map
				// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
				var mapOptions = {
					// How zoomed in you want the map to start at (always required)
					zoom: 17,
		
					// The latitude and longitude to center the map (always required)
					center: new google.maps.LatLng(mylng, mylat), 
		
					// How you would like to style the map. 
					// This is where you would paste any style found on Snazzy Maps.
					styles: [{"featureType":"landscape","elementType":"geometry","stylers":[{"saturation":"-100"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#545454"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"saturation":"-87"},{"lightness":"-40"},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#f0f0f0"},{"saturation":"-22"},{"lightness":"-16"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","elementType":"labels.icon","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"saturation":"-52"},{"hue":"#00e4ff"},{"lightness":"-16"}]}]
		
				};
		
				// Create the Google Map using our element and options defined above
				var map = new google.maps.Map($this[0], mapOptions);
		
				// Let's also add a marker while we're at it
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(mylng, mylat),
					map: map,
					title: mytitle
				});

			})
		}
	}

    $("body").addClass("loadfinish");
    doscroll();
}


function init_event(){

	
  
	$(".backtotop_btn").click(function(){
		var body = $("html, body");
		body.stop().animate({scrollTop:0}, 500, 'swing', function() { 
		});
		return false;
	})
  
	$(".all_item_btn").click(function(){
        if($(".box_section_list").hasClass("active")){
            $(".box_section_object").addClass("active");
            $(".box_section_list").removeClass("active");
            setTimeout(function(){
                doscroll()
            },600)
            setTimeout(function(){
                $(".box_section_list").scrollTop(0);
                doscroll2()
                doscroll()
            },1200)
        }else{
            $(".box_section_list").addClass("active");
            $(".box_section_object").removeClass("active");
            $(".box_section_list").scrollTop(0);
            setTimeout(function(){
                doscroll2()
                $(".box_section_object .scrollin").removeClass("startani");
            },600)
            setTimeout(function(){
                doscroll2()
            },1200)
        }
		return false;
	})

	$(".team_sub_section_menu a").click(function(){

		var mytarget = $(this).attr("data-target");
		var offsettop = 80;
		if($(".mobile_show").is(":visible")){
			offsettop = 40;
		}
		var targety = $(".tab_item[data-id='"+mytarget+"']").offset().top -  ($(".tab_top").outerHeight() + offsettop);
		var body = $("html, body");
		body.stop().animate({scrollTop:targety}, 500, 'swing', function() { 
		});
	})

    
    // var current = 0;
    // var ScrollX_pixelPer = 40;
    // $(".box_section_object").on("mousewheel", function(e) {
    //     e.preventDefault();
    //     var delta = ScrollX_pixelPer*(parseInt(e.originalEvent.deltaY)/33);
    //     current += delta;
    //     $(this).scrollLeft(current);
    // });


	
    $(".box_section_list").on('scroll', function() {
        doscroll2();
    });


}

var mousearr={worldx:0,worldy:0,mousex:0,mousey:0,directionx:0,directiony:0};

var moved = false;

function moveMap(e) {
	moved = true;

    if(e.pageX){
		 mousearr.mousex=e.pageX;
	}
	if(e.pageY){
		 mousearr.mousey=e.pageY;
	}

	if(e.clientX){
		 mousearr.mousex=e.clientX;
	}
	if(e.clientY){
		 mousearr.mousey=e.clientY;
	}
    


}

function floatanim(){

    var newx = mousearr.mousex;
    var newy = mousearr.mousey;

	if ($(".box_object_wrapper").length > 0) {

		if($(".mobile_show").is(":hidden")){
			var ww = $(window).outerWidth()-$(".right_menu").outerWidth();

			if(newx>(ww/2)){
				var mouse_to_ww_ratio = (newx-(ww/2))/(ww/2);

				var pwidth = $(".box_object_wrapper").outerWidth() - ww;

				var dis = -pwidth*mouse_to_ww_ratio
			}else{
				var dis = 0;
			}

			gsap.to($(".box_object_wrapper"), {
				x: dis , 
				duration: 1}
			);
		}else{
			gsap.to($(".box_object_wrapper"), {
				x: 0, 
				duration: 0}
			);
		}
		
	}
	// $(".box_popup_thumb").each(function(){
	// 	var ww = $(window).outerWidth();
	// 	var wh = $(window).outerHeight();
	// 	var mouse_to_ww_ratio = newx/ww;
	// 	var mouse_to_wh_ratio = newy/wh;

	// 	gsap.to($(this), {
	// 		x: -(100*mouse_to_ww_ratio), 
	// 		y: -(50*mouse_to_wh_ratio), 
	// 		duration: 0.1}
	// 	);
	// })



	

	// gsap.to($(".content_area"), {
	// 	rotation: -1*(newy-$(window).height()/2)/10, 
	// 	x:-1*(newx-$(window).width()/2)/2, 
	// 	y: -1*(newy-$(window).height()/2)/2, 
	// 	duration: 1});

	// gsap.to($(".block2_wrapper"), {
	// 	rotation: -1*(newy-$(window).height()/2)/10, 
	// 	x:-1*(newx-$(window).width()/2)/2, 
	// 	y: -1*(newy-$(window).height()/2)/2, 
	// 	duration: 1});

		
    
    // $(".float_circle").css({
    //     left: "+=" + ((newx - cursorx) * .1) + "px",
    //     top: "+=" + ((newy - cursory) * .1) + "px",
    // })	
	
	window.requestAnimationFrame(floatanim);
}


function init_function(){
	var myurl = window.location.href;
	if(myurl.includes("/en/")){
		$(".lang_en").hide();
		$(".lang_tc").attr("href",myurl.replace("/en/","/tc/"))
	}
	if(myurl.includes("/tc/")){
		$(".lang_tc").hide();
		$(".lang_en").attr("href",myurl.replace("/tc/","/en/"))
	}
}

function dosize(){

	

	if($(".mobile_show").is(":hidden")){
		
	}else{
	}
}


$(function(){
    $("body").addClass("loadstart");
	
	init_event();
	init_function();

	$(".objects-drawer-item a, .box_object_thumb a").click(function(){
		var myhref = $(this).attr("href");
		$(".popup_item").addClass("show");
		$(".popup_item .img").attr("src","../c_images/"+myhref.replace(".html","")+".png")
		setTimeout(function(){
			window.location = myhref
		},650)
		return false;
	})

	$(".box_item a").click(function(){
		var myhref = $(this).attr("href");
		var myhref2 = myhref.split('#')[0];
		$(".popup_item").addClass("show");
		$(".popup_item .img").attr("src","../c_images/"+myhref2.replace(".html","")+".png")
		setTimeout(function(){
			window.location = myhref
		},650)
		return false;
	})
	

	// Use 'pageshow' to detect when the user comes back to this page
	window.addEventListener('pageshow', function(event) {
		if (event.persisted) {
			// This is triggered when navigating back to this page from the cache (back/forward navigation)
			$(".popup_item").addClass("sharp").removeClass("show");
			setTimeout(function(){
				$(".popup_item").removeClass("sharp");
			},0)
		}
	});

	window.addEventListener('beforeunload', function(event) {
		// Remove the 'show' class when the page is about to unload
		const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

		if (isFirefox) {
		} else {
			$(".popup_item").removeClass("show");
		}
	});
	
    $(".body_shopdetail .popup_item").addClass("fadeout")
	setTimeout(function(){
		$(".body_shopdetail .popup_item").removeClass("fadeout")
	},600)
    $(".body_shopdetail .popup_item").removeClass("show")

    mousearr.mousex=$(window).width()/2;
    mousearr.mousey=$(window).height()/2;
    window.requestAnimationFrame(floatanim);
	$(window).on('mousemove', moveMap);
});


$(window).on('load', function() {
	dosize();
	doscroll();
	loading_finish();

	
});

$(window).on('resize', function() {
	dosize();
	waitForFinalEvent(function(){
		dosize();
		doscroll();
	}, 300, "some unique string");
});



$(window).on('scroll', function() {
	doscroll();
	dosize();
});


	