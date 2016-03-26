setTimeout(function() {	
	$(".show_image").one("load", function(e) {
		var img = $(e.target)
		var id = img.attr('data-id')
		$('#image_width_'+id).html(img[0].naturalWidth)
		$('#image_height_'+id).html(img[0].naturalHeight)				
	}).each(function() {
		if(this.complete) $(this).load();
	});
}, 0);	


