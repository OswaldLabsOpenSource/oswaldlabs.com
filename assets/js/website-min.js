$("[data-toggle='tooltip']").tooltip(),$("a").each(function(){$(this).attr("href").includes("http")||($(this).attr("href").includes("?")?$(this).attr("href",$(this).attr("href").split("?")[0]+".html?"+$(this).attr("href").split("?")[1]):$(this).attr("href").includes("#")?$(this).attr("href",$(this).attr("href").split("#")[0]+".html#"+$(this).attr("href").split("#")[1]):$(this).attr("href",$(this).attr("href")+".html"))});var page=location.href.split("?")[0].replace(".html","");"contact"===page.split("/")[page.split("/").length-1]&&$("input[name='department'] option:nth-child(2)").attr("selected","selected");
//# sourceMappingURL=./website-min.js.map