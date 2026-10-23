import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export function Jogadores() {
  const navigate = useNavigate();
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarJogadores = async () => {
    try {
      setLoading(true);
      // Requisição real ao Backend para listar o mercado de jogadores
      const response = await api.get('/players');
      setJogadores(response.data);
    } catch (error) {
      console.error('Erro ao buscar jogadores do backend:', error);
      setJogadores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarJogadores();
  }, []);

  const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Sidebar Lateral */}
      <aside style={styles.sidebar}>
        <div style={{ ...styles.brand, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={styles.brandIcon}>P</div>
          <div>
            <strong style={{ fontSize: '16px' }}>Passe</strong>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Gestão da liga</div>
          </div>
        </div>

        <nav style={styles.menu}>
          <div style={styles.menuGroup}>MERCADO</div>
          <a style={{ ...styles.menuItem, ...styles.menuActive }} onClick={() => navigate('/jogadores')}>
            👤 Jogadores <span style={styles.badge}>{jogadores.length}</span>
          </a>
          <a style={styles.menuItem} onClick={() => navigate('/clubes')}>
            🛡️ Clubes
          </a>

          <div style={styles.menuGroup}>LIGA</div>
          <a style={styles.menuItem}>⚽ Partidas</a>
          <a style={styles.menuItem}>📊 Classificação</a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '32px' }}>
        <header style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', color: '#0f172a' }}>Jogadores</h2>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
            Lista completa de jogadores disponíveis no mercado para contratação pelos clubes.
          </p>
        </header>

        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Carregando jogadores do mercado...</p>
        ) : jogadores.length === 0 ? (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>Nenhum jogador encontrado no mercado.</p>
          </div>
        ) : (
          <div style={styles.tableCard}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px' }}>
                  <th style={{ padding: '12px 16px' }}>Jogador</th>
                  <th>Posição</th>
                  <th>Overall</th>
                  <th>Condição</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Valor de mercado</th>
                </tr>
              </thead>
              <tbody>
                {jogadores.map((j) => (
                  <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={styles.avatar}>{getIniciais(j.nome)}</div>
                      <strong style={{ color: '#0f172a' }}>{j.nome}</strong>
                    </td>
                    <td><span style={styles.posBadge}>{j.posicao}</span></td>
                    <td><b>{j.overall}</b></td>
                    <td>
                      <span style={j.condicao === 'Apto' ? styles.statusApto : styles.statusMal}>
                        • {j.condicao}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px', fontWeight: 'bold', color: '#0f172a' }}>
                      {j.valorMercado ? j.valorMercado.toFixed(2) : '0,00'} moedas
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  tableCard: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  avatar: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' },
  posBadge: { backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  statusApto: { color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
  statusMal: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
};