import { useState, useEffect } from 'react';

/**
 * Hook para persistir dados no localStorage com tipagem
 * @param key Chave para armazenamento no localStorage
 * @param initialValue Valor inicial caso nada seja encontrado
 * @returns Estado gerenciado que persiste no localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Inicializar com o valor do localStorage ou valor default
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(`Erro ao buscar ${key} do localStorage:`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Função para atualizar o valor no localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir valor como função (igual ao useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salvar no estado
      setStoredValue(valueToStore);
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
} 