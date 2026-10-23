import React, { useState } from 'react';
import { api } from '../services/api';

export function ModalNovoClube({ isOpen, onClose, onClubeCriado }) {
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !sigla.trim()) {
      setErro('Preencha o nome e a sigla do clube.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/clubs', {
        nome: nome.trim(),
        sigla: sigla.trim().toUpperCase(),
      });

      onClubeCriado(response.data);
      setNome('');
      setSigla('');
      onClose();
    } catch (err) {
      console.error('Erro ao criar clube:', err);
      
      // Captura a mensagem de erro retornada do backend (ex: "Já existe um clube com o nome...")
      const msgBackend = err.response?.data?.message || err.response?.data?.error;
      if (msgBackend) {
        setErro(Array.isArray(msgBackend) ? msgBackend.join(', ') : msgBackend);
      } else {
        setErro(`Já existe um clube com o nome "${nome.trim()}".`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErro('');
    setNome('');
    setSigla('');
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Cabeçalho */}
        <div style={styles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
              Novo clube
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
              Informe o nome e a sigla do clube.
            </p>
          </div>
          <button onClick={handleClose} style={styles.btnClose}>✕</button>
        </div>

        {/* Banner de Erro/Recusado (C03) */}
        {erro && (
          <div style={styles.errorBanner}>
            <div style={styles.errorTitle}>
              🚫 Não foi possível criar o clube
            </div>
            <div style={styles.errorMessage}>
              {erro}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Nome</label>
            <input
              type="text"
              placeholder="Águias FC"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                ...styles.input,
                borderColor: erro ? '#f87171' : '#cbd5e1',
              }}
            />
            <span style={styles.helpText}>
              De 3 a 50 caracteres e de 2 a 5 palavras; só letras, espaços, hífen e ponto. Não pode repetir outro clube.
            </span>
          </div>

          {/* Campo Sigla */}
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Sigla</label>
            <input
              type="text"
              placeholder="AGF"
              maxLength={3}
              value={sigla}
              onChange={(e) => setSigla(e.target.value.toUpperCase())}
              style={{ ...styles.input, textTransform: 'uppercase' }}
            />
            <span style={styles.helpText}>
              3 letras de A a Z, maiúsculas, que aparecem no nome nessa ordem; a primeira é a primeira letra do nome.
            </span>
          </div>

          {/* Info Card */}
          <div style={styles.infoBox}>
            📋 O clube começa com 300,00 em caixa e sem jogadores.
          </div>

          {/* Rodapé com Ações */}
          <div style={styles.footer}>
            <button type="button" onClick={handleClose} style={styles.btnCancel}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={styles.btnCreate}>
              {loading ? 'Criando...' : 'Criar clube'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '460px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  btnClose: {
    border: 'none',
    background: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#64748b',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
  },
  errorTitle: {
    color: '#991b1b',
    fontWeight: 'bold',
    fontSize: '13px',
    marginBottom: '2px',
  },
  errorMessage: {
    color: '#b91c1c',
    fontSize: '12px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  helpText: {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '4px',
    lineHeight: '1.3',
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    color: '#334155',
    marginBottom: '24px',
  },
  footer: {
    display: 'flex',
    justify: 'flex-end',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  btnCancel: {
    padding: '8px 16px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#334155',
  },
  btnCreate: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
};