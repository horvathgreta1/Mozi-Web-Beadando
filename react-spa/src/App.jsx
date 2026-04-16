import { useState } from 'react'
import './App.css'

// --- KOMPONENS 1: AMŐBA (Tic-Tac-Toe) ---
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);


  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Vízszintes
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Függőleges
      [0, 4, 8], [2, 4, 6]             // Átlós
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const winner = calculateWinner(board);

  const handleClick = (index) => {
    if (board[index] || winner) return; 
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div>
      <h2>Amőba (Tic-Tac-Toe)</h2>
      <h3>{winner ? `A nyertes: ${winner} 🎉` : `Következik: ${xIsNext ? 'X' : 'O'}`}</h3>
      <div className="board">
        {board.map((cell, i) => (
          <div key={i} className="square" onClick={() => handleClick(i)}>{cell}</div>
        ))}
      </div>
      <button onClick={resetGame} style={{ marginTop: '20px', padding: '10px 20px' }}>Új játék</button>
    </div>
  );
}

// --- KOMPONENS 2: SZÁMOLÓGÉP (Calculator) ---
function Calculator() {
  const [calc, setCalc] = useState("");

  const updateCalc = value => {
    setCalc(calc + value);
  };

  const calculateResult = () => {
    try {

      setCalc(eval(calc).toString());
    } catch (error) {
      setCalc("Hiba");
    }
  };

  const clearCalc = () => {
    setCalc("");
  };

  return (
    <div>
      <h2>Számológép</h2>
      <div className="calculator">
        <div className="display">{calc || "0"}</div>
        <div className="keypad">
          <button onClick={() => updateCalc('7')}>7</button>
          <button onClick={() => updateCalc('8')}>8</button>
          <button onClick={() => updateCalc('9')}>9</button>
          <button className="operator" onClick={() => updateCalc('/')}>/</button>
          
          <button onClick={() => updateCalc('4')}>4</button>
          <button onClick={() => updateCalc('5')}>5</button>
          <button onClick={() => updateCalc('6')}>6</button>
          <button className="operator" onClick={() => updateCalc('*')}>*</button>
          
          <button onClick={() => updateCalc('1')}>1</button>
          <button onClick={() => updateCalc('2')}>2</button>
          <button onClick={() => updateCalc('3')}>3</button>
          <button className="operator" onClick={() => updateCalc('-')}>-</button>
          
          <button onClick={clearCalc} style={{backgroundColor: '#551111'}}>C</button>
          <button onClick={() => updateCalc('0')}>0</button>
          <button onClick={calculateResult} style={{backgroundColor: '#114411'}}>=</button>
          <button className="operator" onClick={() => updateCalc('+')}>+</button>
        </div>
      </div>
    </div>
  );
}

// --- FŐ ALKALMAZÁS (SPA Router) ---
function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'tictactoe', 'calculator'

  return (
    <div className="spa-container">
      <h1>Egyoldalas Alkalmazás (SPA)</h1>

      

      <a href="../../spa.html" style={{color: '#FFD700', textDecoration: 'none', display: 'block', marginBottom: '20px',}}>⬅️ Vissza a fő weboldalra</a><br></br>

      {/* Navigáció az SPA-n belül */}
      <div className="menu-buttons">
        <button onClick={() => setActiveTab('tictactoe')}>❌⭕ Amőba</button>
        <button onClick={() => setActiveTab('calculator')}>🖩 Számológép</button>
        {activeTab !== 'menu' && (
          <button onClick={() => setActiveTab('menu')} style={{backgroundColor: '#551111'}}>🏠 Vissza a játékmenübe</button>
        )}
      </div>

       {activeTab === 'menu' && <h2>Válassz egy játékot a fenti menüből!</h2>}
      {activeTab === 'tictactoe' && <TicTacToe />}
      {activeTab === 'calculator' && <Calculator />}

    </div>
  );
}

export default App;