import React, { useState, useRef, useEffect } from 'react';

export function MenuAcoesJogador({ jogador, onDetalhes, onEditar, onAlterarCondicao, onComprar, onExcluir }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.btnDots}
        title="Mais ações"
      >
        •••
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.headerName}>{jogador.nome}</div>

          <button
            style={styles.menuItem}
            onClick={() => { setIsOpen(false); onDetalhes && onDetalhes(jogador); }}
          >
            👁 Ver detalhes
          </button>

          <button
            style={styles.menuItem}
            onClick={() => { setIsOpen(false); onEditar(jogador); }}
          >
            ✏️ Editar
          </button>

          <button
            style={styles.menuItem}
            onClick={() => { setIsOpen(false); onAlterarCondicao(jogador); }}
          >
            🛡️ Alterar condição
          </button>

          <hr style={styles.divider} />

          {!jogador.clubeId && !jogador.clubeNome && (
            <button
              style={styles.menuItem}
              onClick={() => { setIsOpen(false); onComprar(jogador); }}
            >
              🛒 Comprar
            </button>
          )}

          <button
            style={{ ...styles.menuItem, color: '#dc2626' }}
            onClick={() => { setIsOpen(false); onExcluir(jogador); }}
          >
            🗑 Excluir
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  btnDots: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#64748b',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    width: '180px',
    padding: '6px 0',
    textAlign: 'left',
  },
  headerName: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#94a3b8',
    padding: '6px 12px',
    borderBottom: '1px solid #f1f5f9',
  },
  menuItem: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#334155',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'left',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f1f5f9',
    margin: '4px 0',
  },
};