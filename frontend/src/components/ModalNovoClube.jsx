import React, { useState } from 'react';
import { api } from '../services/api';

export function ModalNovoClube({ isOpen, onClose, onClubeCriado }) {
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Requisição POST real para criar o clube no Backend
      await api.post('/clubs', { nome, sigla });
      
      setNome('');
      setSigla('');
      onClubeCriado(); // Atualiza a lista de clubes na página anterior
      onClose();       // Fecha o modal
    } catch (err) {
      console.error('Erro ao criar clube:', err);
      // Exibe a mensagem de erro da API (ex: nome já existente, limite de 20 clubes, etc.)
      setErro(err.response?.data?.message || 'Erro ao criar o clube. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f172a' }}>Novo clube</h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>
          Insira o nome e a sigla do clube. Ele começa com 300,00 em caixa e sem jogadores.
        </p>

        {erro && <div style={styles.erroBox}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Nome do clube</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Águias FC"
              style={styles.input}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={styles.label}>Sigla (até 3 ou 4 letras)</label>
            <input
              type="text"
              value={sigla}
              onChange={(e) => setSigla(e.target.value.toUpperCase())}
              placeholder="Ex: AGU"
              maxLength={4}
              style={styles.input}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} style={styles.btnCancelar} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" style={styles.btnSalvar} disabled={carregando}>
              {carregando ? 'Criando...' : 'Criar clube'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' },
  erroBox: { backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' },
  btnCancelar: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' },
  btnSalvar: { padding: '8px 16px', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#fff' },
};