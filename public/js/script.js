var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

if (btn == null) {
    console.log("btn is null");
}

else {
    btn.onclick = function () {
        modal.style.display = "block";
    }
}

if (span == null) {
    console.log("span is null");
}
else {
    span.onclick = function () {
        modal.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
