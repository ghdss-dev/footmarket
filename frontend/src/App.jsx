import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Jogadores } from './pages/Jogadores';
import { Clubes } from './pages/Clubes';
import { DetalheClube } from './pages/DetalheClube';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogadores" element={<Jogadores />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/clubes/:id" element={<DetalheClube />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;