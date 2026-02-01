const table = document.getElementById("songTable");
const searchInput = document.getElementById("searchInput");
const artistSelect = document.getElementById("artistSelect");

let songs = [];

const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTjsN_4lIaiWM42Eg_nnZjQQSkzhrfqypd98ybfyZclxeoaMHZeOIzAXnNT2B-0-0eVkkpJl1JMrDJ/pub?gid=0&single=true&output=csv";



// ===== โหลดข้อมูลจาก Google Sheet =====
fetch(SHEET_CSV_URL)
    .then(res => res.text())
    .then(text => {
        const rows = text.trim().split("\n").slice(1);

        songs = rows.map(row => {
            const [no, title, artist] = row.split(",");
            return { no, title, artist };
        });

        setupArtists();
        renderSongs(songs);
    });

// ===== dropdown ศิลปิน =====
function setupArtists() {
    const artists = [...new Set(songs.map(s => s.artist))];

    artists.forEach(artist => {
        const option = document.createElement("option");
        option.value = artist;
        option.textContent = artist;
        artistSelect.appendChild(option);
    });
}

// ===== แสดงเพลง =====
function renderSongs(list) {
    table.innerHTML = "";
    list.forEach(song => {
        table.innerHTML += `
            <tr>
                <td class="no">${song.no}</td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
            </tr>
        `;
    });
}

// ===== กรองเพลง =====
function filterSongs() {
    const keyword = searchInput.value.toLowerCase();
    const selectedArtist = artistSelect.value;

    const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(keyword) &&
        (selectedArtist === "" || song.artist === selectedArtist)
    );

    renderSongs(filtered);
}

searchInput.addEventListener("keyup", filterSongs);
artistSelect.addEventListener("change", filterSongs);