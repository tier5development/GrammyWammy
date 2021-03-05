/*!
  custom js
  */
jQuery( document ).ready(function($) {
	$(".side_click").click(function(){
		$(".slider_menu").addClass("active");
	});
	$(".slider_menu").find(".cross").click(function(){
		$(".slider_menu").removeClass("active");
	});

	$("#responce").click(function(){
		$(".maintab").children("li").children("a").removeClass("active");
		$(this).addClass("active");
		$("#tabResponse").show();
		$("#tabMessage").hide();
		$(".subtab").children("li").children("a").removeClass("active");
		$(".subtab").children("li:first-child").children("a").addClass("active");
	});
	$("#message").click(function(){
		$(".maintab").children("li").children("a").removeClass("active");
		$(this).addClass("active");
		$("#tabResponse").hide();
		$("#tabMessage").show();
		$(".subtab").children("li").children("a").removeClass("active");
		$(".subtab").children("li:first-child").children("a").addClass("active");
	});

	$("#autoResponder").click(function(){
		$(".subtab").children("li").children("a").removeClass("active");
		$(this).addClass("active");
		$("#tabautoResponder").show();
		$("#tabdefaultMessage").hide();
	});
	$("#defaultMessage").click(function(){
		$(".subtab").children("li").children("a").removeClass("active");
		$(this).addClass("active");
		$("#tabautoResponder").hide();
		$("#tabdefaultMessage").show();
	});

	$("#segments").click(function(){
		$(".subtab").children("li").children("a").removeClass("active");
		$(this).addClass("active");
		$("#tabSegments").show();
		$("#tabGroups").hide();
	});
	$("#groups").click(function(){
		$(".subtab").children("li").children("a").removeClass("active");
		$(this).addClass("active");
		$("#tabSegments").hide();
		$("#tabGroups").show();
	});

	$(".selectedBlock").children(".cross").click(function(){
		$(this).parent(".selectedBlock").hide();
	});
});

