let previousTrackId = null;

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
            html += "<a href='" + data.item.uri + "'>";
            html += "<img id='albumImage' alt='album_cover' src='" + data.item.album.images[0].url+ "'>";
            html += "</a>";
            html += "<div class='currentlyPlayingInfo'>";
            html += "<a class='name' href='" + data.item.uri + "'>";
            html += "<h2 class='name'>" + data.item.name + "</h2>";
            html += "</a><br>";
            html += "<span class='artist'>";
            for (let i = 0; i < data.item.artists.length; i++) {
                html += "<a href='"+ data.item.artists[i].uri +"'>" + data.item.artists[i].name + "</a>";
                if (i < data.item.artists.length - 1) {
                    html += ", ";
                }
            }
            html += "</span>";
            html += "<br><br><br>";
            html += "<div id='progress_bar'>";
            html += "<span>" + Math.floor(data.progress_ms / 1000 / 60) + ":" + (Math.floor(data.progress_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.progress_ms / 1000 % 60) + " </span>";
            html += "<progress id='progress' value='" + data.progress_ms + "' max='" + data.item.duration_ms + "'></progress>";
            html += "<span> " + Math.floor(data.item.duration_ms / 1000 / 60) + ":" + (Math.floor(data.item.duration_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.item.duration_ms / 1000 % 60) + "</span>";
            html +="</div>";
            html += "</div>";
            html += "</div>";
            document.getElementById("Cplaying").innerHTML = html;
            const progressBar = document.getElementById("progress");
            progressBar.setAttribute("value", data.progress_ms);
            progressBar.setAttribute("max", data.item.duration_ms);
            // Création d'une instance de ColorThief
            const colorThief = new ColorThief();
            // Récupération de l'image à partir de son URL
            const imageUrl = data.item.album.images[0].url;
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imageUrl;
            // Attente du chargement complet de l'image
            img.addEventListener('load', function() {
                // Récupération de la couleur dominante
                const dominantColor = colorThief.getColor(img);
                const toHex = "#" + ((1 << 24) + (dominantColor[0] << 16) + (dominantColor[1] << 8) + dominantColor[2]).toString(16).slice(1);
                const bgColor = document.querySelector(".currentlyPlaying");
                const nameColor = document.querySelector(".name");
                const artistColor = document.querySelector(".artist a");
                bgColor.style.backgroundColor = toHex;
                if (dominantColor[0] < 50 && dominantColor[1] < 50 && dominantColor[2] < 50) {
                    bgColor.style.color = "white";
                    nameColor.style.color = "white";
                    artistColor.style.color = "white";
                } else {
                    bgColor.style.color = "black";
                    nameColor.style.color = "black";
                    artistColor.style.color = "black";
                }
            });

        } else {
            console.log("Erreur de chargement des données");
        }
    };
    xhr.send();
}

function getCurrentlyPlayingTime() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.spotify.com/v1/me/player/currently-playing");
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.onload = function() {
        let html = "";
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            html += "<span>" + Math.floor(data.progress_ms / 1000 / 60) + ":" + (Math.floor(data.progress_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.progress_ms / 1000 % 60) + " </span>";
            html += "<progress id='progress' value='" + data.progress_ms + "' max='" + data.item.duration_ms + "'></progress>";
            html += "<span> " + Math.floor(data.item.duration_ms / 1000 / 60) + ":" + (Math.floor(data.item.duration_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.item.duration_ms / 1000 % 60) + "</span>";
            document.getElementById("progress_bar").innerHTML = html;
            const progressBar = document.getElementById("progress");
            progressBar.setAttribute("value", data.progress_ms);
            progressBar.setAttribute("max", data.item.duration_ms);
            const currentTrackId = data.item.id;
            if (currentTrackId !== previousTrackId) {
                // La musique a changé, faire quelque chose
                previousTrackId = currentTrackId;
                getCurrentlyPlaying();
            }
        } else {
            console.log("Erreur de chargement des données");
        }
    };
    xhr.send();
}

// Appeler la fonction de mise à jour de la barre de progression toutes les secondes
getCurrentlyPlaying();
setInterval(getCurrentlyPlayingTime, 1000);