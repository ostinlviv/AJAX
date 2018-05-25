var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    var crd = pos.coords;
    var dayid = 0;
    fetch('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/be12d49bf39b10aa1e2201635d9a8f3f/'
        + crd.latitude + ',' + crd.longitude + '?units=si')
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            var $temp = document.getElementById('temperature');
            var $weather = document.getElementById('weather');
            var $summary = document.getElementById('summary');
            var $date = document.getElementById('date');
            var $prevBtn = document.getElementById('prev');

            function now() {
                dayid = 0;
                function skycons() {
                    var skycons = new Skycons({"color": "black"});
                    skycons.add(document.getElementById("weather"), data.currently.icon);
                    skycons.play();
                }
                skycons();
                $temp.innerHTML = data.currently.temperature.toFixed(1) + ' °C';
                $weather.innerHTML = data.currently.icon;
                $summary.innerHTML = data.currently.summary;
                $date.innerHTML = 'Now';
                $prevBtn.style.display = 'none';
            }
            now();

            function forecast (){
                var averageTemp = ((data.daily.data[dayid].temperatureHigh + data.daily.data[dayid].temperatureMin) / 2).toFixed(1);
                $prevBtn.style.display = 'inline-block';
                $temp.innerHTML = averageTemp + ' °C';
                $weather.innerHTML = data.daily.data[dayid].icon;
                function skycons() {
                    var skycons = new Skycons({"color": "black"});
                    skycons.add(document.getElementById("weather"), data.daily.data[dayid].icon);
                    skycons.play();
                }
                skycons();
                $summary.innerHTML = data.daily.data[dayid].summary;
                var time = data.daily.data[dayid].time;
                var date = new Date();
                date.setTime(time * 1000);
                $date.innerHTML = date.getDate() + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
            }

            function next() {
                    document.getElementById('next').addEventListener('click', function () {
                        if (dayid < data.daily.data.length - 1) {
                            dayid += 1;
                        }
                        forecast();
                    });
            }
            next();

        function previous() {
            document.getElementById('prev').addEventListener('click', function () {

                if (dayid > 1) {
                    if (dayid === 8) {
                        dayid -= 2;
                    } else dayid -=1;
                    forecast();

                } else {
                    now();
                }
            });
        }
        previous();

    }).catch(function (ex) {
        console.log('parsing failed', ex)
    });
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + crd.latitude + ',' + crd.longitude +
        '&key=AIzaSyB6ra89ldXx9k4fjdPMJwUXiU8r0JiGo4c')
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            document.getElementById('city').innerHTML = data.results[0].address_components[3].long_name;
        }).catch(function (ex) {
            console.log('parsing failed', ex)
        });
}

function error(err) {
    console.warn("ERROR" + err.code + err.message);
}

navigator.geolocation.getCurrentPosition(success, error, options);



