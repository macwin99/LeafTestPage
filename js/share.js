function openShare()
{
    $("#open_share").css("display", "none");
    $("#close_share").css("display", "inline");
    $("#twitter_share").css("display", "inline");
    $("#facebook_share").css("display", "inline");
}

function closeShare()
{
    $("#close_share").css("display", "none");
    $("#twitter_share").css("display", "none");
    $("#facebook_share").css("display", "none");
    $("#open_share").css("display", "inline");
}

function fbShare(title, descr, image, winWidth, winHeight) 
{
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + "" + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}

function twShare(descr, winWidth, winHeight) 
{
	var winTop = (screen.height / 2) - (winHeight / 2);
	var winLeft = (screen.width / 2) - (winWidth / 2);
	window.open('http://twitter.com/home?status='+descr+' Here! ' + ShareURL, "",  "width="+winWidth+", height="+winHeight);
}