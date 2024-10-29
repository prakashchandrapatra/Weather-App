const body = document.querySelector('body'),
    temp = document.getElementById("temp"),
    date = document.getElementById("day-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    minIcon = document.getElementById("icon"),
    UVIndex = document.querySelector(".uv-index"),
    UVText = document.querySelector(".uv-text"),
    WindSpeed = document.querySelector(".Wind-Status"),
    SunRise = document.querySelector(".sunrise"),
    SunSet = document.querySelector(".sunset"),
    humidity = document.querySelector(".humidity"),
    Visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-Quality"),
    airQualityStatus = document.querySelector("air-Quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    weatherCards1 = document.querySelector("#weather-cards1"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".weekly"),
    tempUnit = document.querySelectorAll(".temo-unit"),
    esearchForm = document.querySelector('#search'),
    search = document.querySelector('#query'),
    today = document.getElementById('today'),
    week = document.getElementById('week'),
    searchBtn = document.querySelector('#search button');

    
    let currentCity = "";
    let currentUnit = "c";
    let hourlyorWeek = "";

hourlyBtn.addEventListener('click', (e) => {
    today.style.display = 'block';
    week.style.display = 'none';
})

weekBtn.addEventListener('click', (e) => {
    week.style.display = 'block';
    today.style.display = 'none';
})

// update date time

function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    // 12hour format
    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}
date.innerText = getDateTime();
// update time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);
// function to get public Ip with fetch

function getPUblicIp() {
    fetch("https://geolocation-db.com/json/")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
            currentCity ?? (currentCity='Bengaluru');
            console.log(currentCity);

            getWeatherData(currentCity, currentUnit, hourlyorWeek);
        });
}
getPUblicIp();
// function to get weatherdata

function getWeatherData(city, unit, hourlyorweek) {
    console.log(city);
    
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFarenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "perc -" + today.precip + "%"
            UVIndex.innerText = today.uvindex;
            WindSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity + "%";
            Visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            // updateairQualityStatus(today.winddir);
            SunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
            SunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            minIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            updateForecast(data.days, unit, "week");
            updateForecast(data.days[0].hours, unit, "day");
        })
        .catch((err) => {
            alert("city not found in our database");
            console.log(err)
        })
}

// convert celcius to fahrenheit
function celciusToFarenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}
// function to get UVIndex status
function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        UVText.innerText = "Low";
    } else if (uvIndex <= 5) {
        UVText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        UVText.innerText = "High";
    } else if (uvIndex <= 10) {
        UVText.innerText = "Very High";
    } else if (uvIndex <= 5) {
        UVText.innerText = "Extreme";
    }
}

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low"
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderatee";
    } else {
        humidityStatus.innerText = "Heigh";
    }
}

function updateVisibilityStatus(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog"
    } else if (visibility <= 0.16) {
        visibilityStatus.innnerText = "Moderate Fog"
    } else if (visibility <= 0.35) {
        visibilityStatus.innnerText = "Moderate Fog"
    } else if (visibility <= 1.13) {
        visibilityStatus.innnerText = "Light Fog"
    } else if (visibility <= 2.16) {
        visibilityStatus.innnerText = "very Light Fog"
    } else if (visibility <= 5.4) {
        visibilityStatus.innnerText = "Light Mist"
    } else if (visibility <= 10.8) {
        visibilityStatus.innnerText = "very Light Mist"
    } else if (visibility <= 0.16) {
        visibilityStatus.innnerText = "Clear Air"
    } else if (visibility <= 0.16) {
        visibilityStatus.innnerText = "Very clear Air";
    }
}


function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour > 12 ? hour - 12 : hour;
    // hour = hour & 12;
    // hour = hour ? hour : 12;
    // hour = hour < 10 ? "0" + hour : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
        return "https://i.ibb.co/1nxNGHL/10.png";
    }
}
function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Satureday",
    ];
    return days[day.getDay()];
}

function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    // 24cards if hourly weather and 7 for weekly
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
        weatherCards1.innerHTML = '';
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");

        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        // hour if hourly and day name if weekly
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciusToFarenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempunit = "°C";
        if (unit === "f") {
            tempunit = "°F";
        }
        card.innerHTML = `
        
         <h2 class="day-name">${dayName}</h2>
        <div class ="card-icon">
       <img src="${iconSrc}" alt="" width="100px" />
       </div>
       <div class ="day-temp">
       <h2 class="temp">${dayTemp}</h2>
       <span class = "temo-unit">${tempunit}</span>
        
         `;
        weatherCards.appendChild(card);
        if(type === "week") weatherCards1.appendChild(card);
        day++;
    }
}

function changeBackground(condition) {
    if (condition === "partly-cloudy-day") {
        body.style.backgroundImage = `url("https://i.ibb.co/qNv7NxZ/pc.webp")`;
    } else if (condition === "partly-cloudy-night") {
        body.style.backgroundImage = `url("https://i.ibb.co/RDfPqXz/pcn.jpg")`;
    } else if (condition === "rain") {
        body.style.backgroundImage = `url("https://i.ibb.co/h2p6Yhd/rain.webp")`;
    } else if (condition === "clear-day") {
        body.style.backgroundImage = `url("https://i.ibb.co/WGry01m/cd.jpg")`;
    } else if (condition === "clear-night") {
        body.style.backgroundImage = `url("https://i.ibb.co/kqtZ1Gx/cn.jpg")`;
    } else {
        body.style.backgroundImage = `url("https://i.ibb.co/qNv7NxZ/pc.webp")`;
    }
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
    fahrenheitBtn.style.backgroundColor = 'black';
    fahrenheitBtn.style.color = 'white';
    fahrenheitBtn.style.borderRadius = '50%';
    fahrenheitBtn.style.padding = '10px';
    celciusBtn.style.backgroundColor = 'white';
    celciusBtn.style.color = 'black';
    celciusBtn.style.borderRadius = '50%';
    celciusBtn.style.border = 'none';
    celciusBtn.style.padding = '10px';
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
    celciusBtn.style.backgroundColor = 'black';
    celciusBtn.style.color = 'white';
    celciusBtn.style.borderRadius = '50%';
    celciusBtn.style.padding = '10px';
    fahrenheitBtn.style.backgroundColor = 'white';
    fahrenheitBtn.style.color = 'black';
    fahrenheitBtn.style.borderRadius = '50%';
    fahrenheitBtn.style.padding = '10px';
});

function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit; {
            tempUnit.forEach((elem) => {
                elem.innerText = `°${unit.toUpperCase()}`;
            });
            if (unit === "c") {
                celciusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            } else {
                celciusBtn.classList.remove("active");
                fahrenheitBtn.classList.remove("active");
            }
            // call get after weather change unit
            getWeatherData(currentCity, currentUnit, hourlyorWeek);
        }
    }
}

// hourlyBtn.addEventListener("click", () => {
//     changeTimeSpan("hourly");
// });
// weekBtn.addEventListener("click", () => {
//     changeTimeSpan("week");
// });

function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        // update weather on time change
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const city = search.value.trim();
    console.log(city);
    getWeatherData(city, 'c', 'hourly');
})

// esearchForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     let location = search.value;
//     if (location) {
//         currentCity = location;
//     }
// });

// // lets create a cities array which we want to suggest or we can use any api for this

// cities = [
//     "Abbottabad",
//     "Islamaba",
//     "Lahore",
//     "Karachi",
//     "peshawar",
//     "Multan",
//     "Rawalpindi",
//     "Bahawalnagar",
//     "Chakwal",
// ];

// var currentFocus;
// // adding eventlistner on search input
// search.addEventListener("input", function (e) {
//     removeSuggestions();
//     var a,
//         b,
//         i,
//         val = this.value;
//     if (!val) {
//         return false;
//     }
//     currentFocus = -1;
//     //   creating a ul with a id
//     a = document.createElement("ul");
//     a.setAttribute("id", "suggestion");
//     // append the ul to its parent which is search form
//     this.parentNode.appendChild(a);
//     // addding li's with matching search suggestions
//     for (i = 0; i < cities.length; i++) {
//         // check if items start with same latters which are in input

//         if (cities[i].substr(0, val.length).toUpperCase() == val, toUpperCase()) {
//             // if any suggestion  matching then create li
//             b = document.createElement("li");
//             // addig content in li
//             // strong to make the machine latter bold
//             b.innerHTML = "<strong>" + cities[i].subtr(0, val.length) + "</strong>";
//             // remaining part of suggestion
//             b.innerHTML += cities[i].substr(val.length);
//             // input field to hold the suggestion value
//             b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

//             // adding eventListener on suggestion
//             b.addEventListener("click", function (e) {
//                 // on click set the search input value with the clicked suggestion value
//                 search.value = this.getElementsByTagName("input")[0].value;
//                 removeSuggestions();
//             });

//             //append suggestion li to ul
//             a.appendChild(b);
//         }

//     }
// });

// // its working but every suggestion is coming over prev
// function removeSuggestions() {
//     // select the ul which is being adding onn search input
//     var x = document.getElementById("suggestion");
//     // if x exists remove it
//     if (x) x.parentNode.removeChild(x);
// }

// // lets add up and down keys functionality to select a suggestion

// search.addEventListener("keydown", function (e) {
//     var x = document.getElementById("suggetions");
//     // select all the li element of suggestion
//     if (x) x = x.getElementsByTagName("li");

//     if (e.keyCode === 40) {
//         // if the keyCode is down button
//         currentFocus++;
//         // let create a function to add active suggestion
//         addActive(x);
//     } else if (e.keyCode === 38) {
//         // if key code is up button
//         currentFocus--;
//         addActive(x);
//     }
//     if (e.keyCode === 14) {
//         // if enter is presed add the current select sggestion in input field
//         e.preventDefault();
//         if (currentFocus > -1) {
//             // if any suggestion is selected click
//             if (x) x[currentFocus].click();
//         }
//     }
// });
// function addActive(x) {
//     // if there is no suggestion return as it is
//     if (!x) return false;
//     removeActive(x);
//     // if current focus is more than the length of suggestion arraya make it 0
//     if (currentFocus >= x.length) currentFocus = 0;
//     // if its less than a make it last suggestion equals
//     if (currentFocus < 0) currentFocus = x.length - 1;
//     // adding active class on focused li
//     x[currentFocus].classList.add("active");
// }

// // its working but we need to remove previusly actively actived suggestion

// function removeActive(x) {
//     for (var i = 0; i < x.length; i++) {
//         x[i].classList.remove("active");
//     }
// }