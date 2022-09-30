
//let trailerPlayBtn = $(".trailer-play-btn");


//trailerPlayBtn.on("click", function () {
//    $("#modal-background").attr("hidden", false);
//    console.log("yolo")
//})

$(document).ready(function () {

    //Variables -- START
    let modalBackground = $("#modal-background");
    let hideModal = $("#hide-modal");
    
    //Variables -- STOP

    //Events -- START
    //Modal -- START
    modalBackground.on("click", function () {
        $("#modal-background").attr("hidden", true);
    })

    hideModal.on("click", function () {
        $("#modal-background").attr("hidden", true);
    })
    //Modal -- STOP
})

