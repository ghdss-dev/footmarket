import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ModalAlterarCondicao({ isOpen, onClose, jogador, onCondicaoAlterada }) {
  const [condicao, setCondicao] = useState(jogador?.condicao || 'Apto');
  const [carregando, setCarregando] = useState(false);

  // Garante que o select atualiza se o modal abrir para outro jogador
  useEffect(() => {
    if (jogador) {
      setCondicao(jogador.condicao || 'Apto');
    }
  }, [jogador]);

  if (!isOpen || !jogador) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // Atualiza a condição física no Backend (ex: 'Apto', 'Mal condicionado', 'Doente')
      await api.patch(`/players/${jogador.id}/condition`, { condicao });
      
      onCondicaoAlterada();
      onClose();
    } catch (err) {
      console.error('Erro ao alterar condição do jogador:', err);
      alert('Erro ao atualizar condição no servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f172a' }}>Alterar Condição</h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>
          Defina o estado físico de <b>{jogador.nome}</b>.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Condição Física</label>
            <select
              value={condicao}
              onChange={(e) => setCondicao(e.target.value)}
              style={styles.input}
            >
              <option value="Apto">Apto</option>
              <option value="Mal condicionado">Mal condicionado</option>
              <option value="Doente">Doente</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} style={styles.btnCancelar} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" style={styles.btnSalvar} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '380px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' },
  btnCancelar: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' },
  btnSalvar: { padding: '8px 16px', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#fff' },
};