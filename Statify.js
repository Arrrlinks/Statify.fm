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
xhr.open("GET", "https://api.spotify.com/v1/me/player/currently-playing");
xhr.setRequestHeader("Authorization", "Bearer " + access_token);
xhr.onload = function() {
    let html = "";
    if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText).items;
        html+= "<div>"
        html+= "<img alt='music_cover' src=" + data.item.images[0].url + ">";
        html+= "<p>" + data.item.name + "</p>";
        html+= "</div>"
        document.getElementById("Cplaying").innerHTML = html;
    } else {
        console.log("Erreur de chargement des données");
    }
};
xhr.send();