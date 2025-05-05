import React, { useState } from 'react';
import styles from '../register/register.module.css';

interface Contact {
  numeroTelefone: string;
  nomeDaSecretariaTelefone: string;
  principal: boolean;
  whatsapp: boolean;
}

interface ContactFormProps {
  onAdd: (contact: Contact) => void;
  onRemove: (index: number) => void;
  contacts: Contact[];
}

export default function ContactForm({ onAdd, onRemove, contacts }: ContactFormProps) {
  const [newContact, setNewContact] = useState<Contact>({
    numeroTelefone: '',
    nomeDaSecretariaTelefone: '',
    principal: false,
    whatsapp: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContact.numeroTelefone) {
      return;
    }

    // Remove formatação do telefone antes de adicionar
    const numeroTelefone = newContact.numeroTelefone.replace(/\D/g, '');
    if (numeroTelefone.length < 10) {
      return;
    }

    const contactToAdd = {
      ...newContact,
      numeroTelefone: formatPhoneNumber(numeroTelefone)
    };

    onAdd(contactToAdd);
    
    setNewContact({
      numeroTelefone: '',
      nomeDaSecretariaTelefone: '',
      principal: false,
      whatsapp: false
    });
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <div>
      <div className={styles.contactForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newContact.numeroTelefone}
            onChange={(e) => setNewContact({
              ...newContact,
              numeroTelefone: formatPhoneNumber(e.target.value)
            })}
            placeholder="Telefone"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newContact.nomeDaSecretariaTelefone}
            onChange={(e) => setNewContact({
              ...newContact,
              nomeDaSecretariaTelefone: e.target.value
            })}
            placeholder="Nome da Secretária"
            className={styles.input}
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={newContact.principal}
              onChange={(e) => setNewContact({
                ...newContact,
                principal: e.target.checked
              })}
            />
            Principal
          </label>

          <label>
            <input
              type="checkbox"
              checked={newContact.whatsapp}
              onChange={(e) => setNewContact({
                ...newContact,
                whatsapp: e.target.checked
              })}
            />
            WhatsApp
          </label>
        </div>

        <button 
          type="button"
          onClick={handleSubmit}
          className={styles.addButton}
          disabled={!newContact.numeroTelefone}
        >
          Adicionar Contato
        </button>
      </div>

      {contacts.length > 0 && (
        <div className={styles.contactsList}>
          <h4>Contatos Adicionados</h4>
          {contacts.map((contact, index) => (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactInfo}>
                <span>{contact.numeroTelefone}</span>
                {contact.nomeDaSecretariaTelefone && (
                  <span> - {contact.nomeDaSecretariaTelefone}</span>
                )}
                {contact.principal && <span className={styles.badge}>Principal</span>}
                {contact.whatsapp && <span className={styles.badge}>WhatsApp</span>}
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className={styles.removeButton}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 