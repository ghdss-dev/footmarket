import React, { useEffect } from 'react';

export function ToastSucesso({ mensagem, submensagem, onClose }) {
  // Opcional: auto-fecha após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!mensagem) return null;

  return (
    <div style={styles.toastContainer}>
      <div style={styles.toastCard}>
        <div style={styles.iconCircle}>✓</div>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '13px', color: '#0f172a' }}>{mensagem}</strong>
          {submensagem && (
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              {submensagem}
            </p>
          )}
        </div>
        <button onClick={onClose} style={styles.btnClose}>✕</button>
      </div>
    </div>
  );
}

const styles = {
  toastContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1200,
  },
  toastCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxWidth: '360px',
  },
  iconCircle: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  btnClose: {
    border: 'none',
    background: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '14px',
  },
};