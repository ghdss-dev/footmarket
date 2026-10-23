import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function ModalNovoJogador({ isOpen, onClose, onJogadorCriado }) {
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('MEI');
  const [idade, setIdade] = useState('23');
  const [agilidade, setAgilidade] = useState('70');

  // Indicadores técnicos
  const [velocidade, setVelocidade] = useState('66');
  const [finalizacao, setFinalizacao] = useState('62');
  const [passe, setPasse] = useState('74');
  const [drible, setDrible] = useState('70');
  const [defesa, setDefesa] = useState('48');
  const [fisico, setFisico] = useState('58');
  const [potencial, setPotencial] = useState('82');

  // Estado para guardar as mensagens de erro de cada campo
  const [erros, setErros] = useState({});
  const [tentouSalvar, setTentouSalvar] = useState(false);

  // Função para validar os campos
  const validarCampos = () => {
    const novosErros = {};

    // Validar Nome
    const partesNome = nome.trim().split(' ').filter(Boolean);
    if (!nome.trim()) {
      novosErros.nome = 'Informe o nome.';
    } else if (nome.length < 3 || nome.length > 100 || partesNome.length < 2) {
      novosErros.nome = 'Use de 3 a 100 caracteres com pelo menos duas palavras.';
    }

    // Validar Idade (18 a 45)
    const numIdade = Number(idade);
    if (!idade) {
      novosErros.idade = 'Informe a idade.';
    } else if (isNaN(numIdade) || numIdade < 18 || numIdade > 45) {
      novosErros.idade = 'Use uma idade de 18 a 45 anos.';
    }

    // Validar Agilidade (1 a 100)
    const numAgilidade = Number(agilidade);
    if (!agilidade || isNaN(numAgilidade) || numAgilidade < 1 || numAgilidade > 100) {
      novosErros.agilidade = 'Use um valor de 1 a 100.';
    }

    // Validar Atributos (1 a 99)
    const validarAtributo = (val, campo) => {
      const num = Number(val);
      if (!val) {
        novosErros[campo] = 'Obrigatório.';
      } else if (isNaN(num) || num < 1 || num > 99) {
        novosErros[campo] = 'Use um valor de 1 a 99.';
      }
    };

    validarAtributo(velocidade, 'velocidade');
    validarAtributo(finalizacao, 'finalizacao');
    validarAtributo(passe, 'passe');
    validarAtributo(drible, 'drible');
    validarAtributo(defesa, 'defesa');
    validarAtributo(fisico, 'fisico');

    // Validar Potencial
    if (!potencial) {
      novosErros.potencial = 'Informe o potencial.';
    } else {
      validarAtributo(potencial, 'potencial');
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Revalida sempre que algum valor muda (se o utilizador já submeteu uma vez)
  useEffect(() => {
    if (tentouSalvar) {
      validarCampos();
    }
  }, [nome, idade, agilidade, velocidade, finalizacao, passe, drible, defesa, fisico, potencial]);

  if (!isOpen) return null;

  // Altere o manipulador do formulário no ModalNovoJogador.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTentouSalvar(true);

    if (!validarCampos()) return;

    try {
      // 1. Envia os dados para a API Spring Boot no Docker
      const response = await api.post('/players', {
        nome,
        posicao,
        idade: Number(idade),
        agilidade: Number(agilidade),
        velocidade: Number(velocidade),
        finalizacao: Number(finalizacao),
        passe: Number(passe),
        drible: Number(drible),
        defesa: Number(defesa),
        fisico: Number(fisico),
        potencial: Number(potencial),
      });

      // 2. Passa os dados calculados retornados pelo Spring Boot
      onJogadorCriado(response.data);
      onClose();
    } catch (err) {
      console.error('Erro na comunicação com a API:', err);
      alert('Erro ao conectar com o servidor Spring Boot.');
    }
  };

  const temErros = Object.keys(erros).length > 0;

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
        {/* Cabeçalho */}
        <div style={styles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Novo jogador</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: temErros ? '#dc2626' : '#64748b' }}>
              {temErros ? 'Corrija os campos destacados para salvar.' : 'Preencha os dados e os indicadores técnicos.'}
            </p>
          </div>
          <button onClick={onClose} style={styles.btnClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* Formulário Principal */}
            <div style={{ flex: 1 }}>
              {/* Nome */}
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Nome</label>
                <input
                  type="text"
                  placeholder="Ex: Davi Melo"
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
                  {posicoes.map((p) => (
                    <button
                      key={p.sigla}
                      type="button"
                      onClick={() => setPosicao(p.sigla)}
                      style={{
                        ...styles.btnPosicao,
                        backgroundColor: posicao === p.sigla ? '#eff6ff' : '#fff',
                        borderColor: posicao === p.sigla ? '#2563eb' : '#cbd5e1',
                        color: posicao === p.sigla ? '#2563eb' : '#334155',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{p.sigla}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Idade, Agilidade, Valor Base */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
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
                    <span style={styles.helpText}>De 18 a 45 anos.</span>
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
                    <span style={styles.helpText}>De 1 a 100.</span>
                  )}
                </div>

                <div>
                  <label style={styles.label}>Valor base (moedas)</label>
                  <input
                    type="text"
                    disabled
                    value="🔒 Após salvar"
                    style={{ ...styles.input, backgroundColor: '#f1f5f9', color: '#94a3b8' }}
                  />
                  <span style={styles.helpText}>Calculado no cadastro.</span>
                </div>
              </div>

              {/* Indicadores Técnicos */}
              <h4 style={{ margin: '16px 0 4px', fontSize: '14px', fontWeight: 'bold' }}>Indicadores técnicos</h4>
              <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#64748b' }}>
                Seis atributos e o potencial, de 1 a 99.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={styles.label}>Velocidade</label>
                  <input
                    type="number"
                    value={velocidade}
                    onChange={(e) => setVelocidade(e.target.value)}
                    style={{ ...styles.input, borderColor: erros.velocidade ? '#dc2626' : '#cbd5e1' }}
                  />
                  {erros.velocidade && <span style={styles.errorText}>🛑 {erros.velocidade}</span>}
                </div>
                <div>
                  <label style={styles.label}>Finalização</label>
                  <input
                    type="number"
                    value={finalizacao}
                    onChange={(e) => setFinalizacao(e.target.value)}
                    style={{ ...styles.input, borderColor: erros.finalizacao ? '#dc2626' : '#cbd5e1' }}
                  />
                  {erros.finalizacao && <span style={styles.errorText}>🛑 {erros.finalizacao}</span>}
                </div>
                <div>
                  <label style={styles.label}>Passe</label>
                  <input
                    type="number"
                    value={passe}
                    onChange={(e) => setPasse(e.target.value)}
                    style={{ ...styles.input, borderColor: erros.passe ? '#dc2626' : '#cbd5e1' }}
                  />
                  {erros.passe && <span style={styles.errorText}>🛑 {erros.passe}</span>}
                </div>
                <div>
                  <label style={styles.label}>Drible</label>
                  <input
                    type="number"
                    value={drible}
                    onChange={(e) => setDrible(e.target.value)}
                    style={{ ...styles.input, borderColor: erros.drible ? '#dc2626' : '#cbd5e1' }}
                  />
                  {erros.drible && <span style={styles.errorText}>🛑 {erros.drible}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={styles.label}>Defesa</label>
                  <input
                    type="number"
                    value={defesa}
                    onChange={(e) => setDefesa(e.target.value)}
                    style={{ ...styles.input, borderColor: erros.defesa ? '#dc2626' : '#cbd5e1' }}
                  />
                  {erros.defesa && <span style={styles.errorText}>🛑 {erros.defesa}</span>}
                </div>
                <div>
                  <label style={styles.label}>Físico</label>
                  <input
                    type="number"
                    value={fisico}
                    onChange={(e) => setFisico(e.target.value)}
                    style={{ ...styles.input, borderColor: erros.fisico ? '#dc2626' : '#cbd5e1' }}
                  />
                  {erros.fisico && <span style={styles.errorText}>🛑 {erros.fisico}</span>}
                </div>
                <div>
                  <label style={styles.label}>Potencial</label>
                  <input
                    type="number"
                    value={potencial}
                    onChange={(e) => setPotencial(e.target.value)}
                    style={{ ...styles.input, borderColor: erros.potencial ? '#dc2626' : '#cbd5e1' }}
                  />
                  {erros.potencial && <span style={styles.errorText}>🛑 {erros.potencial}</span>}
                </div>
                <div>
                  <label style={styles.label}>Overall</label>
                  <input
                    type="text"
                    disabled
                    value="🔒 Após salvar"
                    style={{ ...styles.input, backgroundColor: '#f1f5f9', color: '#94a3b8' }}
                  />
                </div>
              </div>
            </div>

            {/* Prévia dos Atributos / Estado de Erro na Prévia */}
            <div style={styles.previewBox}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '12px' }}>
                Prévia dos atributos
              </div>

              {temErros ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '11px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
                  Corrija os valores destacados para ver a prévia.
                </div>
              ) : (
                <>
                  <BarraStat label="Velocidade" val={velocidade} />
                  <BarraStat label="Finalização" val={finalizacao} />
                  <BarraStat label="Passe" val={passe} />
                  <BarraStat label="Drible" val={drible} />
                  <BarraStat label="Defesa" val={defesa} />
                  <BarraStat label="Físico" val={fisico} />
                </>
              )}
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div style={styles.footer}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>ℹ O jogador começa Livre e Apto.</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={onClose} style={styles.btnCancel}>Cancelar</button>
              <button type="submit" style={styles.btnSave}>Salvar jogador</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function BarraStat({ label, val }) {
  const percent = Math.min(Math.max(Number(val) || 0, 0), 100);
  return (
    <div style={{ marginBottom: '8px', fontSize: '11px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155', marginBottom: '2px' }}>
        <span>{label}</span>
        <b>{val || 0}</b>
      </div>
      <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: '#2563eb' }}></div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  btnClose: { border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '4px' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid', fontSize: '13px', boxSizing: 'border-box' },
  helpText: { fontSize: '10px', color: '#94a3b8', marginTop: '2px', display: 'block' },
  errorText: { fontSize: '10px', color: '#dc2626', marginTop: '2px', display: 'block', fontWeight: '500' },
  btnPosicao: { flex: 1, padding: '8px 4px', border: '1px solid', borderRadius: '6px', cursor: 'pointer', textAlign: 'center' },
  previewBox: { width: '180px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' },
  btnCancel: { padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnSave: { padding: '8px 16px', border: 'none', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
};