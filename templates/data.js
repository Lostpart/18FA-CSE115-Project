function success_first(rawjson){
    var data = JSON.parse(rawjson);
    var You_are_TA = false;
    var You_Are_Grading = false;
    // This is a changhe due to an unsmart API, for more information check left.py line 20 - 31
    if(You_are_TA  && You_Are_Grading){
        success_single(rawjson) ;
    }
    else{
        document.getElementById("in_location").value=data[1]["current"]["1"]["formattedname"];
        success_single(rawjson);
    }
}

function success_single(rawjson){
    var data = JSON.parse(rawjson);
    var lat = data[0]["lat"];
    var lon = data[0]["lon"];
    var text = data[0]["text"];
    var top_text = data[1]["top_text"];
    var cur_weather = data[1]["current"]["1"];
    var for_weather = data[1]["forecast"]["1"];
    var html_for_weather_info_part = data[2]
    changemap(lat,lon,text);
    changeCurWeatherInfo(cur_weather, 1, html_for_weather_info_part);
    changeFcstWeatherInfo(cur_weather, for_weather, 1);
    scroller()
    hdie_loading_anime()
}

function success_double(rawjson){
    console.log("回调函数开始运行")
    var data = JSON.parse(rawjson);
    var lat = data[0]["lat"];
    var lon = data[0]["lon"];
    var text = data[0]["text"];
    var top_text = data[1]["top_text"];
    var loc1_cur_weather = data[1]["current"]["1"];
    var loc1_for_weather = data[1]["forecast"]["1"];
    var loc2_cur_weather = data[1]["current"]["2"];
    var loc2_for_weather = data[1]["forecast"]["2"];
    var html_for_weather_info_part = data[2]
    scroller()
    changemap(lat,lon,text);
    changeCurWeatherInfo([loc1_cur_weather,loc2_cur_weather], 2, html_for_weather_info_part);
    changeFcstWeatherInfo([loc1_cur_weather,loc2_cur_weather], [loc1_for_weather,loc2_for_weather], 2);
    scroller()
    hdie_loading_anime()
    
}




function changeCurWeatherInfo(cur_weather, citynumber, html){
    if(citynumber == 2){
        var nameofcity = [cur_weather[0]["formattedname"],cur_weather[1]["formattedname"]];
        var temp = [cur_weather[0]["temp"],cur_weather[1]["temp"]];
        var snow = [cur_weather[0]["snow"],cur_weather[1]["snow"]];
        var wind_deg = [cur_weather[0]["wind_deg"],cur_weather[1]["wind_deg"]];
        var weatherInWord = [cur_weather[0]["weatherInWord"],cur_weather[1]["weatherInWord"]];
        var icon = [cur_weather[0]["icon"],cur_weather[1]["icon"]];
        var humidity = [cur_weather[0]["humidity"],cur_weather[1]["humidity"]];
        var rain = [cur_weather[0]["rain"],cur_weather[1]["rain"]];
        var wind_lvl = [cur_weather[0]["wind_lvl"],cur_weather[1]["wind_lvl"]]; 
        showCurWeather(citynumber, html , nameofcity, temp, [rain[0]+snow[0], rain[1]+snow[1]], weatherInWord, icon, humidity, wind_lvl,wind_deg)
    }
    else{
        var nameofcity = cur_weather["formattedname"];
        var temp = cur_weather["temp"];
        var snow = cur_weather["snow"];
        var wind_deg = cur_weather["wind_deg"];
        var weatherInWord = cur_weather["weatherInWord"];
        var icon = cur_weather["icon"];
        var humidity = cur_weather["humidity"];
        var rain = cur_weather["rain"];
        var wind_lvl = cur_weather["wind_lvl"];
        showCurWeather(citynumber, html , [nameofcity], [temp], [rain + snow], [weatherInWord], [icon], [humidity], [wind_lvl],[wind_deg])
    }

}

function showCurWeather(citynumber,html , nameofcity, temp, rain, weatherInWord, icon, humidity, wind_lvl, wind_deg){
    var placeholderprefix = ["loc1_","loc2_"];
    for (var i = 0; i < citynumber; i = i + 1){
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"name" + "%","g"), nameofcity[i]);
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"icon" + "%","g"), "<img height='64' width='64' src='"+ getweathericonurl(icon[i]) +"'>");
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"temp" + "%","g"), "<div><div style='font-size:16px; float:right; display:inline; overflow:hidden;right:0px; top:0px; z-index:100;'>°F</div><div style='font-size:64px; display:inline; width:90%; overflow:hidden'>" + Math.round(temp[i])+"</div></div>");
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"humidity" + "%","g"), humidity[i]+ "%");
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"wind_icon" + "%","g"), "<img height='28' width='28' style='transform:rotate("+wind_deg[i]+"deg);' src='http://i1.fuimg.com/524267/6adc9347d0c60f32.png'>");
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"wind_speed" + "%","g"), wind_lvl[i]+"mph");
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"weather_text" + "%","g"), weatherInWord[i]);
        html = html.replace(new RegExp("%" + placeholderprefix[i]+"precipitation" + "%","g"), (Math.round(rain[i] * 0.33 * 100) / 100 )+"mm/h");
    }
    document.getElementById("currentweather").innerHTML=html;
}

function getweathericonurl(iconindex){
    var domain = document.domain;
    return "http://" + domain + "/image/weathericon/"+ iconindex +".png"

    // 事实证明贴图库在北美并不好用
    // var iconchecklist = {
    //     "01d":"http://i1.fuimg.com/524267/46420a66b4643fc3.png",
    //     "01n":"http://i1.fuimg.com/524267/fa490e40e0ab5b0a.png",
    //     "02d":"http://i1.fuimg.com/524267/2733a4d924136ad9.png",
    //     "02n":"http://i1.fuimg.com/524267/c5b4227377a518ff.png",
    //     "03d":"http://i1.fuimg.com/524267/d147456ce0d56638.png",
    //     "03n":"http://i1.fuimg.com/524267/d147456ce0d56638.png",
    //     "04d":"http://i1.fuimg.com/524267/d147456ce0d56638.png",
    //     "04n":"http://i1.fuimg.com/524267/d147456ce0d56638.png",
    //     "09d":"http://i1.fuimg.com/524267/51f1bb1e1be5de34.png",
    //     "09n":"http://i1.fuimg.com/524267/51f1bb1e1be5de34.png",
    //     "10d":"http://i1.fuimg.com/524267/dc125a353910108a.png",
    //     "10n":"http://i1.fuimg.com/524267/dc125a353910108a.png",
    //     "11d":"http://i1.fuimg.com/524267/2ac7d65feb8703c9.png",
    //     "11n":"http://i1.fuimg.com/524267/1a6692f1c40fc0bb.png",
    //     "13d":"http://i1.fuimg.com/524267/feb1297551d0a4dd.png",
    //     "13n":"http://i1.fuimg.com/524267/feb1297551d0a4dd.png",
    //     "50d":"http://i1.fuimg.com/524267/b01ded00c7d1aa46.png",
    //     "50n":"http://i1.fuimg.com/524267/b01ded00c7d1aa46.png"
    // };
    // if(iconindex in iconchecklist){
    //     return iconchecklist[iconindex];
    // }
    // return iconchecklist["01d"];
    
}

function changeFcstWeatherInfo(cur_weather, for_weather, citynumber){
    // I know this part are stupid, I stay up late to write this part
    // a foor loop shall be work well, but I dont want to change this before grading
    if(citynumber == 2){
        var nameofcity = [for_weather[0]["name"],for_weather[1]["name"]];
        var temp = [for_weather[0]["temp"],for_weather[1]["temp"]];
        var snow = [for_weather[0]["snow"],for_weather[1]["snow"]];
        var wind_deg = [for_weather[0]["wind_deg"],for_weather[1]["wind_deg"]];
        var weatherInWord = [for_weather[0]["weatherInWord"],for_weather[1]["weatherInWord"]];
        var icon = [for_weather[0]["icon"],for_weather[1]["icon"]];
        var humidity = [for_weather[0]["humidity"],for_weather[1]["humidity"]];
        var rain = [for_weather[0]["rain"],for_weather[1]["rain"]];
        //var timeU = [for_weather[0]["time"],for_weather[1]["time"]];
        var wind_lvl = [for_weather[0]["wind_lvl"],for_weather[1]["wind_lvl"]]; 
        var time1 = []
        var time2 = []
        for(var v in for_weather[0]["time"]){
            time1.push(for_weather[0]["time"][v]*1000)
        }
        for(var v in for_weather[1]["time"]){
            time2.push(for_weather[1]["time"][v]*1000)
        }
        var time = [time1,time2]
    }
    else{
        var nameofcity = [for_weather["name"]];
        var temp = [for_weather["temp"]];
        var snow = [for_weather["snow"]];
        var wind_deg = [for_weather["wind_deg"]];
        var weatherInWord = [for_weather["weatherInWord"]];
        var icon = [for_weather["icon"]];
        var humidity = [for_weather["humidity"]];
        var rain = [for_weather["rain"]];
        //var timeU = [for_weather["time"]]
        var wind_lvl = [for_weather["wind_lvl"]]; 
        var time = []
        for(var v in for_weather["time"]){
            time.push(for_weather["time"][v]*1000) 
        }
        time = [time]
    }

    //add current weather infomation to plot
    //temp = temp.unshift(cur_weather["temp"]);
    //snow = snow.unshift(cur_weather["snow"]);
    //wind_deg = wind_deg.unshift(cur_weather["wind_deg"]);
    //weatherInWord = weatherInWord.unshift(cur_weather["weatherInWord"]);
    //icon = icon.unshift(cur_weather["icon"]);
    //humidity = humidity.unshift(cur_weather["humidity"]);
    //rain = rain.unshift(cur_weather["rain"]);
    //time = time.unshift(cur_weather["time"]);
    //wind_lvl = wind_lvl.unshift(cur_weather["wind_lvl"]);
    generateplot_temp(citynumber,temp,time,rain,snow,weatherInWord,icon,nameofcity);
    generateplot_wind(citynumber,wind_deg,wind_lvl,time,weatherInWord,nameofcity);
}


function generateplot_wind(citynumber,wind_deg,wind_lvl,time,weatherInWord,nameofcity){
    console.log("风力部分加载")
    var data = [];
    var colorforwindline=["rgb(255, 89, 131)","rgb(122, 2, 60)"]
    var colorforwindfill=["rgb(255, 164, 187)","rgb(182, 117, 149)"]
    var fill = ["tozeroy","tonexty"]
    var alldata_wind = []
    for (var i = 0; i < citynumber; i = i + 1){
        var windplot = {
            x: time[i],
            y: wind_lvl[i],
            fill: fill[i],
            type: 'scatter',
            name: nameofcity[i] + "'s Wind",
            fillcolor: colorforwindfill[i],
            line: {
                color: colorforwindline[i]
            }
        };
        data.push(windplot);
        var alldata_wind = alldata_wind.concat(wind_lvl[i]);
    }
        var windrange = getrangeforwindplot(alldata_wind);
        var layout = {
            margin:{
                l:45,
                r:30,
                t:30,
                b:50,
            },
            xaxis:{
                type: 'date'
                },
            yaxis: {ticksuffix:"mph",range:windrange},
            legend: {
                orientation: "h",
                x: 0.5,
                y: -0.2,
                xanchor: "center",
                yanchor: "top"
                }
            };

    Plotly.newPlot('plotly_wind', data, layout);
}


function generateplot_temp(citynumber, temp, time, rain, snow, weatherInWord, icon, nameofcity){
    console.log("温度雨水部分加载")
    var data = [];
    var colorforTempLine = ["rgb(255, 181, 22)","rgb(187, 255, 65)"]
    var colorforTempFill = ["rgb(255, 215, 128)","rgb(218, 255, 151)"]
    var colorforrainFill = [["rgb(35, 142, 255)","rgb(155, 204, 255)"],["rgb(34, 89, 255)","rgb(134, 164, 255)"]]
    var fill = ["tozeroy","tonexty"]
    var alldata_temp = []
    var alldata_rain = []
    for (var i = 0; i < citynumber; i = i + 1){
        var tempplot = {
            x: time[i],
            y: temp[i],
            fill: fill[i],
            type: 'scatter',
            name: nameofcity[i] + "'s Temperature",
            fillcolor: colorforTempFill[i],
            line: {
                color: colorforTempLine[i]
            }
        };
        var rainsnow = rainSnowMixer(rain[i],snow[i],weatherInWord[i],colorforrainFill[i]);
        var rainplot = {
            x: time[i],
            y: rainsnow["rainsnow"],
            text: rainsnow["text"],
            yaxis: 'y2',
            marker:{
                color: rainsnow["color"]
                },
            type: 'bar',
            name: nameofcity[i] + "'s Precipitation"
            };
        data.push(tempplot);
        data.push(rainplot);
        alldata_temp=alldata_temp.concat(temp[i]);
        alldata_rain=alldata_rain.concat(rainsnow["rainsnow"]);
    }
        var range = getrangefortempplot(alldata_temp,alldata_rain);
        var imageinfo = prepareimage(citynumber,icon,time,range,nameofcity);
        var layout = {
            margin:{
                l:45,
                r:30,
                t:30,
                b:50,
            },
            images: imageinfo[0],
            annotations: imageinfo[1],
            xaxis: {
                type: 'date'
                },
            yaxis: {ticksuffix:"°F",range:range[0]},
            yaxis2: {
                constraintoward: "bottom",
                titlefont: {color: 'rgb(62, 120, 237)'},
                tickfont: {color: 'rgb(62, 120, 237)'},
                overlaying: 'y',
                side: 'right',
                ticksuffix:"mm/3h",
                range:range[1]
                },
            legend: {
                orientation: "h",
                x: 0.5,
                y: -0.2,
                xanchor: "center",
                yanchor: "top"
                }
        }
    Plotly.newPlot('plotly_temp', data, layout);
}


function rainSnowMixer(rain,snow,weatherInWord,color){
    if(rain.len<snow.len){
        rain = rain.slice(0, snow.len);
    }
    var result = {rainsnow:[],color:[],text:[]};
    for(var i in rain){

        if(rain[i] == 0){
            if(snow[i] == 0){
                result["rainsnow"].push(0);
                result["color"].push(color[0]);
                result["text"].push("No Rain or Snow");
            }
            else{
                result["rainsnow"].push(snow[i]);
                result["color"].push(color[1]);
                result["text"].push(weatherInWord[i]);
            }
        }
        else{
            if(snow[i] == 0){
                result["rainsnow"].push(rain[i]);
                result["color"].push(color[0]);
                result["text"].push(weatherInWord[i]);
            }
            else{
                result["rainsnow"].push( rain[i] + snow[i]);
                if(rain[i]>snow[i]){
                    result["color"].push(color[0]);
                    result["text"].push(weatherInWord[i]);
                }
                else{
                    result["color"].push(color[1]);
                    result["text"].push(weatherInWord[i]);
                }
            }
        }
    }
    return result;
}

function prepareimage(citynumber,icon,time,range,nameofcity){
        if(citynumber == 1){
            var yrate = [0.9];
        }
        else{
            var yrate = [0.95,0.84];
        }
        var imageinfo = [];
        var textinfo = []
        for(var i = 0; i < citynumber; i = i + 1){
            var citynameonplot = 0
            if(nameofcity[i].length >= 14){
                var text_leftbound = 36 - Math.ceil(nameofcity[i].length / 3);
                var text_rightbound = 36;
                var text_mid = Math.floor((text_rightbound - text_leftbound)/2);
            }
            else{
                var text_leftbound = 32;
                var text_rightbound = 36;
                var text_mid = 2;
            }
            console.log(text_leftbound)
            console.log(text_rightbound)
            console.log(text_mid)
            console.log(nameofcity[i])
            for(var i2 in icon[i]){
                var local = {};
                if(i2 >= text_leftbound && i2 <= text_rightbound){
                    if (citynameonplot == text_mid){
                        local["xref"] = "x";
                        local["yref"] = "y";
                        local["x"] = time[i][i2];
                        local["y"] = range[0][1]*yrate[i];
                        local["text"] = nameofcity[i];
                        local["showarrow"] = false;
                        textinfo.push(local);
                    }
                citynameonplot = citynameonplot + 1
                }
                else{
                    local["source"] = getweathericonurl(icon[i][i2]);
                    local["xref"] = "x";
                    local["yref"] = "y";
                    local["x"] = time[i][i2];
                    local["y"] = range[0][1]*yrate[i];
                    local["sizex"] = 3600000*3*3;
                    local["sizey"] = range[0][1]*0.1166;
                    local["xanchor"] = "center";
                    local["yanchor"] = "middle";
                    imageinfo.push(local);
                }
            }
        }
        return [imageinfo,textinfo];
}

function getrangeforwindplot(wind){
    var max = wind[0];
    var min = wind[0];
    for(var i in wind){
        if(wind[i]>max){
            max = wind[i];
        }
        if(wind[i]<min){
            min = wind[i];
        }
    }
    if(max<0){
        max = 0;
    }
    if(min>0){
        min = 0;
    }
    max = max * 1.2;
    return [min,max];
}

function getrangefortempplot(temp,rain){
    var max = temp[0];
    var min = temp[0];
    for(var i in temp){
        if(temp[i]>max){
            max = temp[i];
        }
        if(temp[i]<min){
            min = temp[i];
        }
    }
    if(max<0){
        max = 0;
    }
    if(min>0){
        min = 0;
    }
    max = max * 1.25;
    var temprange = [min,max];
    
    max = rain[0];
    min = rain[0];
    for(var i in rain){
        if(rain[i]>max){
            max = rain[i];
        }
        if(rain[i]<min){
            min = rain[i];
        }
    }
    if(max<1){
        max = 1;
    }
    if(min>0){
        min = 0;
    }
    max = max * 1.25;
    if(temprange[0]<0 && temprange[1]>0){
        var rainrange=[((-1*temprange[0]*(min-max))/temprange[1])+min,max]; 
    }
    // in case temp has a range lower than 0 (more common in the use of celsius) (this app will support celsius in future)
    // let both left and right y-axis' 0 in same level ↑↑↑
    //
    // a          0                            b
    // |—————|——————————————| (y-axis for temp)
    //
    // z          x                            y
    // |—————|——————————————| (y-axis for rain & snow)
    //
    //
    // 0 - a : 0 + b = z - x : y - x 
    //
    //
    //  - a ( x - y )
    // ———————— + x = z
    //        b    
    //
    // a = temprange[0] | b = temprange[1] | x = min | y = max | z = target
    //
    // This is probably the most serious comment I have ever write _(:зゝ∠)_
    else{
        var rainrange = [min,max];
    }
    return [temprange,rainrange];
}


function changemap(lat,lon,text){
    var option = {
    key: 'VK8VQAs7YaHiT0Z4kyNfwxsEIfSyRCSd',
    verbose: true,
    lat: lat,
    lon: lon,
    zoom: 5,
    overlay: "temp"
        };
    windyInit( option, windyAPI => {
        const { map, picker, utils, broadcast } = windyAPI;
        L.popup()
            .setLatLng([lat,lon])
            .setContent(text)
            .openOn( map );
        picker.on('pickerOpened', latLon => {
            let { lat, lon, values, overlay } = picker.getParams()
            let windObject = utils.wind2obj( values )
        })
        broadcast.once('redrawFinished', () => {
            picker.open({ "lat": lat, "lon":lon })
        })
    });
}

function get_loc1_weather(){
    show_loading_anime()
    var url = window.location.href + "getweather/";
    var data = {}
    data["address"] = document.getElementById("in_location").value;
    data["method"] = "1"
    var datajson = JSON.stringify(data);
    ajaxPostRequest(url,datajson,success_single);
    return 0
}

function get_loc2_weather(){
    show_loading_anime()
    var url = window.location.href;
    url = url + "getweather/";
    var data = {}
    data["address"] = document.getElementById("in_location").value;
    data["method"] = "2"
    var datajson = JSON.stringify(data);
    ajaxPostRequest(url,datajson,success_single);
    return 0
}


function get_both_weather(){
    show_loading_anime()
    var url = window.location.href;
    url = url + "getweather_bothloc/";
    var data = {}
    data["address"] = document.getElementById("in_location").value;
    data["method"] = "3"
    var datajson = JSON.stringify(data);
    ajaxPostRequest(url,datajson,success_double);
    return 0
}

function ajaxPostRequest(path, data, callback){
 var request = new XMLHttpRequest();
 request.onreadystatechange = function(){
 if (this.readyState === 4 && this.status === 200){
 callback(this.response);
 }
 };
 request.open("POST", path);
 request.send(data);
}

function ajaxGetRequest(path, callback){
 var request = new XMLHttpRequest();
 request.onreadystatechange = function(){
 if (this.readyState === 4 && this.status === 200){
 callback(this.response);
 }
 };
 request.open("GET", path);
 request.send();
}