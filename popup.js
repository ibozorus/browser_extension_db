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

    function fetchStations(station) {
        fetch(`https://apis.deutschebahn.com/db-api-marketplace/apis/ris-stations/v1/stop-places/by-name/${station}?limit=20`, requestOptions)
            .then(response => {
                response.json().then(result => {
                    let stopPlaces = result.stopPlaces;
                    for (let i = 0; i < stopPlaces.length; i++) {
                        // console.log(stopPlaces[i]);
                        // console.log(stopPlaces[i].names.DE.nameLong);
                        $('#von-liste').append(`<li> 
                                       <i class="fa-solid fa-hotel" style="color: #afb4bb;"></i>${stopPlaces[i].names.DE.nameLong} 
                                  </li>`)
                    }
                })
            })
            .catch(error => console.log('error', error));
    }

    $('#von-input-modal').on("input", function fetchStations() {
        $('#von-liste').empty();
        let station = $(this).val();
        if (station == null || station === "") {
            return;
        }
        fetch(`https://apis.deutschebahn.com/db-api-marketplace/apis/ris-stations/v1/stop-places/by-name/${station}?limit=20`, requestOptions)
            .then(response => {
                response.json().then(result => {
                    let stopPlaces = result.stopPlaces;
                    for (let i = 0; i < stopPlaces.length; i++) {
                        $('#von-liste').append(`
                                    <li class="list-group-item"> 
                                       <i class="fa-solid fa-hotel" style="color: #afb4bb;">  </i>${stopPlaces[i].names.DE.nameLong} 
                                  </li>`)
                    }
                })
            })
            .catch(error => console.log('error', error));
    })


});