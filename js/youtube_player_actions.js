var clock;
function log(message) 
{
    document.getElementById('log').innerHTML = message;
}

window.onYouTubePlayerReady = function(playerId) 
{
    player_element = document.getElementById(playerId);
    player_element.addEventListener('onStateChange', 'onytplayerStateChange');
    player_element.playVideo();
    var imgV = document.getElementById('song_'+videoNum+'_img');
    var imgF = document.getElementById('footer_pic');
    imgF.src = imgV.src;
    imgVP.src = play_gif;
}

window.onytplayerStateChange = function(newState) 
{
    var imgV = document.getElementById('song_'+videoNum+'_img');
    var imgF = document.getElementById('footer_pic');
    var imgVP = document.getElementById('song_'+videoNum+'_img_play');
    switch (newState) {
        case 0:
            //nextVideo();
            player_element.stopVideo();
            nextVideo();
            setTimer();
            clearInterval(currentClock);
            getInfoFooter();
            break;
        case 1:
            imgF.src = imgV.src;
            imgVP.src = play_gif;
            getInfoFooter();
            clock = setInterval(function(){timer_trans()},500);
            break;
        case 2:
            imgVP.src = pause_gif;
            clearInterval(currentClock);
            break;
        case 3:
            imgF.src = imgV.src;
            break;
    }
}


function timer_trans()
{
    if(!isNaN(player_element.getCurrentTime()))
    {
        $('#progress_bar_video').val((player_element.getCurrentTime()*10000)/playlist_JSON[videoNum].time);
        if(playlist_JSON[videoNum].time-player_element.getCurrentTime()>2)
        {
        }
        else
        {
            player_element.stopVideo();
            clearInterval(clock);
            clearInterval(currentClock);
            setTimer();
            nextVideo();
            clearInterval(currentClock);
            getInfoFooter();
        }
    }
}

function loadPlayer(blockID, videoID) {
    swfobject.embedSWF('http://www.youtube.com/v/'+videoID+'?autostart=0&enablejsapi=1&playerapiid='+blockID+'&version=3&showinfo=0&controls=0&rel=0&iv_load_policy=3',
                    blockID, '600', '338', '8', null, null,
                    { allowScriptAccess: 'always', wmode: 'transparent' },
                    { id: blockID, name: blockID }
    );
} 

function setTimer()
{
    current_min=0;
    current_sec=0;
    clearInterval(currentClock);
    currentTime.innerHTML = "0:00";
    totalTime.innerHTML = "0:00";
}

function getInfoFooter()
{
    var labelName = document.getElementById('name_video_label');
    var totalTime = document.getElementById('total_time_label');
    var currentTime = document.getElementById('current_time_label');
    labelName.innerHTML = playlist_JSON[videoNum].feedTitle;
    totalTime.innerHTML = playlist_JSON[videoNum].stringtime;
    currentClock = setInterval(function(){timer_count()},1000);
}

function timer_count()
{
    var currentTime = document.getElementById('current_time_label');
    if(current_sec===59&&player_element.getCurrentTime()!=lastTime)
    {
        current_min = Number(current_min) + Number(1);
        current_sec = 0;
    }
    else
    {
        current_sec = Number(current_sec) + Number(1);
    }
    lastTime = player_element.getCurrentTime();
    currentTime.innerHTML = ""+current_min+":"+('0' + current_sec).slice(-2);
}

function nextVideo()
{
    
    if(videoNum<playlist_JSON.length-1)
    {
        
        var imgVP = document.getElementById('song_'+videoNum+'_img_play');
        imgVP.src = pause_gif;
        videoNum = Number(1)+Number(videoNum);
        loadPlayer('video1', playlist_JSON[videoNum].videoID);
        clearInterval(clock);
        clock = setInterval(function(){timer_trans()},500);
        clearInterval(currentClock);
        setTimer();
    }
}

function prevVideo()
{
    if(videoNum<playlist_JSON.length && videoNum>0)
    {
        
        var imgVP = document.getElementById('song_'+videoNum+'_img_play');
        imgVP.src = pause_gif;
        videoNum -= 1;
        player_element.pauseVideo();
        loadPlayer('video1', playlist_JSON[videoNum].videoID);
        clearInterval(clock);
        clock = setInterval(function(){timer_trans()},500);
        clearInterval(currentClock);
        setTimer();
    }
}

function pauseVideo()
{
    var imgVP = document.getElementById('song_'+videoNum+'_img_play');
    switch(player_element.getPlayerState())
    {
        case 0:
            break;
        case 1:
            player_element.pauseVideo();
            imgVP.src = pause_gif;
            break;
        case 2:
            player_element.playVideo();
            imgVP.src = play_gif;
            break;
        case 3:
            break;
        
    }
}

function selectSong(number_song)
{
    
    var imgVP = document.getElementById('song_'+videoNum+'_img_play');
    imgVP.src = pause_gif;
    videoNum = number_song;
    loadPlayer('video1', playlist_JSON[videoNum].videoID);
    clearInterval(clock);
    clock = setInterval(function(){timer_trans()},500);
    clearInterval(currentClock);
    setTimer();
}

var videoURL= 'http://www.youtube.com/watch?v=';

function loadPlaylist()
{
    $.getJSON(playListURL, function(data) {
    var list_data="";
    var number_index=0;
    $.each(data.feed.entry, function(i, item) {
        
        var feedTitle = item.title.$t;
        var feedURL = item.link[1].href;
        var fragments = feedURL.split("/");
        var videoID = fragments[fragments.length - 2];
        var url = videoURL + videoID;
        var duration = item.media$group.media$thumbnail[0].time;
        var a = duration.split(':');
        var seconds = ((a[0]) * 60 * 60 + (a[1]) * 60 + (a[2]))*2;
        var minutes = a[1] * 2;
        var pseconds = a[2] * 2;
        for(var sec = pseconds; sec>59;)
        {
            minutes = Number(minutes) + Number(1);
            sec = sec-60;
            pseconds = sec;
        }
        pseconds = Math.round(pseconds);
        var thumb = "http://img.youtube.com/vi/"+ videoID +"/default.jpg";
        var video_time = minutes+":"+('0' + pseconds).slice(-2);
        playlist_JSON.push(new Object());
        playlist_JSON[i] = {feedTitle : feedTitle, feedURL : feedURL, fragments : fragments, videoID : videoID, url : url, thumb : thumb, time : seconds, stringtime : video_time};
        
        pseconds = ('0' + pseconds).slice(-2);
        if(number_index===0)
        {
            var playlistID=item.id.$t.split(":");
            playListLink+=playlistID[3];
            loadPlayer('video1', videoID);
        }
        list_data += '<div class="playlist_element" onClick="selectSong(\'' + number_index + '\')"><img src="'+thumb+'" class="playlist_element_pic left" id="song_'+number_index+'_img" onClick="selectSong(\'' + number_index + '\')"/><label id="song_'+number_index+'_name" class="playlist_element_label left" onClick="selectSong(\'' + number_index + '\')">'+feedTitle+'</label><img id="song_'+number_index+'_img_play" src="img/ffffff.png" class="playlist_element_pic right"/><label id="song_'+number_index+'_time" class="playlist_element_label right">'+video_time+'</label></div><div class="separator_element_songs"></div>';
        number_index += 1;
        
        //loadPlayer('video1', videoID);
    });
    list_data += '<div class="playlist_element"><img src="img/song-placeholder.png" class="playlist_element_pic left"/><label class="playlist_element_label left">Song Name</label><img src="" class="playlist_element_pic right"/><label class="playlist_element_label right"></label></div><div class="separator_element_songs"></div>';
    $(list_data).appendTo("#playlist_list");
    
});
}

$(document).ready(function(){
  ShareURL = document.URL;
  var listID = ShareURL.split("?");
  playListURL = 'http://gdata.youtube.com/feeds/api/playlists/'+listID[1]+'?v=2&alt=json';
  loadPlaylist();
});
