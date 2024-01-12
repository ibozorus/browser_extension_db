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


});

$("#suchen-button").on("click", function (e) {
    // e.preventDefault();
    let start = $("#von-input").val();
    let dst = $("#nach-input").val();

    console.log(start, dst)
})