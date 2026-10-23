import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AbaEscalacao } from '../components/AbaEscalacao';

export function DetalheClube() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clube, setClube] = useState(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('elenco');

  const carregarDetalhesClube = async () => {
    try {
      setLoading(true);
      // Requisição real ao Backend
      const response = await api.get(`/clubs/${id}`);
      setClube(response.data);
    } catch (error) {
      console.error('Erro ao carregar detalhes do clube do backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDetalhesClube();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#64748b' }}>
        Carregando detalhes do clube...
      </div>
    );
  }

  if (!clube) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#dc2626' }}>
        Clube não encontrado ou erro de conexão com o servidor.
      </div>
    );
  }

  const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const ordemPosicoes = { GOL: 1, ZAG: 2, LAT: 3, MEI: 4, ATA: 5 };

  const jogadoresOrdenados = [...(clube.jogadores || [])].sort((a, b) => {
    const posA = ordemPosicoes[a.posicao] || 99;
    const posB = ordemPosicoes[b.posicao] || 99;
    if (posA !== posB) return posA - posB;
    return a.nome.localeCompare(b.nome);
  });

  const patrimonioTotal = (clube.caixa || 0) + (clube.valorElenco || 0);
  const totalJogadores = clube.jogadores ? clube.jogadores.length : 0;

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
            👤 Jogadores
          </a>
          <a style={{ ...styles.menuItem, ...styles.menuActive }} onClick={() => navigate('/clubes')}>
            🛡️ Clubes
          </a>

          <div style={styles.menuGroup}>LIGA</div>
          <a style={styles.menuItem}>⚽ Partidas</a>
          <a style={styles.menuItem}>📊 Classificação</a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '32px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
          Mercado &gt; Clubes &gt; <strong style={{ color: '#0f172a' }}>{clube.nome}</strong>
        </div>

        {/* Header do Clube */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.badgeSiglaHeader}>{clube.sigla}</div>
            <div>
              <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', color: '#0f172a' }}>
                {clube.nome}
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Sigla <b>{clube.sigla}</b> · {totalJogadores} de 12 jogadores
              </div>
            </div>
          </div>

          <button style={styles.btnComprar} onClick={() => navigate('/jogadores')}>
            🛒 Comprar jogadores
          </button>
        </header>

        {/* Métricas Financeiras */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Caixa</div>
            <div style={styles.metricValue}>{clube.caixa ? clube.caixa.toFixed(2) : '0,00'} <small style={styles.moedaText}>moedas</small></div>
            <div style={styles.metricSubtext}>Só muda por compras e vendas</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Valor do elenco</div>
            <div style={styles.metricValue}>{(clube.valorElenco || 0).toFixed(2)} <small style={styles.moedaText}>moedas</small></div>
            <div style={styles.metricSubtext}>Soma dos valores de mercado</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Patrimônio</div>
            <div style={styles.metricValue}>{patrimonioTotal.toFixed(2)} <small style={styles.moedaText}>moedas</small></div>
            <div style={styles.metricSubtext}>Caixa + valor do elenco</div>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Elenco</div>
            <div style={styles.metricValue}>{totalJogadores} de 12</div>
            <div style={styles.metricSubtext}>Limite de 12 jogadores</div>
          </div>
        </div>

        {/* Abas Internas */}
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            onClick={() => setAbaAtiva('elenco')}
            style={abaAtiva === 'elenco' ? styles.tabSubActive : styles.tabSubInactive}
          >
            👕 Elenco <span style={styles.tabBadge}>{totalJogadores}</span>
          </button>
          <button
            onClick={() => setAbaAtiva('escalacao')}
            style={abaAtiva === 'escalacao' ? styles.tabSubActive : styles.tabSubInactive}
          >
            📋 Escalação
          </button>
          <button
            onClick={() => setAbaAtiva('historico')}
            style={abaAtiva === 'historico' ? styles.tabSubActive : styles.tabSubInactive}
          >
            📜 Histórico <span style={styles.tabBadge}>{clube.historicoCount || 0}</span>
          </button>
        </div>

        {/* Conteúdo da Aba Elenco */}
        {abaAtiva === 'elenco' && (
          <div style={styles.tableCard}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '15px', color: '#0f172a' }}>Elenco</strong>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Ordem por posição (GOL, ZAG, LAT, MEI, ATA), depois pelo nome.
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px' }}>
                  <th style={{ padding: '12px 16px' }}>Jogador</th>
                  <th>Posição</th>
                  <th>Overall</th>
                  <th>Condição</th>
                  <th style={{ textAlign: 'right' }}>Valor de mercado</th>
                  <th style={{ textAlign: 'right', paddingRight: '16px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {jogadoresOrdenados.map((j) => (
                  <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{j.valorMercado?.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                      <button style={styles.btnVender}>💸 Vender</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Conteúdo da Aba Escalação */}
        {abaAtiva === 'escalacao' && (
          <AbaEscalacao clube={clubre} />
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
  badgeSiglaHeader: { backgroundColor: '#f1f5f9', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', border: '1px solid #e2e8f0' },
  btnComprar: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  metricCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' },
  metricLabel: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  metricValue: { fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0' },
  moedaText: { fontSize: '12px', fontWeight: 'normal', color: '#64748b' },
  metricSubtext: { fontSize: '11px', color: '#94a3b8' },
  tabSubActive: { border: 'none', background: 'none', borderBottom: '2px solid #2563eb', color: '#2563eb', fontWeight: 'bold', padding: '8px 4px', cursor: 'pointer', fontSize: '14px' },
  tabSubInactive: { border: 'none', background: 'none', color: '#64748b', padding: '8px 4px', cursor: 'pointer', fontSize: '14px' },
  tabBadge: { backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', marginLeft: '4px' },
  tableCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' },
  avatar: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' },
  posBadge: { backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  statusApto: { color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
  statusMal: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
  btnVender: { border: '1px solid #cbd5e1', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#0f172a' },
};