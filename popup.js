$(function () {
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


    $("#zort").flatpickr({
        enableTime: true,
        inline: true,
        dateFormat: "d.m.Y H:i",
        locale: "de"
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

    ;(function () {
        const htmlElement = document.querySelector("html")
        if(htmlElement.getAttribute("data-bs-theme") === 'auto') {
            function updateTheme() {
                document.querySelector("html").setAttribute("data-bs-theme",
                    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            }

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
            updateTheme()
        }
    })()

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

                        $(".stop-list-item").on("click", function () {
                            setStopValue($(this).attr('data-target-id'), $(this).attr('data-target-value'), $(this).attr('data-eva-id'))
                        })
                    }
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

    $("#theme-switch-button").on("click", function () {
        console.log('click');
        var currentLocalTheme = window.localStorage.getItem('data-theme');

        if (currentLocalTheme === 'light') {
            changeToDarkMode();
        } else {
            changeToLightMode()
        }
    });
});

$("#suchen-button").on("click", function(e) {
    // e.preventDefault();
    let start = $("#von-input").val();
    let dst = $("#nach-input").val();

    console.log(start, dst)
})