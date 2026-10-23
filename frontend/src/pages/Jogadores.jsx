import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Jogadores() {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const carregarJogadores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/players');
      setJogadores(response.data);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarJogadores();
  }, []);

  const jogadoresFiltrados = jogadores.filter(j => 
    j.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar Lateral Esquerda */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>P</div>
          <div>
            <strong style={{ fontSize: '16px' }}>Passe</strong>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Gestão da liga</div>
          </div>
        </div>

        <nav style={styles.menu}>
          <div style={styles.menuGroup}>MERCADO</div>
          <a style={{ ...styles.menuItem, ...styles.menuActive }}>👤 Jogadores <span style={styles.badge}>23</span></a>
          <a style={styles.menuItem}>🛡️ Clubes <span style={styles.badge}>6</span></a>

          <div style={styles.menuGroup}>LIGA</div>
          <a style={styles.menuItem}>⚽ Partidas <span style={styles.badge}>2</span></a>
          <a style={styles.menuItem}>📊 Classificação</a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '32px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', margin: 0 }}>Jogadores</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
              Cadastre jogadores, acompanhe os indicadores e compre os que estão livres.
            </p>
          </div>
          <button style={styles.btnNovo}>+ Novo jogador</button>
        </header>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.inputSearch}
          />
        </div>

        {/* Tabela de Jogadores */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={{ padding: '20px', textAlign: 'center' }}>Carregando jogadores da API...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px' }}>Jogador</th>
                  <th>Posição</th>
                  <th>Overall</th>
                  <th>Agilidade</th>
                  <th>Idade</th>
                  <th>Condição</th>
                  <th>Valor base</th>
                  <th>Valor de mercado</th>
                  <th>Clube</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {jogadoresFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                      Nenhum jogador encontrado na base do banco de dados.
                    </td>
                  </tr>
                ) : (
                  jogadoresFiltrados.map((j) => (
                    <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{j.nome}</td>
                      <td><span style={styles.posBadge}>{j.posicao}</span></td>
                      <td><b>{j.overall}</b></td>
                      <td>{j.agilidade}</td>
                      <td>{j.idade}</td>
                      <td>
                        <span style={j.condicao === 'Apto' ? styles.statusApto : styles.statusMal}>
                          • {j.condicao}
                        </span>
                      </td>
                      <td>R$ {j.valorBase}</td>
                      <td>R$ {j.valorMercado}</td>
                      <td>{j.clubeNome || 'Livre'}</td>
                      <td>
                        {j.clubeNome ? null : <button style={styles.btnComprar}>🛒 Comprar</button>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  sidebar: { width: '220px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px' },
  brand: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '32px' },
  brandIcon: { backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  menu: { display: 'flex', flexDirection: 'column', gap: '4px' },
  menuGroup: { fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', margin: '16px 0 4px' },
  menuItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', color: '#334155', cursor: 'pointer', fontSize: '14px' },
  menuActive: { backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 'bold' },
  badge: { backgroundColor: '#f1f5f9', fontSize: '11px', padding: '2px 6px', borderRadius: '10px' },
  btnNovo: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  inputSearch: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '260px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  posBadge: { backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  statusApto: { color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' },
  statusMal: { color: '#ca8a04', backgroundColor: '#fef9c3', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' },
  btnComprar: { border: '1px solid #cbd5e1', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }
};