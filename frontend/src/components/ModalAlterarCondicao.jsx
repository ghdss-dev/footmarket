import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ModalAlterarCondicao({ isOpen, onClose, jogador, onCondicaoAtualizada }) {
  const [condicao, setCondicao] = useState('Apto');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jogador) {
      setCondicao(jogador.condicao || 'Apto');
    }
  }, [jogador]);

  if (!isOpen || !jogador) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.patch(`/players/${jogador.id}/condition`, {
        condicao,
      });

      // Passa os dados devolvidos pela API (com o novo valorMercado recalculado)
      onCondicaoAtualizada(response.data);
      onClose();
    } catch (err) {
      console.error('Erro ao alterar condição:', err);
      // Fallback caso a API aceite a alteração via PUT tradicional
      try {
        const fallbackResponse = await api.put(`/players/${jogador.id}`, {
          ...jogador,
          condicao,
        });
        onCondicaoAtualizada(fallbackResponse.data || { ...jogador, condicao });
        onClose();
      } catch (fallbackErr) {
        alert('Erro ao atualizar a condição do jogador na API.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  // Verifica se o jogador é titular num clube
  const isTitular = jogador.isTitular || jogador.titular;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Cabeçalho */}
        <div style={styles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Alterar condição física</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
              A condição muda o desconto do valor de mercado, recalculado ao salvar.
            </p>
          </div>
          <button onClick={onClose} style={styles.btnClose}>✕</button>
        </div>

        {/* Card Resumo do Jogador */}
        <div style={styles.playerCard}>
          <div style={styles.avatar}>{getIniciais(jogador.nome)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{jogador.nome}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {jogador.posicao} · {jogador.idade} anos
            </div>
          </div>
          <span style={jogador.condicao === 'Apto' ? styles.statusApto : styles.statusMal}>
            • {jogador.condicao}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Opções de Condição */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {/* Opção 1: Apto */}
            <label style={{
              ...styles.radioOption,
              borderColor: condicao === 'Apto' ? '#2563eb' : '#e2e8f0',
              backgroundColor: condicao === 'Apto' ? '#eff6ff' : '#fff'
            }}>
              <input
                type="radio"
                name="condicao"
                value="Apto"
                checked={condicao === 'Apto'}
                onChange={(e) => setCondicao(e.target.value)}
                disabled={jogador.condicao === 'Doente'} // Não passa direto de Doente para Apto
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>Apto</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Sem desconto na condição.</div>
                {jogador.condicao === 'Doente' && (
                  <div style={{ fontSize: '10px', color: '#dc2626', marginTop: '2px' }}>
                    De Doente não passa direto para Apto.
                  </div>
                )}
              </div>
            </label>

            {/* Opção 2: Mal condicionado */}
            <label style={{
              ...styles.radioOption,
              borderColor: condicao === 'Mal condicionado' ? '#2563eb' : '#e2e8f0',
              backgroundColor: condicao === 'Mal condicionado' ? '#eff6ff' : '#fff'
            }}>
              <input
                type="radio"
                name="condicao"
                value="Mal condicionado"
                checked={condicao === 'Mal condicionado'}
                onChange={(e) => setCondicao(e.target.value)}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>Mal condicionado</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Desconto de 15%. Agilidade de 50 a 100 corta pela metade, de 1 a 50 acréscimo de 10 pontos.
                </div>
              </div>
            </label>

            {/* Opção 3: Doente */}
            <label style={{
              ...styles.radioOption,
              borderColor: condicao === 'Doente' ? '#2563eb' : '#e2e8f0',
              backgroundColor: condicao === 'Doente' ? '#eff6ff' : '#fff'
            }}>
              <input
                type="radio"
                name="condicao"
                value="Doente"
                checked={condicao === 'Doente'}
                onChange={(e) => setCondicao(e.target.value)}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>Doente</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Desconto de 30%, com o mesmo ajuste de agilidade.
                </div>
              </div>
            </label>
          </div>

          {/* Alerta de Titularidade (J16) */}
          {condicao === 'Doente' && isTitular && (
            <div style={styles.warningBox}>
              <div style={{ fontWeight: 'bold', marginBottom: '2px', color: '#b45309' }}>
                ⚠️ {jogador.nome} é titular
              </div>
              <div>
                Ao passar a Doente, ele sai da escalação, e o {jogador.clubeNome || 'clube'} só volta a jogar partidas depois de escalar de novo os 5 titulares.
              </div>
            </div>
          )}

          {/* Rodapé */}
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.btnCancel}>Cancelar</button>
            <button type="submit" disabled={loading} style={styles.btnSave}>
              {loading ? 'Salvando...' : 'Salvar condição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '480px', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  btnClose: { border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' },
  playerCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' },
  avatar: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' },
  statusApto: { color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
  statusMal: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' },
  radioOption: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid', borderRadius: '8px', cursor: 'pointer' },
  warningBox: { backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px', color: '#78350f', fontSize: '12px', lineHeight: '1.4', marginBottom: '20px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' },
  btnCancel: { padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnSave: { padding: '8px 16px', border: 'none', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
};