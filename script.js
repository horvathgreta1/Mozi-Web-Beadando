// 1. A nyers adatbázisod (film.txt alapján, az első kb. 15 filmmel
const nyersFilmAdatok = `1	Csókolj meg, édes!	1932	67
2	Repülő arany	1932	48
3	Piri mindent tud	1932	92
4	Az ellopott szerda	1933	72
5	Mindent a nőért	1933	57
6	Emmy	1934	83
7	Szerelmi álmok	1935	66
8	A titokzatos idegen	1936	59
9	Havi 200 fix	1936	86
10	Szerelemből nősültem	1937	67`;

let filmekTomb = [];

function adatokBeolvasasa() {
    const sorok = nyersFilmAdatok.split('\n');
    for (let sor of sorok) {
        if (sor.trim() !== '') {
            const adatok = sor.split('\t'); 
            filmekTomb.push({
                id: parseInt(adatok[0]),
                cim: adatok[1],
                ev: parseInt(adatok[2]),
                hossz: parseInt(adatok[3])
            });
        }
    }
}

function tablaKirajzolasa() {
    const tbody = document.getElementById('film-tabla-body');
    tbody.innerHTML = ''; 

    for (let film of filmekTomb) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${film.id}</td>
            <td>${film.cim}</td>
            <td>${film.ev}</td>
            <td>${film.hossz}</td>
            <td>
                <button onclick="szerkesztesBetoltese(${film.id})">✏️ Szerkesztés</button>
                <button class="btn-delete" onclick="torles(${film.id})">🗑️ Törlés</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// 4. CREATE & UPDATE
function mentes() {
    const idInput = document.getElementById('film-id').value;
    const cim = document.getElementById('film-cim').value;
    const ev = parseInt(document.getElementById('film-ev').value);
    const hossz = parseInt(document.getElementById('film-hossz').value);

    if (cim === '' || isNaN(ev) || isNaN(hossz)) {
        alert("Kérlek tölts ki minden mezőt helyesen!");
        return;
    }

    if (idInput === '') {

        let maxId = 0;
        for (let f of filmekTomb) {
            if (f.id > maxId) maxId = f.id;
        }
        
        filmekTomb.push({ id: maxId + 1, cim: cim, ev: ev, hossz: hossz });
    } else {
        const id = parseInt(idInput);
        const index = filmekTomb.findIndex(f => f.id === id);
        if (index !== -1) {
            filmekTomb[index].cim = cim;
            filmekTomb[index].ev = ev;
            filmekTomb[index].hossz = hossz;
        }
    }

    urlapTorles();
    tablaKirajzolasa();
}

function szerkesztesBetoltese(id) {
    const film = filmekTomb.find(f => f.id === id);
    if (film) {
        document.getElementById('form-title').innerText = "Film módosítása";
        document.getElementById('film-id').value = film.id;
        document.getElementById('film-cim').value = film.cim;
        document.getElementById('film-ev').value = film.ev;
        document.getElementById('film-hossz').value = film.hossz;
    }
}
function torles(id) {
    if (confirm("Biztosan törölni szeretnéd ezt a filmet?")) {
        filmekTomb = filmekTomb.filter(f => f.id !== id);
        tablaKirajzolasa();
    }
}

function urlapTorles() {
    document.getElementById('form-title').innerText = "Új film hozzáadása";
    document.getElementById('film-id').value = '';
    document.getElementById('film-cim').value = '';
    document.getElementById('film-ev').value = '';
    document.getElementById('film-hossz').value = '';
}

// PROGRAM INDÍTÁSA
window.onload = function() {
    adatokBeolvasasa();
    tablaKirajzolasa();
};
