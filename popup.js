function getCurrentUnixTimestamp() {
    const now = new Date();
    const unixTimestamp = Math.floor(now.getTime() / 1000); // Konvertiere Millisekunden in Sekunden

    return unixTimestamp;
}

function saveStop(id, name) {
    let favStops = JSON.parse(localStorage.getItem("favStops"));
    let isSaved = false;
    favStops.forEach((el) => {
        if(el.id === id){
            isSaved = true;
        }
    })
    if(isSaved) return;
    let jsonObject = {"id": id, "name": name}
    favStops.push(jsonObject);
    localStorage.setItem("favStops", JSON.stringify(favStops));
}
function convertToTimestamp(timeFormat) {
    // Erstelle ein Date-Objekt aus dem übergebenen Zeitformat
    var date = new Date(timeFormat);

    // Extrahiere den Timestamp und gib ihn zurück
    return date.getTime();
}


function berechneZeitDifferenz(zeit1, zeit2) {
    // Zerlege die Zeitangaben in Stunden und Minuten
    var teile1 = zeit1.split(':');
    var teile2 = zeit2.split(':');

    // Konvertiere Stunden und Minuten in Minuten
    var minuten1 = parseInt(teile1[0]) * 60 + parseInt(teile1[1]);
    var minuten2 = parseInt(teile2[0]) * 60 + parseInt(teile2[1]);

    // Berechne die Differenz in Minuten
    var differenzInMinuten = Math.abs(minuten2 - minuten1);

    return differenzInMinuten;
}


function convertUnixTimestamp(timestamp) {
    // Konvertiere den UNIX-Timestamp in Millisekunden
    var date = new Date(timestamp * 1000);

    // Erstelle ein Array für die Wochentage und Monate
    var daysOfWeek = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
    var months = ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."];

    // Extrahiere Tag, Monat, Jahr und Wochentag
    var dayOfWeek = daysOfWeek[date.getUTCDay()];
    var day = date.getUTCDate();
    var month = months[date.getUTCMonth()];
    var year = date.getUTCFullYear();

    // Formatiere das Datum
    var formattedDate = `${dayOfWeek} ${day} ${month} ${year}`;

    return formattedDate;
}

function format_time(time) {
    var parsedDate = new Date(time);
    var hours = parsedDate.getHours();
    var minutes = parsedDate.getMinutes();

    var parsed_result = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return parsed_result;
}


$(function () {

    $("#von-input").val(localStorage.getItem("start_local_string"));
    $("#nach-input").val(localStorage.getItem("stop_local_string"));


    var localTheme = window.localStorage.getItem('data-theme');

    if (!localTheme) {
        console.log('voreisntellungen');
        window.localStorage.setItem('data-theme', 'light');
    }

    if (localTheme === 'dark') {
        console.log('todarkmode');
        window.localStorage.removeItem('data-theme');
        changeToDarkMode();
    } else {
        window.localStorage.removeItem('data-theme');
        changeToLightMode()
    }

    $("#theme-switch-button").on("click", function () {
        console.log('click');
        var currentLocalTheme = window.localStorage.getItem('data-theme');

        if (currentLocalTheme === 'light') {
            changeToDarkMode();
        } else {
            changeToLightMode()
        }
    });

    if (localStorage.getItem("favStops") == null || localStorage.getItem("favStops") === "") {
        localStorage.setItem("favStops", "[]")
    }
    $("#fahrplan-suche").hide();
    $("#wechsel-fahrplan").on("click", () => {
        $('#fav-liste').empty();
        let favStops = JSON.parse(localStorage.getItem("favStops"));
        favStops.forEach((el) => {
            $('#fav-liste').append(`
                                    <div>
                                        <li class="list-group-item row"> 
                                           <button class="btn fav-list-item col-12 justify-content-start" style="text-align: start;" data-eva-id="${el.id}" data-target-value="${el.name}">
                                                <i class="fa-solid fa-hotel" style="color: #afb4bb;">  </i>${el.name} 
                                            </button>
                                        </li>
                                    </div>`);
        })
        $(".fav-list-item").on("click", function() {
            fetchDepartures($(this).attr("data-eva-id"))
        })


        $("#verbindungs-suche").hide();
        $("#fahrplan-suche").show();
    })
    $("#homepage").on("click", () => {
        $("#verbindungs-suche").show();
        $("#fahrplan-suche").hide();
    })

    $(".kalender").flatpickr({
        enableTime: true,
        inline: true,
        dateFormat: "Z",
        locale: "de"
    });

    function parseIsoToDe(d){
        if(d.getMinutes.length >= 2) {
            return d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":0" + d.getMinutes();
        } else {
            return d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        }

    }

    // let maximumTransfers = document.getElementById("maxTransfers").value;
    let withBikeValue = document.getElementById("withBike").value;
    let withBike = false;
    $("#apply-options").on("click", function () {
        $('.modal').modal('hide');
        if (withBikeValue === "on") {
            withBike = true;
        }
    });

    const date = new Date();
    $("#hin-datum").html(parseIsoToDe(new Date(date.toISOString())));
    $("#abfahrts-datum").html(parseIsoToDe(new Date(date.toISOString())));
    $("#apply-hinfahrt").on("click", () => {
        let date = new Date($("#hinfahrt-kalender").val())
        $("#hin-datum").html(parseIsoToDe(date));
        $("#hinfahrt-modal").modal("hide");
    });
    $("#apply-abfahrt").on("click", () => {
        let date = new Date($("#abfahrts-kalender").val())
        $("#abfahrts-datum").html(parseIsoToDe(date));
        $("#abfahrts-modal").modal("hide");
    });

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const setStopValue = (id, value, evaId) => {
        $(id).val(value);
        $(id).attr("data-eva-id", evaId);
        $('.modal').modal('hide');
    }
    const fetchDepartures = (id) => {
        $('.modal').modal('hide');
        $('#fahrplan-ergebnis-liste').empty();
        let kalender = $("#abfahrts-kalender");
        let when;
        if (kalender.val() != "") {
            when = kalender.val();
        } else {
            when = new Date().toISOString();
        }
        fetch(`https://v6.db.transport.rest/stops/${id}/departures?when=${when}&duration=10&results=10&linesOfStops=true&remarks=true&language=en`, requestOptions)
            .then(response => {
                response.json().then(result => {
                    let departuresList = result.departures;
                    // console.log(departuresList);

                    // console.log(departuresList)
                    for (let i = 0; i < departuresList.length; i++) {

                        let planned_when = format_time(departuresList[i].plannedWhen);
                        let actual_when = format_time(departuresList[i].when);
                        let bahn_id = departuresList[i].line.name;

                        $(``)

                        $('#fahrplan-ergebnis-liste').append(` 
                                    <li class="list-group-item stop-list-item" data-trip-id="${departuresList[i].tripId}" > 
                                       ${departuresList[i].stop.name} nach ${departuresList[i].destination.name}<br>

                                       <span>Geplante Abfahrt: <span style="color:green">${planned_when}</span>, 
                                       Abfahrt: <span style="color:green">${actual_when}</span>, ${bahn_id}
                                       </span><br>
                                       
                                  </li>`);
                    }
                })
            })

        $('#fahrplan-ergebnis-modal').modal('show');

    }

    $('.text-input-modal').on("input", function fetchStations() {
        $('#von-liste').empty();
        $('#nach-liste').empty();
        let station = $(this).val();
        if (station == null || station === "") {
            return;
        }
        let listId = $(this).attr("id").split("-")[0] + "-liste";
        let inputId = $(this).attr("id").split("-")[0] + "-input";
        fetch(`https://v6.db.transport.rest/stations?query=${station}&limit=20&fuzzy=true&completion=true`, requestOptions)
            .then(response => {
                response.json().then(result => {
                    let stopPlaces = Object.values(result);
                    for (let i = 0; i < stopPlaces.length; i++) {
                        $('#' + listId).append(`
                                    <div>
                                        <li class="list-group-item row"> 
                                           <button class="btn stop-list-item col-12 justify-content-start" style="text-align: start;" data-eva-id="${stopPlaces[i].id}" data-target-id="#${inputId}">
                                                <-- <i class="fa-solid fa-hotel" style="color: #afb4bb;">  </i>${stopPlaces[i].name}  
                                            </button>
                                        </li>
                                    </div>`);
                    }
                    $(".stop-list-item").on("click", function () {
                        setStopValue($(this).attr('data-target-id'), $(this).attr('data-target-value'), $(this).attr('data-eva-id'))
                    })
                })
            })
            .catch(error => console.log('error', error));
    });

    $('#haltestelle-input-modal').on("input", function fetchStations() {
        $('#fahrplan-liste').empty();
        let station = $(this).val();
        if (station == null || station === "") {
            return;
        }
        let listId = "fahrplan-liste";
        let inputId = "haltestelle-input";
        fetch(`https://v6.db.transport.rest/stations?query=${station}&limit=20&fuzzy=true&completion=true`, requestOptions)
            .then(response => {
                response.json().then(result => {
                    let stopPlaces = Object.values(result);
                    for (let i = 0; i < stopPlaces.length; i++) {
                        $('#' + listId).append(`
                                    <div>
                                        <li class="list-group-item row"> 
                                           <button class="btn fahrplan-list-item col-9 justify-content-start" style="text-align: start;" data-eva-id="${stopPlaces[i].id}" data-target-id="#${inputId}" data-target-value="${stopPlaces[i].name}">
                                                <i class="fa-solid fa-hotel" style="color: #afb4bb;">  </i>${stopPlaces[i].name} 
                                            </button>
                                            <button class="btn save-button col-2" data-target-value="${stopPlaces[i].name}" data-eva-id="${stopPlaces[i].id}">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                            </button>
                                        </li>
                                    </div>`);


                    }
                    $(".fahrplan-list-item").on("click", function () {
                        fetchDepartures($(this).attr("data-eva-id"));
                    })
                    $(".save-button").on("click", function () {
                        saveStop($(this).attr('data-eva-id'), $(this).attr('data-target-value'));
                    })
                })
            })
            .catch(error => console.log('error', error));
    });

    $("#station-tauschen").on("click", function (e) {
        let temp = $("#von-input").val();
        $("#von-input").val($("#nach-input").val());
        $("#nach-input").val(temp);

        let temp_eva = localStorage.getItem("start_local_eva");
        localStorage.setItem("start_local_eva", localStorage.getItem("stop_local_eva"));
        localStorage.setItem("stop_local_eva", temp_eva);
        

        let temp_string = localStorage.getItem("start_local_string");
        localStorage.setItem("start_local_string", localStorage.getItem("stop_local_string"));
        localStorage.setItem("stop_local_string", temp_string);

        e.preventDefault();
    });

    $("#suchen-button").on("click", function (e) {
        e.preventDefault();


        let start = $("#von-input").attr("data-eva-id");
        let dst = $("#nach-input").attr("data-eva-id");

        if(start !== undefined && dst !== undefined){
            localStorage.setItem("start_local_string", $("#von-input").val());
            localStorage.setItem("stop_local_string", $("#nach-input").val());

            localStorage.setItem("start_local_eva", start);
            localStorage.setItem("stop_local_eva", dst);
        }



        if(localStorage.getItem("start_local_eva") !== null && localStorage.getItem("stop_local_eva") !== null) {
            start = localStorage.getItem("start_local_eva");
            dst = localStorage.getItem("stop_local_eva");
        }


        $(`#result-itmes`).empty();

        if(start !== undefined && dst !== undefined) {
            var container = document.getElementById("result-items")

            // $("#von-input").val(localStorage.getItem("start_local"));
            // $("#nach-input").val(localStorage.getItem("stop_local"));
            

            document.body.style.height = document.getElementById("main-body").clientHeight + 100 + '%';
            document.body.style.backgroundColor = "white";

            var currentUnixTimestamp = getCurrentUnixTimestamp();

            if($(`#hinfahrt-kalender`).val() == "") {
                currentUnixTimestamp = getCurrentUnixTimestamp();
            } else {
                currentUnixTimestamp = convertToTimestamp($(`#hinfahrt-kalender`).val()) /1000;
            }
            $(`#current_date`).empty();
            $(`#current_date`).append(`
            Ergebnisse vom ${convertUnixTimestamp(currentUnixTimestamp)}
            `);

            let bike = $("#withBike").prop("checked");
            // console.log(currentUnixTimestamp);
            // console.log($(`#hinfahrt-kalender`).val());
            $(`#result-items`).empty();

            fetch(`https://v6.db.transport.rest/journeys?from=${start}&departure=${currentUnixTimestamp}&to=${dst}&results=10&language=de&transfers=2&bike=${bike}`).then((response) => {
                // console.log(response);



                response.json().then((data) => {
                    // console.log(data);
                    let numDivs = data.journeys.length;

                    console.log(data.journeys)

                    let counter = -1;
                    // console.log(data.journeys[0].legs.destination)
                    for (var i = 0; i < numDivs; i++) {
                        counter++;

                        let all_data = data.journeys[counter]

                        let strt = all_data.legs[0].origin.name
                        let dst = all_data.legs[0].destination.name
                        let re_nr = all_data.legs[0].line.name


                        let start_time = all_data.legs[0].departure
                        let arrival_time = all_data.legs[0].arrival
                        let planned_arrival = all_data.legs[0].plannedArrival;
                        let planned_departure = all_data.legs[0].plannedDeparture;

                        let parsed_start_time = format_time(start_time);
                        let parsed_end_time = format_time(arrival_time);
                        let planned_arrival_formatted = format_time(planned_arrival);
                        let planned_departure_formatted = format_time(planned_departure);



                        // let result_times = parsed_end_time - parsed_start_time;

                        let nach = all_data.legs[0].direction;
                        let gleis_von = all_data.legs[0].departurePlatform;
                        let gleis_ankunft_geplant = all_data.legs[0].plannedArrivalPlatform;
                        let gleis_ankunft_tatsächlich = all_data.legs[0].arrivalPlatform;



                        if(data.journeys[i].legs.length == 2){
                            let all_data = data.journeys[counter]
                            let re_nr_2 = all_data.legs[1].line.name

                            dst = all_data.legs[1].destination.name

                            arrival_time = all_data.legs[1].arrival
                            parsed_end_time = format_time(arrival_time);

                            planned_arrival = all_data.legs[1].plannedArrival;
                            planned_arrival_formatted = format_time(planned_arrival);

                            let zwischenhalt = all_data.legs[1].origin.name
                            let zwischenhalt_start = format_time(all_data.legs[1].departure)

                            let zwischenhalt_ankunft = format_time(all_data.legs[0].arrival)

                            let result_time = berechneZeitDifferenz(parsed_start_time, parsed_end_time)
                            $("#result-items").append(`
                            <div class="accordion accordion-flush" id="${i}">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="flush-headingOne">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" id="row-item-clickable" data-bs-target="#flush-collapse-${i}" aria-expanded="false" aria-controls="flush-collapseOne">
                                        <div class="elements-listed">
                                            <p id="start-stop-time-planned"><b>${planned_departure_formatted} - ${planned_arrival_formatted}</b><span id="result_time"> | ${result_time}min</span></p>
                                            <p id="start-stop-time"><b>${parsed_start_time}</b><b id="end_time_parsed">${parsed_end_time}</b></p>
                                            <div id="re-number-div-01">
                                            <span id="re_01">${re_nr}</span>
                                            <span id="re_02">${re_nr_2}</span>
                                            </div>
                                            <div>
                                                <div id="start_element" class="row">
                                                    <span class="col-10">${strt}</span>
                                                    <span class="col-2">${dst}</span> 
                                                </div>
                                            </div>
                                        </div>

                                    </button>
                                    
                                    </h2>
                                    <div id="flush-collapse-${i}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body">
                                        <span id="re_nr_collapsed">${re_nr}</span><br>
                                        <span>${planned_departure_formatted} von ${strt}</span><br>
                                        <span>${zwischenhalt_ankunft} nach ${nach}</span><br>
                                        <br>
                                        <span>Umstieg</span><br><br>
                                        <span id="re_nr_collapsed" style="background-color:black">${re_nr_2}</span><br>
                                        <span>${zwischenhalt_start} von ${zwischenhalt}</span><br>
                                        <span>${planned_arrival_formatted} nach ${dst}</span><br>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            `)

                        } else {
                            let result_time = berechneZeitDifferenz(parsed_start_time, parsed_end_time)

                            // let störungen = all_data.legs[0].remarks[1].type
                            // console.log(störungen)
                            // let störungen_message = "";

                            // if(störungen === "status") {

                            //     // störungen_message = all_data.legs[0].remarks[1].name
                            // } else {
                            //     störungen_message = "";
                            // // }
                            // if(data.journeys[i].legs.length >= 1){
                            //     console.log(data.journeys[i].legs);
                            //     console.log(true)
                            // }

                            $("#result-items").append(`
                            <div class="accordion accordion-flush" id="${i}">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="flush-headingOne">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" id="row-item-clickable" data-bs-target="#flush-collapse-${i}" aria-expanded="false" aria-controls="flush-collapseOne">
                                        <div class="elements-listed">
                                            <p id="start-stop-time-planned"><b>${planned_departure_formatted} - ${planned_arrival_formatted}</b><span id="result_time"> | ${result_time}min</span></p>
                                            <p id="start-stop-time"><b>${parsed_start_time}</b><b id="end_time_parsed">${parsed_end_time}</b></p>
                                            <div id="re-number-div">${re_nr}</div>
                                            <div>
                                                <div id="start_element" class="row">
                                                    <span class="col-10">${strt}</span>
                                                    <span class="col-2">${dst}</span> 
                                                </div>
                                            </div>
                                        </div>

                                    </button>
                                    
                                    </h2>
                                    <div id="flush-collapse-${i}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body">
                                    <span id="re_nr_collapsed">${re_nr}</span><br>
                                    <span>nach ${nach}</span>
                                    
                                    <span id="aktuelle-meldungen"></span>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            `)

                            $(`#element${i}`).append('<a class="btn" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Link with href</a>')
                            // link_btn.className="btn btn-primary";
                            // link_btn.append(`
                            // <a class="btn" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                            // Link with href</a>
                            // `);


                            // newDiv.appendChild(link_btn)


                            //
                            // addAccordionToDiv(newDiv, counter);
                            // newDiv.appendChild(start_element);

                            // break;

                        }
                    }
                        $("#ergebnisse-modal").modal("show")
                });
            });

        } else {
            alert("Fehler!\n\nIhr Start- oder Endzeitpunkt ist fehlerhaft!")
            // $(`#result-itmes`).empty();
            // $("#ergebnisse-modal").modal("show")
            // $(`#result-items`).append(`
            // <strong id="error-msg">Fehler: Sie haben keinen Start- oder Zielpunkt festgelegt!</strong>
            // `);
        }

        // var cell1 = table.insertRow(0);
        // cell1.innerHTML = "Test";
        // } else {
        //     console.log("Fehler")
        // }

    })
});

function changeToDarkMode() {
    var currentBody = document.querySelector('body');

    currentBody.classList.add('darktheme');

    window.localStorage.setItem('data-theme', 'dark');
}

function changeToLightMode() {
    var currentBody = document.querySelector('body');

    currentBody.classList.remove('darktheme');

    window.localStorage.setItem('data-theme', 'light');
}