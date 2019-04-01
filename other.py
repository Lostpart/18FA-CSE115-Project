def html_for_weather_info_part(numberofcity):
    path= "C:/wamp/www/UB/CSE115/Project2"
    numberofcity = numberofcity + 10
    if numberofcity == 12:
        with open(path + "/html/double.html") as f:
            return f.read()
    else:
        with open(path+"/html/singal.html") as f:
            return f.read()