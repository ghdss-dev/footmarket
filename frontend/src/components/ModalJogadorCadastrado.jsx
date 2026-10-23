import React from 'react';

export function ModalJogadorCadastrado({ isOpen, onClose, jogador }) {
  if (!isOpen || !jogador) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Ícone de Sucesso */}
        <div style={styles.successIcon}>✓</div>

        <h3 style={{ margin: '16px 0 4px', fontSize: '18px', fontWeight: 'bold' }}>
          Jogador cadastrado
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#64748b' }}>
          <b>{jogador.nome}</b> entrou Livre e Apto. Valores em moedas, calculados pela API ao salvar.
        </p>

        {/* Card de Valores Calculados pelo Spring Boot */}
        <div style={styles.valuesCard}>
          <div style={styles.valueRow}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Valor base</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Calculado no cadastro; não muda depois</div>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {jogador.valorBase ? jogador.valorBase.toFixed(2) : '0.00'}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />

          <div style={styles.valueRow}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Valor de mercado</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Com condição, agilidade e idade</div>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {jogador.valorMercado ? jogador.valorMercado.toFixed(2) : '0.00'}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />

          <div style={styles.valueRow}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Overall</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Pelos pesos da posição {jogador.posicao}</div>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2563eb' }}>
              {jogador.overall}
            </div>
          </div>
        </div>

        {/* Botões do Rodapé */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
          <button onClick={onClose} style={styles.btnSecondary}>Ver detalhes</button>
          <button onClick={onClose} style={styles.btnPrimary}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '440px', width: '100%', textAlign: 'center' },
  successIcon: { backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '20px', fontWeight: 'bold' },
  valuesCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', textAlign: 'left' },
  valueRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  btnSecondary: { padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  btnPrimary: { padding: '8px 16px', border: 'none', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
};