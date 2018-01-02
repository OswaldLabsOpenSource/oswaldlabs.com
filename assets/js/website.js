$("[data-toggle='tooltip']").tooltip();

// For testing only
$("a").each(function() {
	$(this).attr("href", $(this).attr("href") + ".html");
});