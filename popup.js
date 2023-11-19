$(function () {
    $("#datepicker").datepicker();

    var clientId = "2af844b40b41cd154f776bb1eb1fb6e4";
    var clientKey = "d7c2bbe3ffe6eccff03fcbb25dbc6d41";

    var myHeaders = new Headers();
    myHeaders.append("DB-Client-Id", clientId);
    myHeaders.append("DB-Api-Key", clientKey);
    myHeaders.append("Accept", "application/vnd.de.db.ris+json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const setStopValue = (id, value) => {
        $(id).val(value);
        $('.modal').modal('hide');
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
        fetch(`https://apis.deutschebahn.com/db-api-marketplace/apis/ris-stations/v1/stop-places/by-name/${station}?limit=20`, requestOptions)
            .then(response => {
                response.json().then(result => {
                    let stopPlaces = result.stopPlaces;
                    for (let i = 0; i < stopPlaces.length; i++) {
                        $('#' + listId).append(`
                                    <li class="list-group-item stop-list-item" data-target-id="#${inputId}" data-target-value=" ${stopPlaces[i].names.DE.nameLong}" > 
                                       <i class="fa-solid fa-hotel" style="color: #afb4bb;">  </i>${stopPlaces[i].names.DE.nameLong} 
                                  </li>`);

                        $(".stop-list-item").on("click", function () {
                            setStopValue($(this).attr('data-target-id'), $(this).attr('data-target-value'))
                        })
                    }
                })
            })
            .catch(error => console.log('error', error));
    });


});