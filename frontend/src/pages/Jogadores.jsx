import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ModalNovoJogador } from '../components/ModalNovoJogador';
import { ModalJogadorCadastrado } from '../components/ModalJogadorCadastrado';
import { ModalEditarJogador } from '../components/ModalEditarJogador';
import { ModalAlterarCondicao } from '../components/ModalAlterarCondicao';
import { ModalDetalhesJogador } from '../components/ModalDetalhesJogador';
import { ModalExcluirJogador } from '../components/ModalExcluirJogador';
import { MenuAcoesJogador } from '../components/MenuAcoesJogador';
import { ToastSucesso } from '../components/ToastSucesso';

export function Jogadores() {
  const [jogadores, setJogadores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [busca, setBusca] = useState('');
  const [posicao, setPosicao] = useState('');
  const [condicao, setCondicao] = useState('');
  const [clube, setClube] = useState('');
  const [abaTab, setAbaTab] = useState('livres');
  const [ordenacao, setOrdenacao] = useState('nome');

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jogadorRecemCadastrado, setJogadorRecemCadastrado] = useState(null);
  const [isSucessoOpen, setIsSucessoOpen] = useState(false);
  
  // Estados para Edição de Jogador
  const [jogadorParaEditar, setJogadorParaEditar] = useState(null);
  const [isEditarOpen, setIsEditarOpen] = useState(false);

  // Estados para Alteração de Condição Física
  const [jogadorParaCondicao, setJogadorParaCondicao] = useState(null);
  const [isCondicaoOpen, setIsCondicaoOpen] = useState(false);

  // Estados para Detalhes do Jogador (J12)
  const [jogadorParaDetalhes, setJogadorParaDetalhes] = useState(null);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);

  // Estados para Exclusão de Jogador (J13)
  const [jogadorParaExcluir, setJogadorParaExcluir] = useState(null);
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);

  // Estado para Toast Notification (J11 / J14)
  const [toastInfo, setToastInfo] = useState({ exibe: false, mensagem: '', submensagem: '' });

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

  // Handlers para o Menu de Ações
  const handleVerDetalhes = (jogador) => {
    setJogadorParaDetalhes(jogador);
    setIsDetalhesOpen(true);
  };

  const handleEditarJogador = (jogador) => {
    setJogadorParaEditar(jogador);
    setIsEditarOpen(true);
  };

  const handleAlterarCondicao = (jogador) => {
    setJogadorParaCondicao(jogador);
    setIsCondicaoOpen(true);
  };

  const handleComprarJogador = (jogador) => {
    console.log('Comprar:', jogador);
    // Futuro fluxo de compra
  };

  const handleExcluirJogador = (jogador) => {
    setJogadorParaExcluir(jogador);
    setIsExcluirOpen(true);
  };

  // Função acionada ao excluir jogador com sucesso (J14)
  const handleJogadorExcluidoSucesso = (jogadorExcluido) => {
    carregarJogadores();
    setToastInfo({
      exibe: true,
      mensagem: 'Jogador excluído',
      submensagem: `${jogadorExcluido.nome} saiu da lista. Transações e partidas antigas dele continuam gravadas.`,
    });
  };

  // Função acionada ao criar um jogador com sucesso
  const handleJogadorCriadoSucesso = (novoJogadorCalculado) => {
    carregarJogadores();
    setJogadorRecemCadastrado(novoJogadorCalculado);
    setIsSucessoOpen(true);
  };

  // Função acionada ao alterar a condição física do jogador com sucesso (J11)
  const handleCondicaoAtualizadaSucesso = (jogadorAtualizado) => {
    carregarJogadores();

    if (jogadorAtualizado && jogadorAtualizado.nome) {
      const valorMercadoFormatado = jogadorAtualizado.valorMercado 
        ? jogadorAtualizado.valorMercado.toFixed(2) 
        : '0.00';

      setToastInfo({
        exibe: true,
        mensagem: 'Condição alterada',
        submensagem: `${jogadorAtualizado.nome} agora está ${jogadorAtualizado.condicao}. Valor de mercado: ${valorMercadoFormatado}.`,
      });
    }
  };

  const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const normalizarTexto = (texto) => {
    if (!texto) return '';
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const ordemPosicoes = { GOL: 1, ZAG: 2, LAT: 3, MEI: 4, ATA: 5 };

  const jogadoresFiltradosEOrdenados = jogadores
    .filter((j) => {
      const nomeMatch = normalizarTexto(j.nome).includes(normalizarTexto(busca));
      const posicaoMatch = posicao ? j.posicao === posicao : true;
      const condicaoMatch = condicao ? j.condicao === condicao : true;
      
      const clubeMatch = abaTab === 'livres' 
        ? true 
        : (clube ? (clube === 'Livre' ? !j.clubeNome : j.clubeNome === clube) : true);

      let abaMatch = true;
      if (abaTab === 'livres') abaMatch = !j.clubeNome;
      if (abaTab === 'clubes') abaMatch = !!j.clubeNome;

      return nomeMatch && posicaoMatch && condicaoMatch && clubeMatch && abaMatch;
    })
    .sort((a, b) => {
      if (ordenacao === 'nome') {
        return a.nome.localeCompare(b.nome);
      }
      if (ordenacao === 'maior_valor') {
        return (b.valorMercado || 0) - (a.valorMercado || 0);
      }
      if (ordenacao === 'menor_valor') {
        return (a.valorMercado || 0) - (b.valorMercado || 0);
      }
      if (ordenacao === 'maior_idade') {
        return (b.idade || 0) - (a.idade || 0);
      }
      if (ordenacao === 'menor_idade') {
        return (a.idade || 0) - (b.idade || 0);
      }
      if (ordenacao === 'posicao') {
        return (ordemPosicoes[a.posicao] || 99) - (ordemPosicoes[b.posicao] || 99);
      }
      return 0;
    });

  const handleTrocaAba = (novaAba) => {
    setAbaTab(novaAba);
    if (novaAba === 'livres') {
      setClube('');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Sidebar Lateral */}
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
          <a style={{ ...styles.menuItem, ...styles.menuActive }}>
            👤 Jogadores <span style={styles.badge}>{jogadores.length}</span>
          </a>
          <a style={styles.menuItem}>
            🛡️ Clubes <span style={styles.badge}>6</span>
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
            <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold' }}>Jogadores</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
              Cadastre jogadores, acompanhe os indicadores e compre os que estão livres.
            </p>
          </div>
          <button style={styles.btnNovo} onClick={() => setIsModalOpen(true)}>
            + Novo jogador
          </button>
        </header>

        {/* Filtros em Linha */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.inputSearch}
          />

          <select value={posicao} onChange={(e) => setPosicao(e.target.value)} style={styles.selectFilter}>
            <option value="">Posição</option>
            <option value="GOL">GOL</option>
            <option value="ZAG">ZAG</option>
            <option value="LAT">LAT</option>
            <option value="MEI">MEI</option>
            <option value="ATA">ATA</option>
          </select>

          <select value={condicao} onChange={(e) => setCondicao(e.target.value)} style={styles.selectFilter}>
            <option value="">Condição</option>
            <option value="Apto">Apto</option>
            <option value="Mal condicionado">Mal condicionado</option>
            <option value="Doente">Doente</option>
          </select>

          <div style={{ position: 'relative' }}>
            <select
              value={clube}
              onChange={(e) => setClube(e.target.value)}
              disabled={abaTab === 'livres'}
              style={{
                ...styles.selectFilter,
                backgroundColor: abaTab === 'livres' ? '#f1f5f9' : '#fff',
                cursor: abaTab === 'livres' ? 'not-allowed' : 'pointer',
                opacity: abaTab === 'livres' ? 0.6 : 1,
              }}
            >
              <option value="">Clube</option>
              <option value="Águias FC">Águias FC</option>
              <option value="Delta FC">Delta FC</option>
              <option value="Épsilon EC">Épsilon EC</option>
            </select>
          </div>
        </div>

        {abaTab === 'livres' && (
          <div style={styles.tooltipNotice}>
            💬 "Livre" não combina com o filtro por clube.
          </div>
        )}

        {/* Abas e Ordenação */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleTrocaAba('todos')}
              style={abaTab === 'todos' ? styles.tabActive : styles.tabInactive}
            >
              Todos {jogadores.length}
            </button>
            <button
              onClick={() => handleTrocaAba('livres')}
              style={abaTab === 'livres' ? styles.tabActive : styles.tabInactive}
            >
              Livres {jogadores.filter((j) => !j.clubeNome).length}
            </button>
            <button
              onClick={() => handleTrocaAba('clubes')}
              style={abaTab === 'clubes' ? styles.tabActive : styles.tabInactive}
            >
              Em clubes {jogadores.filter((j) => !!j.clubeNome).length}
            </button>
          </div>

          <div style={{ fontSize: '13px', color: '#64748b' }}>
            ⇅ Ordenar por: 
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 8px',
                backgroundColor: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: '6px',
              }}
            >
              <option value="nome">Nome</option>
              <option value="maior_valor">Maior valor de mercado</option>
              <option value="menor_valor">Menor valor de mercado</option>
              <option value="maior_idade">Maior idade</option>
              <option value="menor_idade">Menor idade</option>
              <option value="posicao">Posição (GOL a ATA)</option>
            </select>
          </div>
        </div>

        {/* Tabela de Jogadores */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={{ padding: '20px', textAlign: 'center' }}>Carregando jogadores da API...</p>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px' }}>
                    <th style={{ padding: '12px' }}>Jogador</th>
                    <th>Posição</th>
                    <th>Overall</th>
                    <th>Agilidade</th>
                    <th>Idade</th>
                    <th>Condição</th>
                    <th>Valor base</th>
                    <th>Valor de mercado</th>
                    <th>Clube</th>
                    <th style={{ textAlign: 'right', paddingRight: '16px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {jogadoresFiltradosEOrdenados.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                        Nenhum jogador encontrado na base de dados.
                      </td>
                    </tr>
                  ) : (
                    jogadoresFiltradosEOrdenados.map((j) => (
                      <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={styles.avatar}>{getIniciais(j.nome)}</div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{j.nome}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                              {j.posicao === 'GOL' ? 'Goleiro' : j.posicao === 'ZAG' ? 'Zagueiro' : j.posicao === 'LAT' ? 'Lateral' : j.posicao === 'MEI' ? 'Meio-campo' : 'Atacante'}
                            </div>
                          </div>
                        </td>
                        <td><span style={styles.posBadge}>{j.posicao}</span></td>
                        <td><b>{j.overall}</b></td>
                        
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{j.agilidade}</span>
                            <div style={{ width: '30px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(j.agilidade, 100)}%`, height: '100%', backgroundColor: j.agilidade > 70 ? '#22c55e' : '#f59e0b' }}></div>
                            </div>
                          </div>
                        </td>

                        <td>{j.idade}</td>
                        <td>
                          <span style={j.condicao === 'Apto' ? styles.statusApto : styles.statusMal}>
                            • {j.condicao}
                          </span>
                        </td>
                        <td>{j.valorBase ? j.valorBase.toFixed(2) : '0.00'}</td>
                        <td><b>{j.valorMercado ? j.valorMercado.toFixed(2) : '0.00'}</b></td>
                        <td style={{ color: j.clubeNome ? '#0f172a' : '#64748b' }}>{j.clubeNome || 'Livre'}</td>
                        <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            {!j.clubeNome && (
                              <button style={styles.btnComprar} onClick={() => handleComprarJogador(j)}>
                                🛒 Comprar
                              </button>
                            )}
                            <MenuAcoesJogador
                              jogador={j}
                              onVerDetalhes={handleVerDetalhes}
                              onEditar={handleEditarJogador}
                              onAlterarCondicao={handleAlterarCondicao}
                              onComprar={handleComprarJogador}
                              onExcluir={handleExcluirJogador}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
                Mostrando 1-{jogadoresFiltradosEOrdenados.length} de {jogadoresFiltradosEOrdenados.length} jogadores
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal 1: Cadastro de Novo Jogador */}
      <ModalNovoJogador
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJogadorCriado={handleJogadorCriadoSucesso}
      />

      {/* Modal 2: Resultado de Sucesso do Cadastro (J07) */}
      <ModalJogadorCadastrado
        isOpen={isSucessoOpen}
        onClose={() => setIsSucessoOpen(false)}
        jogador={jogadorRecemCadastrado}
      />

      {/* Modal 3: Edição de Jogador Existente (J09) */}
      <ModalEditarJogador
        isOpen={isEditarOpen}
        onClose={() => setIsEditarOpen(false)}
        jogador={jogadorParaEditar}
        onJogadorAtualizado={carregarJogadores}
      />

      {/* Modal 4: Alterar Condição Física (J10) */}
      <ModalAlterarCondicao
        isOpen={isCondicaoOpen}
        onClose={() => setIsCondicaoOpen(false)}
        jogador={jogadorParaCondicao}
        onCondicaoAtualizada={handleCondicaoAtualizadaSucesso}
      />

      {/* Modal 5: Detalhes do Jogador (J12) */}
      <ModalDetalhesJogador
        isOpen={isDetalhesOpen}
        onClose={() => setIsDetalhesOpen(false)}
        jogador={jogadorParaDetalhes}
        onEditar={handleEditarJogador}
        onAlterarCondicao={handleAlterarCondicao}
        onComprar={handleComprarJogador}
      />

      {/* Modal 6: Confirmação de Exclusão (J13) */}
      <ModalExcluirJogador
        isOpen={isExcluirOpen}
        onClose={() => setIsExcluirOpen(false)}
        jogador={jogadorParaExcluir}
        onJogadorExcluido={handleJogadorExcluidoSucesso}
      />

      {/* Toast Notification: Sucesso ao Alterar Condição (J11) ou Excluir (J14) */}
      {toastInfo.exibe && (
        <ToastSucesso
          mensagem={toastInfo.mensagem}
          submensagem={toastInfo.submensagem}
          onClose={() => setToastInfo({ exibe: false, mensagem: '', submensagem: '' })}
        />
      )}
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
  inputSearch: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '220px' },
  selectFilter: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' },
  tooltipNotice: { backgroundColor: '#0f172a', color: '#fff', fontSize: '12px', padding: '6px 12px', borderRadius: '6px', width: 'fit-content', marginBottom: '16px' },
  tabActive: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  tabInactive: { backgroundColor: '#fff', color: '#64748b', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  avatar: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' },
  posBadge: { backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  statusApto: { color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' },
  statusMal: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' },
  btnComprar: { border: '1px solid #cbd5e1', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }
};