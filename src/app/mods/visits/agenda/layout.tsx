import React from 'react';
import styles from './table.module.css';

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Agenda de Visitas</h1>
      </div>
      {children}
    </div>
  );
} 