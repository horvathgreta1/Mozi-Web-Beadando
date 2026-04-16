import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Az API végpontunk (a PHP tolmács) címe a XAMPP szerveren
const API_URL = '../api.php';

function App() {
  const [filmek, setFilmek] = useState([]);
  const [urlapAdat, setUrlapAdat] = useState({ id: '', cim: '', ev: '', hossz: '' });
  const [szerkesztesMod, setSzerkesztesMod] = useState(false);

  const adatokBetoltese = async () => {
    try {
      const response = await axios.get(API_URL);
      setFilmek(response.data);
    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error);
    }
  };

  useEffect(() => {
    adatokBetoltese();
  }, []);

  // Űrlap mezők kezelése
  const handleChange = (e) => {
    setUrlapAdat({ ...urlapAdat, [e.target.name]: e.target.value });
  };

  // 2. CREATE & UPDATE: Mentés gomb
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urlapAdat.cim || !urlapAdat.ev || !urlapAdat.hossz) {
      alert("Kérlek tölts ki minden mezőt!");
      return;
    }

    const kuldendoAdat = {
      cim: urlapAdat.cim,
      ev: parseInt(urlapAdat.ev),
      hossz: parseInt(urlapAdat.hossz)
    };

    try {
      if (szerkesztesMod) {
  
        kuldendoAdat.id = urlapAdat.id;
        await axios.put(API_URL, kuldendoAdat);
      } else {
        await axios.post(API_URL, kuldendoAdat);
      }
      
      adatokBetoltese();
      setSzerkesztesMod(false);
      setUrlapAdat({ id: '', cim: '', ev: '', hossz: '' });
    } catch (error) {
      console.error("Hiba a mentéskor:", error);
    }
  };


  const handleEdit = (film) => {
    setUrlapAdat(film);
    setSzerkesztesMod(true);
  };

  // 3. DELETE: Törlés
  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a filmet az adatbázisból?")) {
      try {
        await axios.delete(API_URL, { data: { id: id } });
        adatokBetoltese(); // Lista frissítése
      } catch (error) {
        console.error("Hiba a törléskor:", error);
      }
    }
  };

  return (
    <div className="react-container">
      <h2>Filmek (React + Axios + MySQL)</h2>
      <a href="../../axios.html" style={{color: '#FFD700', textDecoration: 'none'}}>⬅️ Vissza a weboldalra</a><br></br><br></br>
     
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
          {filmek.length > 0 ? (
            filmek.map((film) => (
              <tr key={film.id}>
                <td>{film.id}</td><td>{film.cim}</td><td>{film.ev}</td><td>{film.hossz}</td>
                <td>
                  <button onClick={() => handleEdit(film)}>✏️ Szerkesztés</button>
                  <button className="btn-delete" onClick={() => handleDelete(film.id)}>🗑️ Törlés</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{textAlign: 'center'}}>Adatok betöltése folyamatban... (Vagy az adatbázis üres)</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;