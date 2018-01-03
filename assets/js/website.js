$("[data-toggle='tooltip']").tooltip();

// For testing only
$("a").each(function() {
	if (!$(this).attr("href").includes("http")) {
		if (!$(this).attr("href").includes("?")) {
			$(this).attr("href", $(this).attr("href") + ".html");
		} else {
			$(this).attr("href", $(this).attr("href").split("?")[0] + ".html" + "?" + $(this).attr("href").split("?")[1]);
		}
	}
});

var page = location.href.split("?")[0].replace(".html", "");
if (page.split("/")[page.split("/").length - 1] === "contact") {
	$("input[name='department'] option:nth-child(2)").attr("selected", "selected");
}