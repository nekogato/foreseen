function dohash(){
	var hash = window.location.hash;
	
	if(hash){
		hash= hash.replace("#","");
        if($(".object_popup[data-id='"+hash+"']").length){
            $(".object_popup[data-id='"+hash+"'] .popup_link").click();
        }
		
	}
}

$(window).on('load', function() {
	$(".object_popup_close").click(function(){
        $(this).parents(".object_popup").fadeOut();
    })
	dohash();
	$(window).hashchange( function(){
		dohash();
	})
});