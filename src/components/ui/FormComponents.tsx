'use client';

import React, { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes } from 'react';
import styles from './FormComponents.module.scss';

// TIPOS
type FormContainerProps = {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  isNested?: boolean;
};

type FormHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

type FormSectionProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

type FormGridProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
};

type FormGroupProps = {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
};

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  className?: string;
}

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface FormDateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  className?: string;
}

type FormOptionProps = {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
};

type FormSelectSearchProps = {
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

type FormRadioGroupProps = {
  children: ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
};

interface FormRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  className?: string;
}

type FormInfoProps = {
  children: ReactNode;
  type?: 'info' | 'warning' | 'success';
  className?: string;
};

type FormErrorProps = {
  children: ReactNode;
  className?: string;
};

// COMPONENTES
export const FormContainer: React.FC<FormContainerProps> = ({ children, onSubmit, className, isNested = false }) => {
  if (isNested) {
    return <div className={`${styles.formContainer} ${className || ''}`}>{children}</div>;
  }
  
  return (
    <form onSubmit={onSubmit} className={`${styles.formContainer} ${className || ''}`}>
      {children}
    </form>
  );
};

export const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle, actions, className }) => (
  <div className={`${styles.formHeader} ${className || ''}`}>
    <div className={styles.formHeaderContent}>
      <h1 className={styles.formTitle}>{title}</h1>
      {subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}
    </div>
    {actions && <div className={styles.formActions}>{actions}</div>}
  </div>
);

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className }) => (
  <section className={`${styles.formSection} ${className || ''}`}>
    {title && <h2 className={styles.formSectionTitle}>{title}</h2>}
    <div className={styles.formSectionContent}>{children}</div>
  </section>
);

export const FormGrid: React.FC<FormGridProps> = ({ children, cols = 1, className }) => (
  <div 
    className={`${styles.formGrid} ${styles[`formGridCols${cols}`]} ${className || ''}`}
  >
    {children}
  </div>
);

export const FormGroup: React.FC<FormGroupProps> = ({ children, fullWidth, className }) => (
  <div 
    className={`${styles.formGroup} ${fullWidth ? styles.formGroupFullWidth : ''} ${className || ''}`}
  >
    {children}
  </div>
);

export const FormLabel: React.FC<FormLabelProps> = ({ children, required, className, ...props }) => (
  <label className={`${styles.formLabel} ${className || ''}`} {...props}>
    {children} {required && <span className={styles.formRequired}>*</span>}
  </label>
);

export const FormButton: React.FC<FormButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth,
  className,
  ...props 
}) => (
  <button 
    className={`
      ${styles.formButton} 
      ${styles[`formButton${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} 
      ${styles[`formButton${size.charAt(0).toUpperCase() + size.slice(1)}`]}
      ${fullWidth ? styles.formButtonFullWidth : ''}
      ${className || ''}
    `} 
    {...props}
  >
    {children}
  </button>
);

export const FormInput: React.FC<FormInputProps> = ({ className, ...props }) => (
  <input className={`${styles.formInput} ${className || ''}`} {...props} />
);

export const FormDateInput: React.FC<FormDateInputProps> = ({ className, ...props }) => (
  <input 
    type="date" 
    className={`${styles.formInput} ${styles.formDateInput} ${className || ''}`} 
    {...props} 
  />
);

export const FormSelect: React.FC<FormSelectProps> = ({ children, className, ...props }) => (
  <select className={`${styles.formSelect} ${className || ''}`} {...props}>
    {children}
  </select>
);

export const FormOption: React.FC<FormOptionProps> = ({ 
  children, 
  value, 
  disabled, 
  className 
}) => (
  <option 
    value={value} 
    disabled={disabled} 
    className={className}
  >
    {children}
  </option>
);

export const FormSelectSearch: React.FC<FormSelectSearchProps> = ({ 
  options, 
  value, 
  onChange, 
  name, 
  id, 
  placeholder, 
  disabled,
  className 
}) => (
  <select 
    id={id} 
    name={name} 
    value={value} 
    onChange={onChange} 
    disabled={disabled}
    className={`${styles.formSelect} ${styles.formSelectSearch} ${className || ''}`}
  >
    {placeholder && <option value="" disabled>{placeholder}</option>}
    {options.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
);

export const FormTextarea: React.FC<FormTextareaProps> = ({ className, ...props }) => (
  <textarea 
    className={`${styles.formTextarea} ${className || ''}`} 
    {...props} 
  />
);

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ 
  children, 
  orientation = 'vertical',
  className,
  ...props 
}) => (
  <div 
    className={`
      ${styles.formRadioGroup} 
      ${styles[`formRadioGroup${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`]} 
      ${className || ''}
    `}
    data-name={props.name}
  >
    {children}
  </div>
);

export const FormRadio: React.FC<FormRadioProps> = ({ 
  label, 
  className, 
  ...props 
}) => (
  <label className={`${styles.formRadioLabel} ${className || ''}`}>
    <input type="radio" className={styles.formRadio} {...props} />
    <span className={styles.formRadioText}>{label}</span>
  </label>
);

export const FormInfo: React.FC<FormInfoProps> = ({ 
  children, 
  type = 'info',
  className 
}) => (
  <div 
    className={`
      ${styles.formInfo} 
      ${styles[`formInfo${type.charAt(0).toUpperCase() + type.slice(1)}`]} 
      ${className || ''}
    `}
  >
    {children}
  </div>
);

export const FormError: React.FC<FormErrorProps> = ({ children, className }) => (
  <div className={`${styles.formError} ${className || ''}`}>
    {children}
  </div>
);

// Componente de loading
export const FormLoading: React.FC<{ visible: boolean }> = ({ visible }) => (
  visible ? <div className={styles.formLoading}><div className={styles.formSpinner} /></div> : null
); 