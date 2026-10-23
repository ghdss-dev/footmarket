import React, { useState } from 'react';
import { api } from '../services/api';

export function ModalJogadorCadastrado({ isOpen, onClose, onJogadorCadastrado }) {
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('GOL');
  const [overall, setOverall] = useState(70);
  const [valorMercado, setValorMercado] = useState(50);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await api.post('/players', {
        nome,
        posicao,
        overall: Number(overall),
        valorMercado: Number(valorMercado),
        condicao: 'Apto',
      });

      setNome('');
      setPosicao('GOL');
      setOverall(70);
      setValorMercado(50);
      onJogadorCadastrado();
      onClose();
    } catch (err) {
      console.error('Erro ao cadastrar jogador:', err);
      setErro(err.response?.data?.message || 'Erro ao cadastrar o jogador.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f172a' }}>Cadastrar Jogador</h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>
          Adicione um novo jogador ao mercado geral.
        </p>

        {erro && <div style={styles.erroBox}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={styles.label}>Nome do jogador</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Lucas Ferraz"
              style={styles.input}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={styles.label}>Posição</label>
            <select
              value={posicao}
              onChange={(e) => setPosicao(e.target.value)}
              style={styles.input}
            >
              <option value="GOL">Goleiro (GOL)</option>
              <option value="ZAG">Zagueiro (ZAG)</option>
              <option value="LAT">Lateral (LAT)</option>
              <option value="MEI">Meio-campista (MEI)</option>
              <option value="ATA">Atacante (ATA)</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={styles.label}>Overall</label>
            <input
              type="number"
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
              style={styles.input}
              min="1"
              max="99"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Valor de Mercado (moedas)</label>
            <input
              type="number"
              value={valorMercado}
              onChange={(e) => setValorMercado(e.target.value)}
              style={styles.input}
              min="1"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} style={styles.btnCancelar} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" style={styles.btnSalvar} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Cadastrar'}
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