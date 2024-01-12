function getCurrentUnixTimestamp() {
    const now = new Date();
    const unixTimestamp = Math.floor(now.getTime() / 1000); // Konvertiere Millisekunden in Sekunden

    return unixTimestamp;
}


function format_time(time) {
    var parsedDate = new Date(time);
    var hours = parsedDate.getHours();
    var minutes = parsedDate.getMinutes();

    var parsed_result = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return parsed_result;
}
function addAccordionToDiv(parentDiv, counter, start, destination, line, startTime, endTime) {
    var detailsButton = document.createElement("button");
    detailsButton.className = "btn btn-outline-secondary btn-sm";
    detailsButton.type = "button";
    detailsButton.innerHTML = "Details";

    var accordionContainer = document.createElement("div");
    accordionContainer.className = "accordion";
    accordionContainer.id = `accordion-${counter}`;

    var accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item";

    var accordionHeader = document.createElement("h2");
    accordionHeader.className = "accordion-header";
    accordionHeader.id = `heading-${counter}`;

    var accordionButton = document.createElement("button");
    accordionButton.className = "accordion-button collapsed";
    accordionButton.type = "button";
    accordionButton.setAttribute("data-bs-toggle", "collapse");
    accordionButton.setAttribute("data-bs-target", `#collapse-${counter}`);
    accordionButton.setAttribute("aria-expanded", "false");
    accordionButton.setAttribute("aria-controls", `collapse-${counter}`);
    accordionButton.innerHTML = "Details";

    var accordionCollapse = document.createElement("div");
    accordionCollapse.id = `collapse-${counter}`;
    accordionCollapse.className = "accordion-collapse collapse";
    accordionCollapse.setAttribute("aria-labelledby", `heading-${counter}`);
    accordionCollapse.setAttribute("data-bs-parent", `#accordion-${counter}`);

    var accordionBody = document.createElement("div");
    accordionBody.className = "accordion-body";
    accordionBody.innerHTML = `
        <strong>Start:</strong> ${start}<br>
        <strong>Ziel:</strong> ${destination}<br>
        <strong>Linie:</strong> ${line}<br>
        <strong>Abfahrt:</strong> ${startTime}<br>
        <strong>Ankunft:</strong> ${endTime}<br>
    `;

    parentDiv.appendChild(detailsButton);
    parentDiv.appendChild(accordionContainer);
    accordionContainer.appendChild(accordionItem);
    accordionItem.appendChild(accordionHeader);
    accordionHeader.appendChild(accordionButton);
    accordionItem.appendChild(accordionCollapse);
    accordionCollapse.appendChild(accordionBody);
}


$(function () {
    $("#fahrplan-suche").hide();
    $("#wechsel-fahrplan").on("click", () => {
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
        return d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    }

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
        if(kalender.val() != ""){
            when = kalender.val();
        }else{
            when = new Date().toISOString();
        }
        fetch(`https://v6.db.transport.rest/stops/${id}/departures?when=${when}&duration=10&results=10&linesOfStops=true&remarks=true&language=en`, requestOptions)
            .then(response => {
                response.json().then(result => {
                    let departuresList = result.departures;
                    // console.log(departuresList)
                    for (let i = 0; i < departuresList.length; i++) {
                        $('#fahrplan-ergebnis-liste').append(`
                                    <li class="list-group-item stop-list-item" data-trip-id="${departuresList[i].tripId}" > 
                                       ${departuresList[i].stop.name} nach ${departuresList[i].destination.name} 
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
                                    <li class="list-group-item stop-list-item" data-eva-id="${stopPlaces[i].id}" data-target-id="#${inputId}" data-target-value=" ${stopPlaces[i].name}" > 
                                       <i class="fa-solid fa-hotel" style="color: #afb4bb;">  </i>${stopPlaces[i].name} 
                                  </li>`);
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
                                    <li class="list-group-item fahrplan-list-item" data-eva-id="${stopPlaces[i].id}" data-target-id="#${inputId}" data-target-value=" ${stopPlaces[i].name}" > 
                                       <i class="fa-solid fa-hotel" style="color: #afb4bb;">  </i>${stopPlaces[i].name} 
                                  </li>`);


                    }
                    $(".fahrplan-list-item").on("click", function () {
                        fetchDepartures($(this).attr("data-eva-id"));
                    })
                })
            })
            .catch(error => console.log('error', error));
    });

    $("#station-tauschen").on("click", function (e) {
        let temp = $("#von-input").val();
        $("#von-input").val($("#nach-input").val());
        $("#nach-input").val(temp);
        e.preventDefault();
    });

    $("#suchen-button").on("click", function(e) {
        e.preventDefault();
        // let start = $("#von-input").attr("data-eva-id");
        // let dst = $("#nach-input").attr("data-eva-id");
        let start = "8010101";
        let dst = "8010366";

        // let dst_local = $("#nach-input").get();
        // console.log(start, dst)
        // .then(response => {
        //     console.log(response)
        // })

        const currentUnixTimestamp = getCurrentUnixTimestamp();

        if(start !== undefined && dst !== undefined) {
            var container = document.getElementById("result-items")

            document.body.style.height = document.getElementById("main-body").clientHeight + 100 + '%';
            document.body.style.backgroundColor = "white";



            fetch(`https://v6.db.transport.rest/journeys?from=${start}&departure=${currentUnixTimestamp}&to=${dst}&results=10`).then((response) => {
                // console.log(response);
                response.json().then((data) => {
                    // console.log(data);
                    let numDivs = data.journeys.length;

                    console.log(data.journeys[0].legs);
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


                        let parsed_start_time = format_time(start_time);
                        let parsed_end_time = format_time(arrival_time);


                        // let result_times = parsed_end_time - parsed_start_time;

                        let nach = all_data.legs[0].direction;
                        let gleis_von = all_data.legs[0].departurePlatform;
                        let gleis_ankunft_geplant = all_data.legs[0].plannedArrivalPlatform;
                        let gleis_ankunft_tatsächlich = all_data.legs[0].arrivalPlatform

                        let störungen = all_data.legs[0].remarks[1].type
                        // console.log(störungen)
                        // let störungen_message = "";

                        // if(störungen === "status") {

                        //     // störungen_message = all_data.legs[0].remarks[1].name
                        // } else {
                        //     störungen_message = "";
                        // }
                        
                        $("#result-items").append(`
                        <div class="accordion accordion-flush" id="${i}">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="flush-headingOne">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" id="row-item-clickable" data-bs-target="#flush-collapse-${i}" aria-expanded="false" aria-controls="flush-collapseOne">
                                    <div class="elements-listed">
                                        <p id="start-stop-time"><b>${parsed_start_time} - ${parsed_end_time}</b></p>
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
                                <span>nach ${nach} von Gleis ${gleis_von}</span>
                                
                                
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

                });
            });

        } else {
            var container = document.getElementById("result-items")
            var newError = document.createElement('strong');

            newError.innerHTML = "Fehler: Sie haben keinen Start- oder Zielpunkt festgelegt!";
            newError.style.textAlign="center";
            newError.style.color="red";
            container.appendChild(newError);
        }




        // var cell1 = table.insertRow(0);
        // cell1.innerHTML = "Test";
        // } else {
        //     console.log("Fehler")
        // }

    })
});