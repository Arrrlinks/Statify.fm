const client_id = '319eee2dc4eb4a9e8a957959d8e2d229';
const redirect_uri = 'http://localhost:63342/Statify/callback.html';
const auth_endpoint = 'https://accounts.spotify.com/authorize';
const scopes = 'user-read-private user-read-email playlist-read-private';

document.getElementById('auth-button').addEventListener('click', function() {
    window.location.href = auth_endpoint + '?response_type=token' +
        '&client_id=' + encodeURIComponent(client_id) +
        '&redirect_uri=' + encodeURIComponent(redirect_uri) +
        '&scope=' + encodeURIComponent(scopes);
});