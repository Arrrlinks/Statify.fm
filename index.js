const client_id = '319eee2dc4eb4a9e8a957959d8e2d229';
//const redirect_uri = 'https://fmstatify.netlify.app/callback';
const redirect_uri = 'http://localhost:63342/Statify/callback.html';
const auth_endpoint = 'https://accounts.spotify.com/authorize';
const scopes = 'ugc-image-upload user-read-playback-state app-remote-control user-modify-playback-state playlist-read-private user-follow-modify playlist-read-collaborative user-follow-read user-read-currently-playing user-read-playback-position user-library-modify playlist-modify-private playlist-modify-public  user-read-email user-top-read streaming user-read-recently-played user-read-private user-library-read';

document.getElementById('auth-button').addEventListener('click', function() {
    window.location.href = auth_endpoint + '?response_type=token' +
        '&client_id=' + encodeURIComponent(client_id) +
        '&redirect_uri=' + encodeURIComponent(redirect_uri) +
        '&scope=' + encodeURIComponent(scopes);
});