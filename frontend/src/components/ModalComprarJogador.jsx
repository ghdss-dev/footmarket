import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ModalComprarJogador({ isOpen, onClose, jogador, onCompraRealizada }) {
  const [clubes, setClubes] = useState([]);
  const [clubeIdSelecionado, setClubeIdSelecionado] = useState('');
  const [dataFidelidade, setDataFidelidade] = useState('2027-11-12');
  const [horaFidelidade, setHoraFidelidade] = useState('15:00');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isOpen) {
      carregarClubes();
    }
  }, [isOpen]);

  const carregarClubes = async () => {
    try {
      const response = await api.get('/clubs');
      setClubes(response.data);
      if (response.data.length > 0) {
        setClubeIdSelecionado(response.data[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar clubes para compra:', err);
    }
  };

  if (!isOpen || !jogador) return null;

  const clubeSelecionadoObj = clubes.find(c => String(c.id) === String(clubeIdSelecionado));
  const caixaAtual = clubeSelecionadoObj?.caixa || 0;
  const valorMercado = jogador.valorMercado || 0;
  const taxa = valorMercado > 30 ? valorMercado * 0.05 : 0;
  const custoTotal = valorMercado + taxa;
  const limiteMaximo = caixaAtual * 0.5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (custoTotal > limiteMaximo) {
      setErro(`O custo da compra (${custoTotal.toFixed(2)}) passa do limite de 50% do caixa (${limiteMaximo.toFixed(2)}).`);
      return;
    }

    try {
      setCarregando(true);
      const response = await api.post(`/clubs/${clubeIdSelecionado}/buy-player`, {
        playerId: jogador.id,
        fidelidadeAte: `${dataFidelidade}T${horaFidelidade}:00`,
      });

      onCompraRealizada({
        jogador,
        clube: clubeSelecionadoObj,
        resultado: response.data
      });
      
      onClose();
    } catch (err) {
      console.error('Erro ao realizar compra:', err);
      const mensagemApi = err.response?.data?.message;
      if (mensagemApi) {
        setErro(mensagemApi);
      } else {
        setErro('A compra não foi confirmada. Verifique a conexão e tente de novo.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Comprar jogador</h3>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
          Escolha o clube comprador e até quando vai a fidelidade do contrato.
        </p>

        {/* Informações do Jogador */}
        <div style={styles.playerInfoBox}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{jogador.nome}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{jogador.posicao} · {jogador.idade || 25} anos</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Valor de mercado</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{valorMercado.toFixed(2)}</div>
          </div>
        </div>

        {/* Caixa de Erro / Compra Recusada */}
        {erro && (
          <div style={styles.erroBox}>
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>⚠️ Compra recusada</div>
            <div>{erro}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Clube Comprador */}
          <div style={{ marginBottom: '14px' }}>
            <label style={styles.label}>Clube comprador</label>
            <select
              value={clubeIdSelecionado}
              onChange={(e) => setClubeIdSelecionado(e.target.value)}
              style={styles.input}
              required
            >
              {clubes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.sigla}) - caixa {c.caixa?.toFixed(2)}
                </option>
              ))}
            </select>
            <div style={styles.subtext}>
              Caixa atual: {caixaAtual.toFixed(2)}. O custo total (valor + taxa) pode ir até 50% do caixa.
            </div>
          </div>

          {/* Fim da Fidelidade */}
          <div style={{ marginBottom: '14px' }}>
            <label style={styles.label}>Fim da fidelidade</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '8px' }}>
              <input
                type="date"
                value={dataFidelidade}
                onChange={(e) => setDataFidelidade(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="time"
                value={horaFidelidade}
                onChange={(e) => setHoraFidelidade(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.subtext}>
              Depois do momento da compra e até 1.095 dias. Horário de Brasília, enviado com o fuso `-03:00`.
            </div>
          </div>

          {/* Aviso de Taxa */}
          <div style={styles.noticeBox}>
            ℹ️ A taxa é de 5% do valor de mercado, só quando ele passa de 30,00. Taxa, custo e novo caixa são calculados ao confirmar.
          </div>

          {/* Botões do Rodapé */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={styles.btnCancelar} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" style={styles.btnConfirmar} disabled={carregando}>
              {carregando ? 'A enviar...' : erro ? 'Tentar de novo' : 'Confirmar compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', width: '480px', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
  playerInfoBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#fff' },
  subtext: { fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: '1.3' },
  noticeBox: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 12px', borderRadius: '6px', fontSize: '11px', lineHeight: '1.4', marginBottom: '8px' },
  erroBox: { 
    backgroundColor: '#fef2f2', 
    border: '1px solid #fca5a5', 
    color: '#991b1b', 
    padding: '12px', 
    borderRadius: '8px', 
    fontSize: '12px', 
    marginBottom: '16px',
    lineHeight: '1.4'
  },
  btnCancelar: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' },
  btnConfirmar: { padding: '8px 16px', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#fff' },
};