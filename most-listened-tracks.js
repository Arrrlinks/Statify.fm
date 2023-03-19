const xhr3 = new XMLHttpRequest();
xhr3.open("GET", "https://api.spotify.com/v1/me/top/tracks?limit=10", true);
xhr3.setRequestHeader('Authorization', 'Bearer ' + access_token);
xhr3.setRequestHeader('Content-Type', 'application/json');

let timeRange = document.querySelector("#time-range");

timeRange.addEventListener("change", function () {
    const selectedOption = this.options[timeRange.selectedIndex];
    if (this.value === "short_term") {
        console.log("short_term");
    }
    if (this.value === "medium_term") {
        console.log("medium_term");
    }
    if (this.value === "long_term") {
        console.log("long_term");
    }
});

xhr3.onreadystatechange = function () {
    const data = JSON.parse(xhr3.responseText);
    for (let i = 0; i < data.items.length; i++) {
        let html = "<a href='" + data.items[i].uri + "'><div class=\"menu-loader\">"
        html += "<div class=\"menu-song\">"
        html += "<p class='menu-name'>" + data.items[i].name + "</p>"
        html += "<div class=\"menu-artist\">"
        html += "<p class='menu-artist'>"
        for (let k = 0; k < data.items[i].artists.length; k++) {
            html += data.items[i].artists[k].name;
            if (k < data.items[i].artists.length - 1) {
                html += ", ";
            }
        }
        html += "</div>"
        html += "</div>"
        html += "<img class=\"menu-albumcover\" src='" + data.items[i].album.images[1].url + "'>"
        html += "<div class=\"menu-play\"></div>"
        html += "</div></a>"
        document.getElementById("mostListenedTracks").innerHTML += html;
    }
}
xhr3.send();