import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Clubes() {
  const [clubes, setClubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Estados do formulário de novo clube
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [caixa, setCaixa] = useState('');
  const [formacao, setFormacao] = useState('1-2-1');

  // Carrega a lista de clubes da API
  const carregarClubes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clubs');
      setClubes(response.data);
      setErro(null);
    } catch (err) {
      console.error('Erro ao carregar clubes:', err);
      setErro('Não foi possível carregar a lista de clubes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClubes();
  }, []);

  // Handler para criar um novo clube
  const handleCriarClube = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clubs', {
        nome,
        sigla,
        caixa: parseFloat(caixa),
        formacao,
      });

      // Limpa os campos e recarrega a lista
      setNome('');
      setSigla('');
      setCaixa('');
      setFormacao('1-2-1');
      carregarClubes();
    } catch (err) {
      console.error('Erro ao cadastrar clube:', err);
      alert('Erro ao cadastrar clube. Verifica os dados enviados.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Gestão de Clubes</h1>

      {/* Formulário de Cadastro */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Cadastrar Novo Clube</h2>
        <form onSubmit={handleCriarClube} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Nome do Clube"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sigla (ex: NAU)"
            value={sigla}
            onChange={(e) => setSigla(e.target.value)}
            maxLength={3}
            required
          />
          <input
            type="number"
            placeholder="Caixa Inicial (R$)"
            value={caixa}
            onChange={(e) => setCaixa(e.target.value)}
            required
          />
          <select value={formacao} onChange={(e) => setFormacao(e.target.value)}>
            <option value="1-2-1">1-2-1</option>
            <option value="2-2">2-2</option>
          </select>
          <button type="submit">Cadastrar</button>
        </form>
      </section>

      {/* Tabela de Exibição */}
      <section>
        <h2>Clubes Cadastrados</h2>
        {loading && <p>A carregar clubes...</p>}
        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        {!loading && !erro && clubes.length === 0 && (
          <p>Nenhum clube cadastrado até ao momento.</p>
        )}

        {!loading && clubes.length > 0 && (
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>ID</th>
                <th>Nome</th>
                <th>Sigla</th>
                <th>Caixa (R$)</th>
                <th>Formação</th>
              </tr>
            </thead>
            <tbody>
              {clubes.map((clube) => (
                <tr key={clube.id}>
                  <td>{clube.id}</td>
                  <td>{clube.nome}</td>
                  <td>{clube.sigla}</td>
                  <td>
                    {clube.caixa?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>{clube.formacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}