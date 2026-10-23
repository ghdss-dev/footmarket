import React, { useState } from 'react';
import { ToastSucesso } from './ToastSucesso';
import { api } from '../services/api';

export function AbaEscalacao({ clube }) {
  const [formacao, setFormacao] = useState(clube?.escalacao?.formacao || '2-1-1');
  
  const [titulares, setTitulares] = useState({
    goleiro: clube?.escalacao?.goleiro || '',
    defesa1: clube?.escalacao?.defesa1 || '',
    defesa2: clube?.escalacao?.defesa2 || '',
    meio: clube?.escalacao?.meio || '',
    ataque: clube?.escalacao?.ataque || '',
  });

  const [escalacaoSalva, setEscalacaoSalva] = useState(false);
  const [toastAtivo, setToastAtivo] = useState(false);
  const [erroRecusado, setErroRecusado] = useState('');

  const jogadores = clube?.jogadores || [];

  const handleSelectChange = (vaga, jogadorId) => {
    setTitulares((prev) => ({ ...prev, [vaga]: Number(jogadorId) }));
    setErroRecusado('');
    setEscalacaoSalva(false);
  };

  const idsTitulares = Object.values(titulares).filter(Boolean);
  const totalTitulares = idsTitulares.length;
  const escalacaoCompleta = totalTitulares === 5;

  const reservas = jogadores.filter((j) => !idsTitulares.includes(j.id));
  const getJogador = (id) => jogadores.find((j) => j.id === id);

  const jogadoresTitularesObjs = idsTitulares.map(id => getJogador(id)).filter(Boolean);
  const jogadorDoente = jogadoresTitularesObjs.find(j => j.condicao === 'Doente');
  const temMalCondicionados = jogadoresTitularesObjs.some(j => j.condicao === 'Mal condicionado');

  const handleSalvar = async () => {
    setErroRecusado('');

    if (jogadorDoente) {
      setErroRecusado(`${jogadorDoente.nome} está DOENTE e não pode ser escalado.`);
      setEscalacaoSalva(false);
      return;
    }

    if (escalacaoCompleta) {
      try {
        // Envia a escalação para o Backend via API
        await api.put(`/clubs/${clube.id}/lineup`, {
          formacao,
          ...titulares,
        });

        setEscalacaoSalva(true);
        setToastAtivo(true);
      } catch (error) {
        console.error('Erro ao guardar escalação no backend:', error);
        setErroRecusado(error.response?.data?.message || 'Erro ao comunicar com o servidor.');
      }
    }
  };

  return (
    <div>
      {toastAtivo && (
        <ToastSucesso
          mensagem="Escalação salva"
          submensagem={`Escalação salva na formação ${formacao}, com os 5 titulares.`}
          onClose={() => setToastAtivo(false)}
        />
      )}

      {erroRecusado && (
        <div style={styles.errorBanner}>
          <div style={styles.errorTitle}>🚫 A escalação foi recusada</div>
          <div style={styles.errorText}>{erroRecusado}</div>
        </div>
      )}

      {!escalacaoSalva && !escalacaoCompleta && !erroRecusado && (
        <div style={styles.warningBanner}>
          <div style={styles.warningTitle}>
            ⚠️ Escalação incompleta: o {clube?.nome || 'clube'} não pode jogar partidas
          </div>
          <div style={styles.warningText}>
            O elenco tem {jogadores.length} jogadores, e a escalação precisa de 5 titulares (1 goleiro e 4 de linha).
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        <div style={styles.mainCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>Titulares</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                1 goleiro e 4 jogadores de linha, na formação escolhida. Escale todos os 5 de uma vez.
              </p>
            </div>
            <span style={escalacaoSalva && escalacaoCompleta ? styles.statusCompleta : styles.statusIncompleta}>
              {escalacaoSalva && escalacaoCompleta ? '✓ Completa' : '⚠️ Incompleta'}
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={styles.sectionLabel}>Formação</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {[
                { id: '3-1', label: '3-1', desc: 'Defesa 3, Ataque 1' },
                { id: '2-2', label: '2-2', desc: 'Defesa 2, Ataque 2' },
                { id: '2-1-1', label: '2-1-1', desc: 'Defesa 2, Meio 1, Ataque 1' },
                { id: '1-2-1', label: '1-2-1', desc: 'Defesa 1, Meio 2, Ataque 1' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormacao(f.id)}
                  style={formacao === f.id ? styles.btnFormacaoActive : styles.btnFormacaoInactive}
                >
                  <b>{f.label}</b>
                  <span style={{ fontSize: '10px', display: 'block', opacity: 0.8 }}>{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: '11px' }}>
                <th style={{ padding: '8px' }}>Vaga</th>
                <th>Titular</th>
                <th>Condição</th>
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {[
                { vaga: 'Goleiro', pos: 'GOL', key: 'goleiro' },
                { vaga: 'Defesa', pos: 'ZAG ou LAT', key: 'defesa1' },
                { vaga: 'Defesa', pos: 'ZAG ou LAT', key: 'defesa2' },
                { vaga: 'Meio', pos: 'MEI', key: 'meio' },
                { vaga: 'Ataque', pos: 'ATA', key: 'ataque' },
              ].map((item, idx) => {
                const jAtual = getJogador(titulares[item.key]);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#334155' }}>{item.vaga}</td>
                    <td>
                      <select
                        value={titulares[item.key]}
                        onChange={(e) => handleSelectChange(item.key, e.target.value)}
                        style={styles.selectJogador}
                      >
                        <option value="">Selecione um jogador</option>
                        {jogadores.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.nome} ({j.posicao})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {jAtual && (
                        <span style={jAtual.condicao === 'Apto' ? styles.statusApto : styles.statusMal}>
                          • {jAtual.condicao}
                        </span>
                      )}
                    </td>
                    <td><b>{jAtual?.overall || '-'}</b></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {temMalCondicionados && (
            <div style={styles.warningBox}>
              ⚠️ Alguns titulares estão mal condicionados. Cada atributo varia 15% a menos durante a partida.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button style={styles.btnCancelar}>Cancelar</button>
            <button 
              style={{
                ...styles.btnSalvar,
                opacity: !escalacaoCompleta ? 0.6 : 1,
                cursor: !escalacaoCompleta ? 'not-allowed' : 'pointer'
              }}
              disabled={!escalacaoCompleta}
              onClick={handleSalvar}
            >
              ✓ Salvar escalação
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={styles.campoCard}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Em campo</div>
            <div style={styles.pitch}>
              <div style={styles.pitchArea}>
                <div style={{ ...styles.playerNode, top: '80%' }}><span>{getJogador(titulares.goleiro)?.nome?.split(' ')[0] || 'GOL'}</span></div>
                <div style={{ ...styles.playerNode, top: '55%', left: '30%' }}><span>{getJogador(titulares.defesa1)?.nome?.split(' ')[0] || 'DEF'}</span></div>
                <div style={{ ...styles.playerNode, top: '55%', left: '70%' }}><span>{getJogador(titulares.defesa2)?.nome?.split(' ')[0] || 'DEF'}</span></div>
                <div style={{ ...styles.playerNode, top: '35%' }}><span>{getJogador(titulares.meio)?.nome?.split(' ')[0] || 'MEI'}</span></div>
                <div style={{ ...styles.playerNode, top: '15%' }}><span>{getJogador(titulares.ataque)?.nome?.split(' ')[0] || 'ATA'}</span></div>
              </div>
            </div>
          </div>

          <div style={styles.reservasCard}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Reservas</div>
            {reservas.length === 0 ? (
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Nenhum reserva.</p>
            ) : (
              reservas.map((r) => (
                <div key={r.id} style={styles.reservaItem}>
                  <div>
                    <strong style={{ fontSize: '12px', color: '#0f172a' }}>{r.nome}</strong>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{r.posicao} · {r.condicao}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: r.condicao === 'Doente' ? '#dc2626' : '#2563eb', fontWeight: 'bold' }}>
                    {r.condicao === 'Doente' ? '• Doente' : '+ Reserva'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  errorBanner: { backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' },
  errorTitle: { color: '#991b1b', fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' },
  errorText: { color: '#b91c1c', fontSize: '12px' },
  warningBanner: { backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' },
  warningTitle: { color: '#92400e', fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' },
  warningText: { color: '#b45309', fontSize: '12px', lineHeight: '1.4' },
  mainCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' },
  sectionLabel: { fontSize: '12px', fontWeight: 'bold', color: '#0f172a' },
  statusCompleta: { backgroundColor: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px' },
  statusIncompleta: { backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px' },
  btnFormacaoActive: { flex: 1, padding: '8px', border: '2px solid #2563eb', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '6px', cursor: 'pointer', textAlign: 'center' },
  btnFormacaoInactive: { flex: 1, padding: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', borderRadius: '6px', cursor: 'pointer', textAlign: 'center' },
  selectJogador: { width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#fff' },
  statusApto: { color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' },
  statusMal: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' },
  warningBox: { backgroundColor: '#fef3c7', border: '1px solid #fcd34d', color: '#78350f', padding: '10px', borderRadius: '6px', fontSize: '11px', marginTop: '12px' },
  btnCancelar: { padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  btnSalvar: { padding: '8px 16px', border: 'none', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  campoCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' },
  pitch: { backgroundColor: '#15803d', borderRadius: '8px', height: '220px', position: 'relative', overflow: 'hidden', padding: '10px' },
  pitchArea: { border: '1px solid rgba(255,255,255,0.4)', height: '100%', borderRadius: '4px', position: 'relative' },
  playerNode: { position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#2563eb', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' },
  reservasCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' },
  reservaItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' },
};