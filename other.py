def html_for_weather_info_part(numberofcity):
    path = "D:/OneDrive/OneDrive - buffalo.edu/Code/IdeaProject/CSE115-Project1"
    numberofcity = numberofcity + 10
    if numberofcity == 12:
        with open(path + "/html/double.html") as f:
            return f.read()
    else:
        with open(path+"/html/singal.html") as f:
            return f.read()