import React, { useState } from 'react';
import { api } from '../services/api';

export function ModalExcluirJogador({ isOpen, onClose, jogador, onJogadorExcluido }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !jogador) return null;

  const handleConfirmarExclusao = async () => {
    try {
      setLoading(true);
      await api.delete(`/players/${jogador.id}`);
      onJogadorExcluido(jogador);
      onClose();
    } catch (err) {
      console.error('Erro ao excluir jogador:', err);
      alert('Não foi possível excluir o jogador.');
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

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
          Excluir {jogador.nome}?
        </h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
          O jogador sai da lista e da busca, mas as transações e as partidas antigas dele continuam como foram gravadas.
        </p>

        {/* Card do Jogador */}
        <div style={styles.playerCard}>
          <div style={styles.avatar}>{getIniciais(jogador.nome)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>{jogador.nome}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {jogador.posicao} · {jogador.posicao === 'GOL' ? 'Goleiro' : jogador.posicao === 'ZAG' ? 'Zagueiro' : jogador.posicao === 'LAT' ? 'Lateral' : jogador.posicao === 'MEI' ? 'Meio-campo' : 'Atacante'} · {jogador.idade} anos
            </div>
          </div>
          <span style={styles.clubeBadge}>{jogador.clubeNome || 'Livre'}</span>
        </div>

        {/* Botões de Ação */}
        <div style={styles.footer}>
          <button type="button" onClick={onClose} disabled={loading} style={styles.btnCancel}>
            Cancelar
          </button>
          <button type="button" onClick={handleConfirmarExclusao} disabled={loading} style={styles.btnDelete}>
            {loading ? 'Excluindo...' : 'Excluir jogador'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '440px', width: '100%' },
  playerCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' },
  avatar: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' },
  clubeBadge: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
  btnCancel: { padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnDelete: { padding: '8px 16px', border: 'none', backgroundColor: '#dc2626', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
};