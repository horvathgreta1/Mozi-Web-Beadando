import { useState } from 'react';
import './App.css';

// Kezdeti adatok a film.txt alapján
const kezdetiFilmek = [
  { id: 1, cim: 'Csókolj meg, édes!', ev: 1932, hossz: 67 },
  { id: 2, cim: 'Repülő arany', ev: 1932, hossz: 48 },
  { id: 3, cim: 'Piri mindent tud', ev: 1932, hossz: 92 },
  { id: 4, cim: 'Az ellopott szerda', ev: 1933, hossz: 72 },
  { id: 5, cim: 'Mindent a nőért', ev: 1933, hossz: 57 },
  { id: 6, cim: 'Rákóczi induló', ev: 1933, hossz: 84 },
  { id: 7, cim: 'Kísértetek vonata', ev: 1933, hossz: 76 },
  { id: 8, cim: 'Ida regénye', ev: 1934, hossz: 90 },
  { id: 9, cim: 'Meseautó', ev: 1934, hossz: 95 },
  { id: 10, cim: 'Lila akác', ev: 1934, hossz: 86 }
];

function App() {
  const [filmek, setFilmek] = useState(kezdetiFilmek);
  const [urlapAdat, setUrlapAdat] = useState({ id: '', cim: '', ev: '', hossz: '' });
  const [szerkesztesMod, setSzerkesztesMod] = useState(false);

  // Űrlap mezők kezelése
  const handleChange = (e) => {
    setUrlapAdat({ ...urlapAdat, [e.target.name]: e.target.value });
  };

  // Mentés (Create vagy Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlapAdat.cim || !urlapAdat.ev || !urlapAdat.hossz) {
      alert("Kérlek tölts ki minden mezőt!");
      return;
    }

    if (szerkesztesMod) {
      // UPDATE
      setFilmek(filmek.map(film => film.id === urlapAdat.id ? { ...urlapAdat, ev: parseInt(urlapAdat.ev), hossz: parseInt(urlapAdat.hossz) } : film));
      setSzerkesztesMod(false);
    } else {
      // CREATE
      const ujId = filmek.length > 0 ? Math.max(...filmek.map(f => f.id)) + 1 : 1;
      setFilmek([...filmek, { ...urlapAdat, id: ujId, ev: parseInt(urlapAdat.ev), hossz: parseInt(urlapAdat.hossz) }]);
    }
    setUrlapAdat({ id: '', cim: '', ev: '', hossz: '' }); // Űrlap ürítése
  };

  // Szerkesztés előkészítése
  const handleEdit = (film) => {
    setUrlapAdat(film);
    setSzerkesztesMod(true);
  };

  // Törlés (Delete)
  const handleDelete = (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a filmet?")) {
      setFilmek(filmek.filter(film => film.id !== id));
    }
  };

  return (
    <div className="react-container">
      <h2>Filmek (React CRUD)</h2>
      {/* Ez a link visz vissza a sima HTML menünkbe! */}
      <a href="../react.html" style={{ color: '#FFD700', textDecoration: 'none', display: 'inline-block', fontSize: '18px', margin: '10px 0' }}>⬅️ Vissza a menübe</a><br></br><br></br>
      
      <div className="form-container">
        <h3 style={{width: '100%'}}>{szerkesztesMod ? "Film módosítása" : "Új film hozzáadása"}</h3>
        <input type="text" name="cim" placeholder="Film címe" value={urlapAdat.cim} onChange={handleChange} />
        <input type="number" name="ev" placeholder="Kiadás éve" value={urlapAdat.ev} onChange={handleChange} />
        <input type="number" name="hossz" placeholder="Hossz (perc)" value={urlapAdat.hossz} onChange={handleChange} />
        <button onClick={handleSubmit}>💾 Mentés</button>
        {szerkesztesMod && <button onClick={() => { setSzerkesztesMod(false); setUrlapAdat({ id: '', cim: '', ev: '', hossz: '' }); }}>❌ Mégse</button>}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Cím</th><th>Év</th><th>Hossz (perc)</th><th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {filmek.map((film) => (
            <tr key={film.id}>
              <td>{film.id}</td><td>{film.cim}</td><td>{film.ev}</td><td>{film.hossz}</td>
              <td>
                <button onClick={() => handleEdit(film)}>✏️ Szerkesztés</button>
                <button className="btn-delete" onClick={() => handleDelete(film.id)}>🗑️ Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;