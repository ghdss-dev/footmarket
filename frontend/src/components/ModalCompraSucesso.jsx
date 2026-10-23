import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ModalCompraSucesso({ isOpen, onClose, dadosCompra }) {
  const navigate = useNavigate();

  if (!isOpen || !dadosCompra) return null;

  const { jogador, clube, resultado } = dadosCompra;
  const valorMercado = jogador?.valorMercado || 0;
  const taxa = valorMercado > 30 ? valorMercado * 0.05 : 0;
  const custoTotal = valorMercado + taxa;
  const novoCaixa = resultado?.novoCaixa ?? (clube?.caixa - custoTotal);

  const handleVerClube = () => {
    onClose();
    navigate(`/clubes/${clube?.id}`);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Cabeçalho de Sucesso */}
        <div style={styles.headerSuccess}>
          <div style={styles.checkCircle}>✓</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Compra concluída</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
              <b>{jogador?.nome}</b> agora é do <b>{clube?.nome}</b>.
            </p>
          </div>
        </div>

        {/* Resumo da Transação */}
        <div style={styles.summaryCard}>
          <div style={styles.row}>
            <span style={styles.label}>Valor</span>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{valorMercado.toFixed(2)}</strong>
              <div style={styles.subtext}>Valor de mercado no momento da compra</div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.label}>Taxa</span>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{taxa.toFixed(2)}</strong>
              <div style={styles.subtext}>5% de valor, porque passa de 30,00</div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.label}>Custo total</span>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{custoTotal.toFixed(2)}</strong>
              <div style={styles.subtext}>Valor + Taxa</div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.label}>Fim da fidelidade</span>
            <strong style={{ fontSize: '13px', color: '#0f172a' }}>{resultado?.fidelidadeAte || '12/11/2027, 15:00'}</strong>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.label}>Contrato</span>
            <span style={styles.badgeAtivo}>• ATIVO</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.label}>Novo caixa do {clube?.nome || 'Clube'}</span>
            <strong style={{ fontSize: '15px', color: '#16a34a' }}>{Number(novoCaixa).toFixed(2)}</strong>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div style={styles.footer}>
          <button type="button" onClick={handleVerClube} style={styles.btnSecundario}>
            Ver clube →
          </button>
          <button type="button" onClick={onClose} style={styles.btnPrimario}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 },
  modal: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', width: '480px', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
  headerSuccess: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  checkCircle: { backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' },
  summaryCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' },
  label: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  subtext: { fontSize: '10px', color: '#94a3b8' },
  divider: { height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' },
  badgeAtivo: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
  btnSecundario: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#334155' },
  btnPrimario: { padding: '8px 16px', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#fff' },
};