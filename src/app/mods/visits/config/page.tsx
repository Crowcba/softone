"use client";

import React, { useState } from "react";
import styles from "./table.module.css";

export default function ConfigPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Configurações</h1>
        <div className={styles.searchContainer}>
          {/* Aqui serão adicionados os controles de configuração */}
        </div>
      </header>

      <main>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Carregando...</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            {/* Aqui será adicionado o conteúdo da configuração */}
            <div className={styles.configSection}>
              <h2>Configurações Gerais</h2>
              <p>Em breve...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
