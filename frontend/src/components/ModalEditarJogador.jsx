import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ModalEditarJogador({ isOpen, onClose, jogador, onJogadorAtualizado }) {
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('MEI');
  const [idade, setIdade] = useState('');
  const [agilidade, setAgilidade] = useState('');

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (jogador) {
      setNome(jogador.nome || '');
      setPosicao(jogador.posicao || 'MEI');
      setIdade(jogador.idade || '');
      setAgilidade(jogador.agilidade || '');
      setErros({});
    }
  }, [jogador]);

  if (!isOpen || !jogador) return null;

  const possuiClube = !!jogador.clubeNome;

  const validarCampos = () => {
    const novosErros = {};
    const partesNome = nome.trim().split(' ').filter(Boolean);

    if (!nome.trim()) {
      novosErros.nome = 'Informe o nome.';
    } else if (nome.length < 3 || nome.length > 100 || partesNome.length < 2) {
      novosErros.nome = 'Use de 3 a 100 caracteres com pelo menos duas palavras.';
    }

    const numIdade = Number(idade);
    if (!idade || isNaN(numIdade) || numIdade < 18 || numIdade > 45) {
      novosErros.idade = 'Use uma idade de 18 a 45 anos.';
    } else if (numIdade < jogador.idade) {
      novosErros.idade = `Não é possível diminuir a idade (atual: ${jogador.idade}).`;
    }

    const numAgilidade = Number(agilidade);
    if (!agilidade || isNaN(numAgilidade) || numAgilidade < 1 || numAgilidade > 100) {
      novosErros.agilidade = 'De 1 a 100.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    try {
      await api.put(`/players/${jogador.id}`, {
        nome,
        posicao,
        idade: Number(idade),
        agilidade: Number(agilidade),
      });

      onJogadorAtualizado();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar jogador:', err);
      alert('Erro ao atualizar dados do jogador na API.');
    }
  };

  const posicoes = [
    { sigla: 'GOL', label: 'Goleiro' },
    { sigla: 'ZAG', label: 'Zagueiro' },
    { sigla: 'LAT', label: 'Lateral' },
    { sigla: 'MEI', label: 'Meio-campo' },
    { sigla: 'ATA', label: 'Atacante' },
  ];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Editar jogador</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
              Edite nome, posição, idade e agilidade. Os demais dados não mudam.
            </p>
          </div>
          <button onClick={onClose} style={styles.btnClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                ...styles.input,
                borderColor: erros.nome ? '#dc2626' : '#cbd5e1',
              }}
            />
            {erros.nome ? (
              <span style={styles.errorText}>🛑 {erros.nome}</span>
            ) : (
              <span style={styles.helpText}>De 3 a 100 caracteres, com pelo menos duas palavras e sem números.</span>
            )}
          </div>

          {/* Posição */}
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Posição</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {posicoes.map((p) => {
                const desabilitada = possuiClube && p.sigla !== jogador.posicao;
                const selecionada = posicao === p.sigla;

                return (
                  <button
                    key={p.sigla}
                    type="button"
                    disabled={desabilitada}
                    onClick={() => setPosicao(p.sigla)}
                    style={{
                      ...styles.btnPosicao,
                      backgroundColor: selecionada ? '#eff6ff' : '#fff',
                      borderColor: selecionada ? '#2563eb' : '#cbd5e1',
                      color: selecionada ? '#2563eb' : '#334155',
                      opacity: desabilitada ? 0.4 : 1,
                      cursor: desabilitada ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{p.sigla}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{p.label}</div>
                  </button>
                );
              })}
            </div>
            {possuiClube && (
              <span style={styles.helpText}>
                Jogador com clube não muda de posição; as outras posições ficam desabilitadas.
              </span>
            )}
          </div>

          {/* Idade e Agilidade */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={styles.label}>Idade</label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                style={{
                  ...styles.input,
                  borderColor: erros.idade ? '#dc2626' : '#cbd5e1',
                }}
              />
              {erros.idade ? (
                <span style={styles.errorText}>🛑 {erros.idade}</span>
              ) : (
                <span style={styles.helpText}>De 18 a 45, sem diminuir (atual: {jogador.idade}).</span>
              )}
            </div>

            <div>
              <label style={styles.label}>Agilidade</label>
              <input
                type="number"
                value={agilidade}
                onChange={(e) => setAgilidade(e.target.value)}
                style={{
                  ...styles.input,
                  borderColor: erros.agilidade ? '#dc2626' : '#cbd5e1',
                }}
              />
              {erros.agilidade ? (
                <span style={styles.errorText}>🛑 {erros.agilidade}</span>
              ) : (
                <span style={styles.helpText}>De 1 a 100 (até 85 com 35 anos ou mais).</span>
              )}
            </div>
          </div>

          {/* Aviso sobre atributos fixos */}
          <div style={styles.noticeBox}>
            🔒 Não mudam depois do cadastro: valor base ({jogador.valorBase ? jogador.valorBase.toFixed(2) : '0.00'}), indicadores e potencial.
          </div>

          {/* Rodapé */}
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.btnCancel}>Cancelar</button>
            <button type="submit" style={styles.btnSave}>Salvar alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  btnClose: { border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '4px' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid', fontSize: '13px', boxSizing: 'border-box' },
  helpText: { fontSize: '11px', color: '#94a3b8', marginTop: '2px', display: 'block' },
  errorText: { fontSize: '11px', color: '#dc2626', marginTop: '2px', display: 'block', fontWeight: '500' },
  btnPosicao: { flex: 1, padding: '8px 4px', border: '1px solid', borderRadius: '6px', textAlign: 'center' },
  noticeBox: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '6px', fontSize: '11px', color: '#64748b', marginBottom: '20px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' },
  btnCancel: { padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnSave: { padding: '8px 16px', border: 'none', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
};