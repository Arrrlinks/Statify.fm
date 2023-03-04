// Récupérer le jeton d'accès à partir de l'URL
const hashParams = {};
let e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
}
const access_token = hashParams.access_token;

// Utiliser le jeton d'accès pour récupérer les playlists de l'utilisateur
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.spotify.com/v1/me/playlists");
xhr.setRequestHeader("Authorization", "Bearer " + access_token);
xhr.onload = function() {
    if (xhr.status === 200) {
        const playlists = JSON.parse(xhr.responseText).items;
        let html = "";
        for (let i = 0; i < playlists.length; i++) {
            html += "<p>" + playlists[i].name + "</p>";
        }
        document.getElementById("playlists").innerHTML = html;
    } else {
        console.log("Erreur de chargement des playlists");
    }
};
xhr.send();