import urllib.request
import json
import csv
import math
import time


def getrightsidedata(address, method):
    loc = address
    lat = loc[0]
    lon = loc[1]
    city_name = loc[2] ##用户输入的地方的城市名
    ## if lat == 500:
        ## 错误内容处理  Here is the reserved place to handle error conditions
        ## Update Nov 29 due to some add on feture, I guess I will run out of time and wont handle the error situtation
        
    loc1_current_weatherinfo = getCurrentWeather(lat, lon, city_name, method)
    loc1_forecast_weatherinfo = getForecastWeather(lat, lon, city_name, method)
       
    if method == "1":
        top_text = ""
    else:
        top_text = "The other side of " + loc[2] 
    return {"top_text":top_text,"current":{1:loc1_current_weatherinfo},"forecast":{1:loc1_forecast_weatherinfo}}
     

def getrightsidedata_bothloc(loc1_address,loc2_address, method):
    loc1_lat = loc1_address[0]
    loc1_lon = loc1_address[1]
    loc1_city_name = loc1_address[2] 
    loc2_lat = loc2_address[0]
    loc2_lon = loc2_address[1]
    loc2_city_name = loc2_address[2]
    ## if lat == 500:
        ##错误内容处理 Here is the reserved place to handle error conditions
    loc1_current_weatherinfo = getCurrentWeather(loc1_lat, loc1_lon, loc1_city_name, "1")
    loc1_forecast_weatherinfo = getForecastWeather(loc1_lat, loc1_lon, loc1_city_name, "1")
    loc2_current_weatherinfo = getCurrentWeather(loc2_lat, loc2_lon, loc2_city_name, "2")
    loc2_forecast_weatherinfo = getForecastWeather(loc2_lat, loc2_lon, loc2_city_name, "2")
    top_text = ""
        
    return {"top_text":top_text,"current":{1:loc1_current_weatherinfo,2:loc2_current_weatherinfo},"forecast":{1:loc1_forecast_weatherinfo,2:loc2_forecast_weatherinfo}}     

    
def getCurrentWeather(lat, lon, city_name,method):
    #http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=e01fa3cdfa98f24f7f5063dca43edc55
    data = json.loads(urllib.request.urlopen("http://api.openweathermap.org/data/2.5/weather?lat="+str(lat)+"&lon="+str(lon)+"&appid=b4e8bfa8d277c9dec93cc1a007f6de82&units=imperial").read().decode("utf8","ignore"))
    returndata = {}
    if method == "2":
        if data["name"] == "":
            returndata["name"] = ""
        else:
            returndata["name"] = data["name"]
    else:
        returndata["name"] = city_name
    returndata["formattedname"]=get_formatted_city_name(lat,lon,returndata["name"],0)
    returndata["temp"] = data["main"]["temp"]
    returndata["humidity"] = data["main"]["humidity"]
    returndata["time"] = data["dt"]
    if "rain" in data:
        if "3h" in data["rain"]:
            returndata["rain"] = data["rain"]["3h"]
        else:
            returndata["rain"] = 0
    else:
        returndata["rain"] = 0
    if "snow" in data:
        if "3h" in data["snow"]:
            returndata["snow"] = data["snow"]["3h"]
        else:
            returndata["snow"] = 0
    else:
        returndata["snow"] = 0
    returndata["wind_lvl"] = data["wind"]["speed"]
    if "deg" in data["wind"]:
        returndata["wind_deg"] = data["wind"]["deg"]
    else:
        returndata["wind_deg"] = 0
    returndata["weatherInWord"] = data["weather"][0]["description"]
    returndata["icon"] = data["weather"][0]["icon"]
    return returndata


def getForecastWeather(lat, lon, city_name,method):
    # http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=b4e8bfa8d277c9dec93cc1a007f6de82&units=imperial
    data = json.loads(urllib.request.urlopen("http://api.openweathermap.org/data/2.5/forecast?lat="+str(lat)+"&lon="+str(lon)+"&appid=b4e8bfa8d277c9dec93cc1a007f6de82&units=imperial").read().decode("utf8","ignore"))
    returndata = {}
    if method == "2":
        if "name" in data:
            if data["name"] != "":
                returndata["name"] = data["name"]
            else:
                returndata["name"] = get_formatted_city_name(lat,lon,"",1)
        else:
            returndata["name"] = get_formatted_city_name(lat,lon,"",1)
    else:
        returndata["name"] = city_name
    
    returndata["formattedname"]=get_formatted_city_name(lat,lon,returndata["name"],0)
    returndata["temp"] = []
    returndata["time"] = []
    returndata["rain"] = []
    returndata["snow"] = []
    returndata["wind_lvl"] = []
    returndata["wind_deg"] = []
    returndata["weatherInWord"] = []
    returndata["icon"] = []
    returndata["humidity"] = []
    for hourforecast in data["list"]:
        returndata["temp"].append(hourforecast["main"]["temp"])
        returndata["humidity"].append(hourforecast["main"]["humidity"])
        returndata["time"].append(hourforecast["dt"])
        if "rain" in hourforecast:
            if "3h" in hourforecast["rain"]:
                returndata["rain"].append(hourforecast["rain"]["3h"])
            else:
                returndata["rain"].append(0)
        else:
            returndata["rain"].append(0)
        if "snow" in hourforecast:
            if "3h" in hourforecast["snow"]:
                returndata["snow"].append(hourforecast["snow"]["3h"])
            else:
                returndata["snow"].append(0)
        else:
            returndata["snow"].append(0)
        returndata["wind_lvl"].append(hourforecast["wind"]["speed"])
        if "deg" in hourforecast["wind"]:
            returndata["wind_deg"].append(hourforecast["wind"]["deg"])
        else:
            returndata["wind_deg"].append(0)
        returndata["weatherInWord"].append(hourforecast["weather"][0]["description"])
        returndata["icon"].append(hourforecast["weather"][0]["icon"])
    return returndata


def get_formatted_city_name(lat,lon,cityname,method):
    ## http://api.opencagedata.com/geocode/v1/json?q=42.88642,116.87815&limit=1&language=en&key=b88f47bb32ac4b6fb81e7fbf611f9e21
    ## time.sleep(1) ## API limit, 1 request/ses
    lat = float(lat)
    lon = float(lon)
    key = "key=b88f47bb32ac4b6fb81e7fbf611f9e21"
    cityname = cityname.replace(",", "%2C")
    cityname = cityname.replace(" ", "+")
    if method > 0:
        data = json.loads(urllib.request.urlopen("http://api.opencagedata.com/geocode/v1/json?q="+str(lat)+","+str(lon)+"&limit=1&language=en&"+key).read().decode("utf8","ignore"))
        return data["results"][0]["formatted"]
    if cityname != "":
        data = json.loads(urllib.request.urlopen("http://api.opencagedata.com/geocode/v1/json?q="+urllib.request.quote(cityname)+"&limit=1&language=en&bounds="+str(lon-1)+","+str(lat-1)+","+str(lon+1)+","+str(lat+1)+"&"+key).read().decode("utf8","ignore"))
        if data["results"] == []:
            return cityname
        else:
            return data["results"][0]["formatted"]
    else:
        data = json.loads(urllib.request.urlopen("http://api.opencagedata.com/geocode/v1/json?q="+str(lat)+","+str(lon)+"&limit=1&language=en&"+key).read().decode("utf8","ignore"))
        return data["results"][0]["formatted"]
        
        
    
    
##print(json.dumps(getrightsidedata([42.91697,-78.80975,"Buffalo"],"1")))
##print(" ")   
##print(getForecastWeather(42.91697,-78.80975,"Buffalo","1"))