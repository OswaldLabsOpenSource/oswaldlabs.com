$("[data-toggle='tooltip']").tooltip();

// For testing only
$("a").each(function() {
	if (!$(this).attr("href").includes("http")) {
		$(this).attr("href", $(this).attr("href") + ".html");
	}
});