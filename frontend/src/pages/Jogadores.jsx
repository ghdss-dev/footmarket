import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MenuAcoesJogador } from '../components/MenuAcoesJogador';
import { ModalJogadorCadastrado } from '../components/ModalJogadorCadastrado';
import { ModalEditarJogador } from '../components/ModalEditarJogador';
import { ModalExcluirJogador } from '../components/ModalExcluirJogador';
import { ModalAlterarCondicao } from '../components/ModalAlterarCondicao';
import { ModalDetalhesJogador } from '../components/ModalDetalhesJogador';
import { ModalComprarJogador } from '../components/ModalComprarJogador';
import { ModalCompraSucesso } from '../components/ModalCompraSucesso';

export function Jogadores() {
  const navigate = useNavigate();
  const [jogadores, setJogadores] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros e Abas
  const [abaAtiva, setAbaAtiva] = useState('todos'); // 'todos' | 'livres' | 'em_clubes'
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroPosicao, setFiltroPosicao] = useState('');
  const [filtroCondicao, setFiltroCondicao] = useState('');
  const [filtroClubeId, setFiltroClubeId] = useState('');
  const [filtroIdade, setFiltroIdade] = useState('');
  const [filtroValor, setFiltroValor] = useState('');

  // Estados dos Modais
  const [isCadastrarOpen, setIsCadastrarOpen] = useState(false);
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null);
  
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isCondicaoOpen, setIsCondicaoOpen] = useState(false);
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);
  const [isComprarOpen, setIsComprarOpen] = useState(false);

  // Estados do Modal de Sucesso da Compra
  const [isSucessoOpen, setIsSucessoOpen] = useState(false);
  const [dadosCompraSucesso, setDadosCompraSucesso] = useState(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resJogadores, resClubes] = await Promise.all([
        api.get('/players'),
        api.get('/clubs')
      ]);
      setJogadores(resJogadores.data);
      setClubes(resClubes.data);
    } catch (error) {
      console.error('Erro ao buscar dados do backend:', error);
      setJogadores([]);
      setClubes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroPosicao('');
    setFiltroCondicao('');
    setFiltroClubeId('');
    setFiltroIdade('');
    setFiltroValor('');
    setAbaAtiva('todos');
  };

  // Lógica de filtragem integrada
  const jogadoresFiltrados = jogadores.filter((j) => {
    // Filtro por Abas
    if (abaAtiva === 'livres' && j.clubeId) return false;
    if (abaAtiva === 'em_clubes' && !j.clubeId) return false;

    // Filtros avançados
    if (filtroNome && !j.nome.toLowerCase().includes(filtroNome.toLowerCase())) return false;
    if (filtroPosicao && j.posicao !== filtroPosicao) return false;
    if (filtroCondicao && j.condicao !== filtroCondicao) return false;
    if (filtroClubeId && String(j.clubeId) !== String(filtroClubeId)) return false;
    if (filtroIdade && Number(j.idade) !== Number(filtroIdade)) return false;
    if (filtroValor && Number(j.valorMercado) !== Number(filtroValor)) return false;

    return true;
  });

  const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const temFiltrosAtivos = filtroNome || filtroPosicao || filtroCondicao || filtroClubeId || filtroIdade || filtroValor;

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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', color: '#0f172a' }}>Jogadores</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
              Cadastre jogadores, acompanhe os indicadores e compre os que estão livres.
            </p>
          </div>
          <button style={styles.btnNovo} onClick={() => setIsCadastrarOpen(true)}>
            + Novo jogador
          </button>
        </header>

        {/* Barra de Filtros Avançados */}
        <div style={styles.filterCard}>
          <div style={styles.filterGrid}>
            <input
              type="text"
              placeholder="🔍 Buscar por nome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              style={styles.filterInput}
            />
            <select
              value={filtroPosicao}
              onChange={(e) => setFiltroPosicao(e.target.value)}
              style={styles.filterInput}
            >
              <option value="">Posição</option>
              <option value="GOL">Goleiro</option>
              <option value="ZAG">Zagueiro</option>
              <option value="LAT">Lateral</option>
              <option value="MEI">Meio-campo</option>
              <option value="ATA">Atacante</option>
            </select>
            <select
              value={filtroCondicao}
              onChange={(e) => setFiltroCondicao(e.target.value)}
              style={styles.filterInput}
            >
              <option value="">Condição</option>
              <option value="Apto">Apto</option>
              <option value="Lesionado">Lesionado</option>
              <option value="Suspenso">Suspenso</option>
            </select>
            <select
              value={filtroClubeId}
              onChange={(e) => {
                const val = e.target.value;
                setFiltroClubeId(val);
                if (val && abaAtiva === 'livres') setAbaAtiva('todos'); // Regra do Figma
              }}
              style={styles.filterInput}
            >
              <option value="">Clube</option>
              {clubes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Idade"
              value={filtroIdade}
              onChange={(e) => setFiltroIdade(e.target.value)}
              style={styles.filterInput}
            />
            <input
              type="number"
              placeholder="Valor de mercado"
              value={filtroValor}
              onChange={(e) => setFiltroValor(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          {temFiltrosAtivos && (
            <div style={styles.filterFooter}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Filtros ativos aplicados</span>
              <button onClick={limparFiltros} style={styles.btnClear}>Limpar filtros</button>
            </div>
          )}
        </div>

        {/* Abas de Navegação Rápida (Todos, Livres, Em clubes) */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setAbaAtiva('todos')}
            style={abaAtiva === 'todos' ? styles.tabActive : styles.tab}
          >
            Todos {jogadores.length}
          </button>
          <button
            onClick={() => {
              if (!filtroClubeId) setAbaAtiva('livres');
            }}
            disabled={Boolean(filtroClubeId)}
            style={{
              ...(abaAtiva === 'livres' ? styles.tabActive : styles.tab),
              ...(filtroClubeId ? styles.tabDisabled : {})
            }}
            title={filtroClubeId ? "Indisponível com clube filtrado" : ""}
          >
            Livres {jogadores.filter(j => !j.clubeId).length}
          </button>
          <button
            onClick={() => setAbaAtiva('em_clubes')}
            style={abaAtiva === 'em_clubes' ? styles.tabActive : styles.tab}
          >
            Em clubes {jogadores.filter(j => j.clubeId).length}
          </button>
        </div>

        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>Carregando jogadores do mercado...</p>
        ) : jogadoresFiltrados.length === 0 ? (
          <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>Nenhum jogador encontrado com os filtros selecionados.</p>
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
                  <th>Clube</th>
                  <th style={{ textAlign: 'right' }}>Valor de mercado</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {jogadoresFiltrados.map((j) => (
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
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{j.clubeNome || 'Livre'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                      {j.valorMercado ? j.valorMercado.toFixed(2) : '0,00'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <MenuAcoesJogador
                        jogador={j}
                        onDetalhes={(jog) => { setJogadorSelecionado(jog); setIsDetalhesOpen(true); }}
                        onEditar={(jog) => { setJogadorSelecionado(jog); setIsEditarOpen(true); }}
                        onAlterarCondicao={(jog) => { setJogadorSelecionado(jog); setIsCondicaoOpen(true); }}
                        onComprar={(jog) => { setJogadorSelecionado(jog); setIsComprarOpen(true); }}
                        onExcluir={(jog) => { setJogadorSelecionado(jog); setIsExcluirOpen(true); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modais de Ação */}
      <ModalJogadorCadastrado
        isOpen={isCadastrarOpen}
        onClose={() => setIsCadastrarOpen(false)}
        onJogadorCadastrado={carregarDados}
      />

      <ModalDetalhesJogador
        isOpen={isDetalhesOpen}
        onClose={() => setIsDetalhesOpen(false)}
        jogador={jogadorSelecionado}
        onEditar={(jog) => { setJogadorSelecionado(jog); setIsEditarOpen(true); }}
        onAlterarCondicao={(jog) => { setJogadorSelecionado(jog); setIsCondicaoOpen(true); }}
        onComprar={(jog) => { setJogadorSelecionado(jog); setIsComprarOpen(true); }}
      />

      <ModalEditarJogador
        isOpen={isEditarOpen}
        onClose={() => setIsEditarOpen(false)}
        jogador={jogadorSelecionado}
        onJogadorAtualizado={carregarDados}
      />

      <ModalAlterarCondicao
        isOpen={isCondicaoOpen}
        onClose={() => setIsCondicaoOpen(false)}
        jogador={jogadorSelecionado}
        onCondicaoAlterada={carregarDados}
      />

      <ModalExcluirJogador
        isOpen={isExcluirOpen}
        onClose={() => setIsExcluirOpen(false)}
        jogador={jogadorSelecionado}
        onJogadorExcluido={carregarDados}
      />

      <ModalComprarJogador
        isOpen={isComprarOpen}
        onClose={() => setIsComprarOpen(false)}
        jogador={jogadorSelecionado}
        onCompraRealizada={(dados) => {
          setDadosCompraSucesso(dados);
          setIsSucessoOpen(true);
          carregarDados();
        }}
      />

      <ModalCompraSucesso
        isOpen={isSucessoOpen}
        onClose={() => setIsSucessoOpen(false)}
        dadosCompra={dadosCompraSucesso}
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
  menuItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', color: '#334155', cursor: 'pointer', fontSize: '14px' },
  menuActive: { backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 'bold' },
  badge: { backgroundColor: '#f1f5f9', fontSize: '11px', padding: '2px 6px', borderRadius: '10px' },
  btnNovo: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  filterCard: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '16px' },
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
  filterInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  filterFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' },
  btnClear: { background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' },
  tabsContainer: { display: 'flex', gap: '8px', marginBottom: '16px' },
  tab: { padding: '6px 14px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#334155', cursor: 'pointer', fontWeight: '500' },
  tabActive: { padding: '6px 14px', backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '6px', fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' },
  tabDisabled: { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#f1f5f9' },
  tableCard: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  avatar: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' },
  posBadge: { backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  statusApto: { color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
  statusMal: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
};