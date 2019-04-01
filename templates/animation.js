function show_loading_anime(){
    var anime = document.getElementById('loadinganime');
    anime.style.display = 'block';
}

function hdie_loading_anime(){
    var anime = document.getElementById('loadinganime');
    anime.style.display = 'none';
}

function scroller(){
    var position = 0;
    if(Number(document.body.scrollTop) < 233)  
    {  
        position = document.body.scrollTop + 3 ;  
        scroll(0,position);  
        clearTimeout(timer);  
        var timer = setTimeout("scroller()",10);  
    }  
    position = document.body.scrollTop + 10 ;  
    scroll(0,position);  
}    