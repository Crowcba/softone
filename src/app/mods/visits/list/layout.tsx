import React from 'react';
import styles from './table.module.css';

export default function VisitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Lista de Visitas</h1>
      </div>
      {children}
    </div>
  );
} 