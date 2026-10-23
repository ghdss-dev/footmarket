import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        navigate('/jogadores');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoBadge}>
          <div style={styles.logoIcon}>P</div>
          <span style={styles.logoText}>Passe</span>
        </div>

        <div style={styles.tag}>
          <span style={styles.dot}></span> Liga Fictícia 2026 · <small>líder: Delta FC, 6 pontos</small>
        </div>

        <h1 style={styles.title}>Gestão da liga, do mercado à classificação</h1>
        <p style={styles.subtitle}>
          Cadastre jogadores, monte os clubes e negocie com contrato de fidelidade. Depois, escale os titulares e jogue partidas com placar calculated pelos atributos.
        </p>

        <div style={styles.actionArea}>
          <button style={styles.btnIniciar} onClick={() => navigate('/jogadores')}>
            Iniciar →
          </button>
          <span style={styles.shortcutText}>ou tecle <kbd style={styles.kbd}>Enter</kbd></span>
        </div>

        <div style={styles.statsRow}>
          <span>👥 <b>23</b> jogadores</span> · 
          <span>👥 <b>7</b> livres</span> · 
          <span>🛡️ <b>6</b> clubes</span> · 
          <span>⚽ <b>2</b> partidas</span> · 
          <span>⏱️ Não precisa de login</span>
        </div>

        <div style={styles.stepsGrid}>
          <div style={styles.stepCard}><b>01 Jogadores</b><p>Nascem livres e Apto; o valor de mercado vem da condição, agilidade e idade.</p></div>
          <div style={styles.stepCard}><b>02 Clubes</b><p>Começam com 300,00 em caixa e sem jogadores.</p></div>
          <div style={styles.stepCard}><b>03 Compra</b><p>Valor + taxa, até 50% do caixa, com contrato de fidelidade.</p></div>
          <div style={styles.stepCard}><b>04 Venda</b><p>Multa antes do fim da fidelidade e comissão sobre o lucro.</p></div>
          <div style={styles.stepCard}><b>05 Histórico</b><p>Toda compra e venda fica registrada, com totais e CSV.</p></div>
          <div style={styles.stepCard}><b>06 Liga</b><p>Escale 5 titulares e jogue partidas que entram na classificação.</p></div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f4f5f7', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '900px', width: '100%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  logoBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' },
  logoIcon: { backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: '24px', fontWeight: 'bold', color: '#1e293b' },
  tag: { fontSize: '13px', color: '#64748b', marginBottom: '20px' },
  dot: { height: '8px', width: '8px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'inline-block', marginRight: '4px' },
  title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' },
  subtitle: { fontSize: '15px', color: '#475569', maxWidth: '650px', margin: '0 auto 28px', lineHeight: '1.5' },
  actionArea: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  btnIniciar: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  shortcutText: { fontSize: '14px', color: '#94a3b8' },
  kbd: { backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px', fontSize: '12px' },
  statsRow: { fontSize: '13px', color: '#64748b', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', marginBottom: '28px' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', textAlign: 'left' },
  stepCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '12px' }
};