import React from 'react';

export function ModalDetalhesJogador({ 
  isOpen, 
  onClose, 
  jogador, 
  onEditar, 
  onAlterarCondicao, 
  onComprar 
}) {
  if (!isOpen || !jogador) return null;

  const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const indicadores = [
    { label: 'Velocidade', val: jogador.velocidade || 50 },
    { label: 'Finalização', val: jogador.finalizacao || 50 },
    { label: 'Passe', val: jogador.passe || 50 },
    { label: 'Drible', val: jogador.drible || 50 },
    { label: 'Defesa', val: jogador.defesa || 50 },
    { label: 'Físico', val: jogador.fisico || 50 },
  ];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Botão Fechar */}
        <button onClick={onClose} style={styles.btnClose}>✕</button>

        {/* Cabeçalho do Jogador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={styles.avatar}>{getIniciais(jogador.nome)}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{jogador.nome}</h3>
            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
              <span>{jogador.posicao}</span>
              <span>•</span>
              <span style={{ color: jogador.condicao === 'Apto' ? '#16a34a' : '#dc2626' }}>
                {jogador.condicao}
              </span>
              <span>•</span>
              <span>{jogador.clubeNome || 'Livre'}</span>
            </div>
          </div>
        </div>

        {/* Blocos de Valor */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={styles.infoCard}>
            <div style={styles.cardLabel}>Valor de mercado</div>
            <div style={styles.cardValue}>
              {jogador.valorMercado ? jogador.valorMercado.toFixed(2) : '0.00'}
            </div>
            <div style={styles.cardSub}>Calculado automaticamente</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.cardLabel}>Valor base</div>
            <div style={styles.cardValue}>
              {jogador.valorBase ? jogador.valorBase.toFixed(2) : '0.00'}
            </div>
            <div style={styles.cardSub}>Calculado no cadastro</div>
          </div>
        </div>

        {/* Blocos de Overall e Potencial */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={styles.infoCard}>
            <div style={styles.cardLabel}>Overall</div>
            <div style={{ ...styles.cardValue, fontSize: '22px' }}>{jogador.overall}</div>
            <div style={styles.cardSub}>Calculado pela posição</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.cardLabel}>Potencial</div>
            <div style={{ ...styles.cardValue, fontSize: '22px' }}>{jogador.potencial || '--'}</div>
            <div style={styles.cardSub}>Informado no cadastro</div>
          </div>
        </div>

        {/* Indicadores Técnicos */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <strong style={{ fontSize: '13px', color: '#0f172a' }}>Indicadores técnicos</strong>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Escala de 1 a 99</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {indicadores.map((ind) => (
              <div key={ind.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '80px', fontSize: '12px', color: '#475569' }}>{ind.label}</span>
                <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(ind.val, 100)}%`, height: '100%', backgroundColor: '#2563eb' }} />
                </div>
                <span style={{ width: '24px', fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>{ind.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Informações Complementares */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginBottom: '24px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#64748b' }}>Idade</span>
            <strong>{jogador.idade} anos</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#64748b' }}>Agilidade</span>
            <strong>{jogador.agilidade}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#64748b' }}>Clube</span>
            <strong>{jogador.clubeNome || 'Livre'}</strong>
          </div>
        </div>

        {/* Ações do Rodapé */}
        <div style={styles.footer}>
          <button 
            onClick={() => { onClose(); onEditar(jogador); }} 
            style={styles.btnSecondary}
          >
            ✏️ Editar
          </button>
          <button 
            onClick={() => { onClose(); onAlterarCondicao(jogador); }} 
            style={styles.btnSecondary}
          >
            🛡️ Alterar condição
          </button>
          {!jogador.clubeNome && (
            <button 
              onClick={() => { onClose(); onComprar(jogador); }} 
              style={styles.btnPrimary}
            >
              🛒 Comprar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 },
  modal: { backgroundColor: '#fff', width: '100%', maxWidth: '420px', height: '100vh', padding: '24px', boxSizing: 'border-box', overflowY: 'auto', position: 'relative' },
  btnClose: { position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' },
  avatar: { backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  infoCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' },
  cardLabel: { fontSize: '11px', color: '#64748b', fontWeight: '500' },
  cardValue: { fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0' },
  cardSub: { fontSize: '10px', color: '#94a3b8' },
  footer: { display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' },
  btnSecondary: { padding: '8px 12px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  btnPrimary: { padding: '8px 16px', border: 'none', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }
};