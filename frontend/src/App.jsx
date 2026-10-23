import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Jogadores } from './pages/Jogadores';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogadores" element={<Jogadores />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;