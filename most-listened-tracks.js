document.addEventListener("DOMContentLoaded", function() {
    let timeRange = document.querySelector("#time-range");

    timeRange.addEventListener("change", function() {
        if(this.value === "short_term") {
            getTopTracks("short_term");
        }
        if(this.value === "medium_term") {
            getTopTracks("medium_term");
        }
        if(this.value === "long_term") {
            getTopTracks("long_term");
        }
    });

    getTopTracks("short_term");
});

function getTopTracks(timeRange) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10`, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayTopTracks(data);
        }
    }
    xhr.send();
}

function displayTopTracks(data) {
    const topTracksContainer = document.getElementById("test");
    topTracksContainer.innerHTML = "";
    for (let i = 0; i < data.items.length; i++) {
        let html = "";
        html += `<a href="${data.items[i].uri}">
                    <div class="menu-loader">
                        <div class="menu-song">
                            <p class="menu-name">${data.items[i].name}</p>
                            <div class="menu-artist">
                                <p class="menu-artist">`;
        for (let k = 0; k < data.items[i].artists.length; k++) {
            html += `${data.items[i].artists[k].name}`;
            if (k < data.items[i].artists.length - 1) {
                html += `, `;
            }
        }
        html += `</p>
                </div>
            </div>
            <img class="menu-albumcover" alt="album-cover" src="${data.items[i].album.images[1].url}">
            <div class="menu-play"></div>
        </div>
    </a>`;
        topTracksContainer.innerHTML += html;
    }
}
