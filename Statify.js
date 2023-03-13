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
            html += "<img id='albumImage' alt='album_cover' src='" + data.item.album.images[1].url+ "'>";
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
            html +="<span> / </span>"
            html += "<span> " + Math.floor(data.item.duration_ms / 1000 / 60) + ":" + (Math.floor(data.item.duration_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.item.duration_ms / 1000 % 60) + "</span><br>";
            html += "<div class=\"progress-bar\">" +
                "<div id=\"progress\" class=\"progress-bar-inner\" style='width: calc(100% *" + data.progress_ms/data.item.duration_ms + ")'>" +
                "  </div>" +
                "</div>";
            html +="</div>";
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
            img.addEventListener('load', function() {
                // Récupération de la couleur dominante
                const dominantColor = colorThief.getColor(img);
                document.querySelector(".currentlyPlaying").style.backgroundColor = "#" + ((1 << 24) + (dominantColor[0] << 16) + (dominantColor[1] << 8) + dominantColor[2]).toString(16).slice(1);
                const r = document.querySelector(':root')
                if (dominantColor[0] < 100 || dominantColor[1] < 100 || dominantColor[2] < 100) {
                    r.style.setProperty('--color', 'white');
                } else {
                    r.style.setProperty('--color', '#5E5E5E');
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
            html +="<span> / </span>"
            html += "<span> " + Math.floor(data.item.duration_ms / 1000 / 60) + ":" + (Math.floor(data.item.duration_ms / 1000 % 60) < 10 ? "0" : "") + Math.floor(data.item.duration_ms / 1000 % 60) + "</span><br>";
            html += "<div class=\"progress-bar\">" +
                "<div id=\"progress\" class=\"progress-bar-inner\" style='width: calc(100% *" + data.progress_ms/data.item.duration_ms + ")'>" +
                "</div>" +
                 "</div>";
            document.getElementById("progress_bar").innerHTML = html;
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


const xhr1 = new XMLHttpRequest();
xhr1.open('GET', 'https://api.spotify.com/v1/me/following?type=artist&limit=50', true);
xhr1.setRequestHeader('Authorization', 'Bearer ' + access_token);
xhr1.setRequestHeader('Content-Type', 'application/json');

let artistIds = [];

xhr1.onreadystatechange = function() {
    if (xhr1.readyState === 4 && xhr1.status === 200) {
        const data = JSON.parse(xhr1.responseText);

        artistIds = artistIds.concat(data.artists.items.map(artist => artist.id));

        // Vérifie s'il y a plus de pages à récupérer
        if (data.artists.next) {
            const nextUrl = data.artists.next.replace("https://api.spotify.com/v1", ""); // Enlève la partie de l'URL qui ne change pas
            xhr1.open('GET', `https://api.spotify.com/v1${nextUrl}`, true); // Récupère la page suivante
            xhr1.setRequestHeader('Authorization', 'Bearer ' + access_token);
            xhr1.setRequestHeader('Content-Type', 'application/json');
            xhr1.send();
        } else {
            // Fonction qui récupère le dernier album/ep/single sorti pour un artiste
            function getLatestRelease(artistId) {
                const xhr2 = new XMLHttpRequest();
                xhr2.open('GET', `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&market=FR`, true);
                xhr2.setRequestHeader('Authorization', 'Bearer ' + access_token);
                xhr2.setRequestHeader('Content-Type', 'application/json');
                xhr2.onreadystatechange = function() {
                    if (xhr2.readyState === 4 && xhr2.status === 200) {
                        const data = JSON.parse(xhr2.responseText);
                        if (data.items.length > 0) {
                            const latestRelease = data.items.reduce((latest, current) => {
                                if (!latest.release_date || latest.release_date < current.release_date) {
                                    return current;
                                } else {
                                    return latest;
                                }
                            });
                            function sortByDate(names) {
                                // Trie la liste de noms en fonction de leur date (du plus récent au plus ancien)
                                names.sort(function(a, b) {
                                    // Convertit les dates de chaînes de caractères en objets Date
                                    const dateA = new Date(a[0]);
                                    const dateB = new Date(b[0]);

                                    // Compare les dates et retourne le résultat du tri
                                    if (dateA > dateB) {
                                        return -1;
                                    } else if (dateA < dateB) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                });

                                // Retourne la liste de noms triée
                                return names;
                            }
                            const names = [  ['2022-10-01', 'Album A'],
                                ['2023-01-15', 'Album B'],
                                ['2023-02-28', 'Album C'],
                                ['2022-11-23', 'Album D'],
                            ];
                            console.log(names);
                            const sortedNames = sortByDate(names);
                            console.log(sortedNames);

                        }
                    }

                };
                xhr2.send();
            }

            // Récupère les 10 derniers albums/ep/singles sortis pour chaque artiste
            for (let i = 0; i < artistIds.length; i++) {
                getLatestRelease(artistIds[i]);
            }
        }
    }
};
xhr1.send();

