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
    xhr.onload = function() {
        let html = "";
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            html += "<div class='currentlyPlaying'>";
            html += "<img alt='album_cover' src='" + data.item.album.images[0].url+ "'>";
            html += "<div class='currentlyPlayingInfo'>";
            html += "<h2>" + data.item.name + "</h2>";
            for (let i = 0; i < data.item.artists.length; i++) {
                html += "<span>" + data.item.artists[i].name + "</span>";
                if (i < data.item.artists.length - 1) {
                    html += ", ";
                }
            }
            html += "<br>";
            html += "<br>";
            html += "<span>" + Math.floor(data.progress_ms / 1000 / 60) + ":" + (Math.floor(data.progress_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.progress_ms / 1000 % 60) + " </span>";
            html += "<progress id='progress' value='" + data.progress_ms + "' max='" + data.item.duration_ms + "'></progress>";
            html += "<span> " + Math.floor(data.item.duration_ms / 1000 / 60) + ":" + (Math.floor(data.item.duration_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.item.duration_ms / 1000 % 60) + "</span>";
            html += "</div>";
            html += "</div>";
            document.getElementById("Cplaying").innerHTML = html;
            const progressBar = document.getElementById("progress");
            progressBar.setAttribute("value", data.progress_ms);
            progressBar.setAttribute("max", data.item.duration_ms);
        } else {
            console.log("Erreur de chargement des données");
        }
    };
    xhr.send();
}

// Appeler la fonction de mise à jour de la barre de progression toutes les secondes
getCurrentlyPlaying();
setInterval(getCurrentlyPlaying, 1000);