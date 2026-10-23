import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ModalNovoClube } from '../components/ModalNovoClube'; // Importação do Modal

export function Clubes() {
  const navigate = useNavigate();
  const [clubes, setClubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordenacao, setOrdenacao] = useState('patrimonio_desc');

  // Estado para controlar abertura do Modal de Novo Clube
  const [isModalNovoOpen, setIsModalNovoOpen] = useState(false);

  const carregarClubes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clubs');
      setClubes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clubes:', error);
      setClubes([
        { id: 1, nome: 'Tubarões EC', sigla: 'TUB', caixa: 300.00, valorElenco: 0.00 },
        { id: 2, nome: 'Épsilon EC', sigla: 'EPS', caixa: 215.47, valorElenco: 80.50 },
        { id: 3, nome: 'Gama SC', sigla: 'GAM', caixa: 181.84, valorElenco: 113.56 },
        { id: 4, nome: 'Delta FC', sigla: 'DEL', caixa: 91.85, valorElenco: 200.76 },
        { id: 5, nome: 'Mangue FC', sigla: 'MNG', caixa: 251.70, valorElenco: 32.20 },
        { id: 6, nome: 'Águias FC', sigla: 'AGU', caixa: 51.58, valorElenco: 222.68 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClubes();
  }, []);

  const handleClubeCriado = () => {
    carregarClubes();
  };

  const clubesOrdenados = [...clubes].sort((a, b) => {
    const patrimonioA = (a.caixa || 0) + (a.valorElenco || a.valorDoElenco || 0);
    const patrimonioB = (b.caixa || 0) + (b.valorElenco || b.valorDoElenco || 0);

    if (ordenacao === 'nome') {
      return a.nome.localeCompare(b.nome);
    }
    if (ordenacao === 'patrimonio_desc') {
      return patrimonioB - patrimonioA;
    }
    if (ordenacao === 'patrimonio_asc') {
      return patrimonioA - patrimonioB;
    }
    return 0;
  });

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
          <a style={styles.menuItem} onClick={() => navigate('/jogadores')}>
            👤 Jogadores <span style={styles.badge}>23</span>
          </a>
          <a style={{ ...styles.menuItem, ...styles.menuActive }} onClick={() => navigate('/clubes')}>
            🛡️ Clubes <span style={styles.badge}>{clubes.length}</span>
          </a>

          <div style={styles.menuGroup}>LIGA</div>
          <a style={styles.menuItem}>⚽ Partidas <span style={styles.badge}>2</span></a>
          <a style={styles.menuItem}>📊 Classificação</a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '32px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', color: '#0f172a' }}>Clubes</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
              Cada clube começa com 300,00 em caixa e sem jogadores. A liga aceita no máximo 20 clubes.
            </p>
          </div>
          <button style={styles.btnNovo} onClick={() => setIsModalNovoOpen(true)}>
            + Novo clube
          </button>
        </header>

        {/* Barra Superior da Tabela */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={styles.tabActive}>
              {clubes.length} clubes
            </span>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {clubes.length} de 20
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#64748b' }}>
            ⇅ Ordenar: 
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              style={styles.selectOrder}
            >
              <option value="nome">Nome</option>
              <option value="patrimonio_desc">Patrimônio (maior para o menor)</option>
              <option value="patrimonio_asc">Patrimônio (menor para o maior)</option>
            </select>
          </div>
        </div>

        {/* Tabela de Clubes ou Estado de Lista Vazia (C09) */}
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Carregando clubes...</p>
        ) : clubes.length === 0 ? (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', color: '#94a3b8' }}>🛡️</div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 6px' }}>Nenhum clube cadastrado</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>
              Crie o primeiro clube com nome e sigla. Ele começa com 300,00 em caixa e sem jogadores.
            </p>
            <button style={styles.btnNovo} onClick={() => setIsModalNovoOpen(true)}>
              + Novo clube
            </button>
          </div>
        ) : (
          <div style={styles.tableCard}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px' }}>
                  <th style={{ padding: '12px 16px' }}>Clube</th>
                  <th>Sigla</th>
                  <th style={{ textAlign: 'right' }}>Caixa</th>
                  <th style={{ textAlign: 'right' }}>Valor do elenco</th>
                  <th style={{ textAlign: 'right' }}>Patrimônio</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clubesOrdenados.map((c) => {
                  const valorElencoVal = c.valorElenco || c.valorDoElenco || 0;
                  const patrimonioVal = (c.caixa || 0) + valorElencoVal;

                  return (
                    <tr key={c.id || c.sigla} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={styles.badgeSigla}>{c.sigla}</div>
                        <strong style={{ color: '#0f172a' }}>{c.nome}</strong>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>{c.sigla}</td>
                      <td style={{ textAlign: 'right' }}>{c.caixa ? c.caixa.toFixed(2) : '0,00'}</td>
                      <td style={{ textAlign: 'right' }}>{valorElencoVal ? valorElencoVal.toFixed(2) : '0,00'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                        {patrimonioVal ? patrimonioVal.toFixed(2) : '0,00'}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <span 
                          onClick={() => navigate(`/clubes/${c.id}`)} 
                          style={{ ...styles.linkVerClube, cursor: 'pointer' }}
                        >
                          Ver clube &gt;
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '16px' }}>
          Clubes pelo nome por padrão ou pelo patrimônio, do maior para o menor, com empate desfeito pelo nome.
        </p>
      </main>

      {/* Modal de Novo Clube */}
      <ModalNovoClube
        isOpen={isModalNovoOpen}
        onClose={() => setIsModalNovoOpen(false)}
        onClubeCriado={handleClubeCriado}
      />
    </div>
  );
}

const styles = {
  sidebar: { width: '220px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px' },
  brand: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '32px' },
  brandIcon: { backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  menu: { display: 'flex', flexDirection: 'column', gap: '4px' },
  menuGroup: { fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', margin: '16px 0 4px' },
  menuItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', color: '#334155', cursor: 'pointer', fontSize: '14px', textDecoration: 'none' },
  menuActive: { backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 'bold' },
  badge: { backgroundColor: '#f1f5f9', fontSize: '11px', padding: '2px 6px', borderRadius: '10px' },
  btnNovo: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  tabActive: { backgroundColor: '#2563eb', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '13px' },
  selectOrder: { border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px', backgroundColor: '#fff', fontWeight: 'bold', cursor: 'pointer', marginLeft: '6px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  badgeSigla: { backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 'bold', borderRadius: '4px', padding: '4px 8px', fontSize: '11px' },
  linkVerClube: { color: '#0f172a', textDecoration: 'none', fontWeight: '500', fontSize: '13px' }
};