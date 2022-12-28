// $(function(){
//     $('.tabcontent > div').hide();
//     $('.tabnav a').click(function () {
//       $('.tabcontent > div').hide().filter(this.hash).fadeIn();
//       $('.tabnav a').removeClass('active');
//       $(this).addClass('active');
//       return false;
//     }).filter(':eq(0)').click();
//     });

$(document).ready(function(){
	
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

})