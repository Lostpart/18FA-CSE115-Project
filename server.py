from flask import Flask, request, render_template
import json
import left
import right
import other
import IPy
import urllib.request
app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("/index.html")


@app.route('/data.js')
def datajs():
    return render_template("/data.js")


@app.route('/animation.js')
def animationjs():
    return render_template("/animation.js")


@app.route('/getweather/', methods = ['POST'])
def getweather():
    rawdata = str(request.data)
    ##with open("rid.txt", "a") as f:
        ##f.write(rawdata+"\n")
    data = json.loads(rawdata[2:-1])
    address = data['address']
    method = data['method']
    result = []
    locinfo = left.getlatlon(address, method)
    result.append(left.getmapsetting(locinfo, method)) 
    result.append(right.getrightsidedata(locinfo, method)) 
    result.append(other.html_for_weather_info_part(1))
    return(json.dumps(result))

@app.route("/getweather_withip/", methods=["GET"])
def getweather_withip():
    userIP = request.remote_addr
    if userIP in IPy.IP("8.22.104.0/21"):
        locinfo = [42.88642, -78.87815, "Buffalo"] 
        # Since 90%+ of the request will from our school IP address
        # I add this "cache" to save process time and the API usage
        # 8.22.104.0/21 is the IP address own by our school
    else:
        # http://ipinfo.io/8.8.8.8/geo?token=7df5a703e5f495
        with open("ip.log", "a") as f:
            f.write("http://ipinfo.io/"+userIP+"/geo?token=7df5a703e5f495"+"\n")
        address = json.loads(urllib.request.urlopen("http://ipinfo.io/"+userIP+"/geo?token=7df5a703e5f495").read().decode("utf8", "ignore"))
        loc = address["loc"].split(",",1)
        locinfo = [loc[0],loc[1],address["city"]]
    
    method = "1"
    result = []
    result.append(left.getmapsetting(locinfo, method)) 
    result.append(right.getrightsidedata(locinfo, method)) 
    result.append(other.html_for_weather_info_part(1))
    return(json.dumps(result))


@app.route('/getweather_bothloc/', methods = ['POST'])
def getweather_bothloc():
    rawdata = str(request.data)
    ##with open("rid.txt", "a") as f:
        ##f.write(rawdata+"\n")
    data = json.loads(rawdata[2:-1])
    address = data['address']
    method = data['method']
    method = "3" #This is an add-on feture, so the original design framework does not fit this feture, the method here means almost nothing
    result = []
    loc1_info = left.getlatlon(address, "1")
    loc2_info = left.getlatlon(address, "2")
    result.append(left.getmapsetting(loc2_info, "2")) 
    result.append(right.getrightsidedata_bothloc(loc1_info, loc2_info, method)) 
    result.append(other.html_for_weather_info_part(2))
    return(json.dumps(result))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=82)