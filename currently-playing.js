let previousTrackId = null;
let latestRelease = null;
// Récupérer le jeton d'accès à partir de l'URL
const hashParams = {};
let e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
}
const access_token = hashParams.access_token;

// Utiliser le jeton d'accès pour récupérer les informations sur la musique en cours de lecture
function getCurrentlyPlaying() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.spotify.com/v1/me/player/currently-playing");
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.onload = function () {
        let html = "";
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            html += "<div class='currentlyPlaying'>";
            html += "<a href='" + data.item.uri + "'>";
            html += "<img id='albumImage' alt='album_cover' src='" + data.item.album.images[1].url + "'>";
            html += "</a>";
            html += "<div class='currentlyPlayingInfo'>";
            html += "<a class='name' href='" + data.item.uri + "'>";
            html += "<h2 class='name'>" + data.item.name + "</h2>";
            html += "</a><br>";
            html += "<span class='artist'>";
            for (let i = 0; i < data.item.artists.length; i++) {
                html += "<a href='" + data.item.artists[i].uri + "'>" + data.item.artists[i].name + "</a>";
                if (i < data.item.artists.length - 1) {
                    html += ", ";
                }
            }
            html += "</span>";
            html += "<br><br><br>";
            html += "<div id='progress_bar'>";
            html += "<span>" + Math.floor(data.progress_ms / 1000 / 60) + ":" + (Math.floor(data.progress_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.progress_ms / 1000 % 60) + " </span>";
            html += "<span> / </span>"
            html += "<span> " + Math.floor(data.item.duration_ms / 1000 / 60) + ":" + (Math.floor(data.item.duration_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.item.duration_ms / 1000 % 60) + "</span><br>";
            html += "<div class=\"progress-bar\">" +
                "<div id=\"progress\" class=\"progress-bar-inner\" style='width: calc(100% *" + data.progress_ms / data.item.duration_ms + ")'>" +
                "  </div>" +
                "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            document.getElementById("Cplaying").innerHTML = html;
            // Création d'une instance de ColorThief
            const colorThief = new ColorThief();
            // Récupération de l'image à partir de son URL
            const imageUrl = data.item.album.images[0].url;
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imageUrl;
            // Attente du chargement complet de l'image
            img.addEventListener('load', function () {
                // Récupération de la couleur dominante
                const dominantColor = colorThief.getColor(img);
                document.querySelector(".currentlyPlaying").style.backgroundColor = "#" + ((1 << 24) + (dominantColor[0] << 16) + (dominantColor[1] << 8) + dominantColor[2]).toString(16).slice(1);
                const r = document.querySelector(':root')
                if (dominantColor[0] < 110 || dominantColor[1] < 110 || dominantColor[2] < 110) {
                    r.style.setProperty('--color', 'white');
                } else {
                    r.style.setProperty('--color', '#5E5E5E');
                }
            });

        } else {
            console.log("Impossible de récupérer les informations sur la musique en cours de lecture.");
        }
    };
    xhr.send();
}

function getCurrentlyPlayingTime() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.spotify.com/v1/me/player/currently-playing");
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.onload = function () {
        let html = "";
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            html += "<span>" + Math.floor(data.progress_ms / 1000 / 60) + ":" + (Math.floor(data.progress_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.progress_ms / 1000 % 60) + " </span>";
            html += "<span> / </span>"
            html += "<span> " + Math.floor(data.item.duration_ms / 1000 / 60) + ":" + (Math.floor(data.item.duration_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.item.duration_ms / 1000 % 60) + "</span><br>";
            html += "<div class=\"progress-bar\">" +
                "<div id=\"progress\" class=\"progress-bar-inner\" style='width: calc(100% *" + data.progress_ms / data.item.duration_ms + ")'>" +
                "</div>" +
                "</div>";
            document.getElementById("progress_bar").innerHTML = html;
            const currentTrackId = data.item.id;
            if (currentTrackId !== previousTrackId) {
                // La musique a changé, faire quelque chose
                previousTrackId = currentTrackId;
                getCurrentlyPlaying();
            }
        }
    };
    xhr.send();
}

// Appeler la fonction de mise à jour de la barre de progression toutes les secondes
getCurrentlyPlaying();
setInterval(getCurrentlyPlayingTime, 1000);