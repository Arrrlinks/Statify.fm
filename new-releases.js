const xhr1 = new XMLHttpRequest();
xhr1.open('GET', 'https://api.spotify.com/v1/me/following?type=artist&limit=50', true); // limite à 50 artistes par page
xhr1.setRequestHeader('Authorization', 'Bearer ' + access_token);
xhr1.setRequestHeader('Content-Type', 'application/json');

let artistIds = [];

xhr1.onreadystatechange = function () {
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
            // Tous les artistes ont été récupérés, on peut faire quelque chose avec la liste des IDs
            const latestReleases = [];

            artistIds.forEach(artistId => {
                const xhr2 = new XMLHttpRequest();

                xhr2.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            const data = JSON.parse(this.responseText);
                            if (data.items.length > 0) {
                                let latestRelease = data.items.reduce((latest, current) => {
                                    if (!latest.release_date || latest.release_date < current.release_date) {
                                        return current;
                                    } else {
                                        return latest;
                                    }
                                });
                                latestReleases.push(latestRelease);
                            }
                        } else {
                            console.error("Erreur lors de la récupération des dernières sorties de l'artiste avec l'ID", artistId);
                        }

                        if (latestReleases.length === artistIds.length - 1) {
                            // Toutes les sorties ont été récupérées, trier les sorties par date de sortie décroissante
                            latestReleases.sort().reverse();
                            latestReleases.sort((a, b) => (a.release_date < b.release_date) ? 1 : -1);
                            latestReleases.splice(10); // Ne garder que les 10 dernières sorties
                            for (let i = 0; i < latestReleases.length; i++) {
                                let html = "<a href='" + latestReleases[i].uri + "'><div class=\"menu-loader\">" +
                                    "<div class=\"menu-song\">" +
                                    "<p class='menu-name'>" + latestReleases[i].name + "</p>" +
                                    "<div class=\"menu-artist\">" +
                                    "<p class='menu-artist'>";
                                for (let k = 0; k < latestReleases[i].artists.length; k++) {
                                    html += latestReleases[i].artists[k].name;
                                    if (k < latestReleases[i].artists.length - 1) {
                                        html += ", ";
                                    }
                                }
                                html += "</div>" +
                                    "</div>" +
                                    "<img class=\"menu-albumcover\" src='" + latestReleases[i].images[1].url + "'>" +
                                    "<div class=\"menu-play\"></div>" +
                                    "</div></a>";
                                document.getElementById("newReleases").innerHTML += html;
                            }
                        }
                    }
                };
                xhr2.open("GET", `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&market=FR`);
                xhr2.setRequestHeader("Authorization", `Bearer ${access_token}`);
                xhr2.send();
            });
        }
    }
};
xhr1.send();