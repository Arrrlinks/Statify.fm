// Initialiser l'authentification
const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = '319eee2dc4eb4a9e8a957959d8e2d229';
const redirectUri = 'http://localhost:3000/callback';
const scopes = ['user-read-currently-playing'];

// Rediriger l'utilisateur vers la page d'authentification Spotify
window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;

// Fonction pour récupérer les paramètres de l'URL
function getParamsFromUrl() {
    const params = {};
    const queryString = window.location.hash.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while ((m = regex.exec(queryString))) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}

// Fonction pour récupérer la musique actuellement écoutée par l'utilisateur
function getCurrentlyPlayingTrack(accessToken) {
    return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
        .then(response => response.json())
        .then(data => {
            return {
                name: data.item.name,
                artist: data.item.artists[0].name,
                album: data.item.album.name
            };
        });
}

// Récupérer les paramètres de l'URL après la redirection d'authentification
const params = getParamsFromUrl();

// Si l'utilisateur est authentifié, récupérer la musique actuellement écoutée
if (params.access_token) {
    getCurrentlyPlayingTrack(params.access_token)
        .then(track => console.log(`Vous écoutez actuellement "${track.name}" de ${track.artist} (album: ${track.album})`))
        .catch(error => console.error(error));
}