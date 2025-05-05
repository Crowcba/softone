"use client";

import React, { ChangeEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEnvironmentMessage, handleLogin, getUserCompanies, Company } from './login';
import '@/styles/base/login.scss';

// Tipos para o componente InputField
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

// Componente para o campo de entrada
const InputField: React.FC<InputFieldProps> = ({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  placeholder,
  icon,
  rightElement
}) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <div className="input-wrapper">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className={`input-field ${icon ? 'has-icon' : ''}`}
      />
      {rightElement && <div className="right-element">{rightElement}</div>}
    </div>
  </div>
);

// Tipos para o componente Button
interface ButtonProps {
  type: "button" | "submit" | "reset";
  className: string;
  children: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}

// Componente para o botão
const Button: React.FC<ButtonProps> = ({ type, className, children, isLoading, onClick }) => (
  <button 
    type={type} 
    className={className} 
    disabled={isLoading}
    onClick={onClick}
  >
    {isLoading ? (
      <span className="spinner"></span>
    ) : children}
  </button>
);

// Ícones simples usando SVG inline
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

// Ícone de logo padrão
const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="130" height="48" viewBox="0 0 96 32">
    <style type="text/css">
      {`.st0{fill:#FFFFFF;}
        .st1{fill:#E83700;}`}
    </style>
    <g id="Tipografia_1_">
      <path className="st0" d="M0.6,23.8v-3.7h11.1v-3.7H4.3c-1,0-1.9-0.4-2.6-1.1c-0.7-0.7-1.1-1.6-1.1-2.6V9c0-1,0.4-1.9,1.1-2.6
        c0.7-0.7,1.6-1.1,2.6-1.1h11.1V9H4.3v3.7h7.4c1,0,1.9,0.4,2.6,1.1c0.7,0.7,1.1,1.6,1.1,2.6v3.7c0,1-0.4,1.9-1.1,2.6
        c-0.7,0.7-1.6,1.1-2.6,1.1H0.6z"/>
      <path className="st0" d="M20,23.8c-1,0-1.9-0.4-2.6-1.1c-0.7-0.7-1.1-1.6-1.1-2.6v-7.4c0-1,0.4-1.9,1.1-2.6C18.1,9.3,19,9,20,9h7.4
        c1,0,1.9,0.4,2.6,1.1c0.7,0.7,1.1,1.6,1.1,2.6v7.4c0,1-0.4,1.9-1.1,2.6c-0.7,0.7-1.6,1.1-2.6,1.1H20z M27.4,20.1v-7.4H20v7.4H27.4z
        "/>
      <path className="st0" d="M32,23.8V9c0-1,0.4-1.9,1.1-2.6c0.7-0.7,1.6-1.1,2.6-1.1h3.7V9h-3.7v0.9h3.7v3.7h-3.7v10.2H32z"/>
      <path className="st0" d="M44.1,20.1L44.1,20.1L44.1,20.1l0-6.5h3.7V9.8h-3.7V5.3h-3.7v14.8c0,1,0.4,1.9,1.1,2.6
        c0.7,0.7,1.6,1.1,2.6,1.1h3.7v-3.7H44.1z"/>
      <g>
        <path className="st0" d="M64.4,20.6v3.2h3.7v-3.6C66.9,20.2,65.7,20.4,64.4,20.6z"/>
        <path className="st0" d="M78.2,10.1C77.4,9.3,76.6,9,75.6,9h-7.4c-1,0-1.9,0.4-2.6,1.1c-0.7,0.7-1.1,1.6-1.1,2.6v6.1
          c1.2-0.1,2.4-0.2,3.6-0.2c0,0,0,0,0.1,0v-5.9h7.4v11.1h3.7V12.7C79.3,11.6,78.9,10.8,78.2,10.1z"/>
      </g>
      <g>
        <path className="st0" d="M62.1,20.9c-3,0.5-5.9,1.2-8.4,2c0-0.1,0.1-0.3,0.2-0.4c-0.2,0.1-0.5,0.1-0.7,0.2c0.3-1,1.8-1.9,4-2.7h-4.8V9
          h9.1V5.2h-9.3v0c-0.9,0-1.8,0.4-2.5,1.1c-0.7,0.7-1.1,1.6-1.1,2.6v11.1c0,1,0.4,1.9,1.1,2.6c0.7,0.7,1.6,1.1,2.6,1.1h7.4
          c1,0,1.9-0.4,2.6-1.1c0.6-0.6,0.9-1.2,1.1-2C63,20.8,62.6,20.8,62.1,20.9z"/>
        <path className="st1" d="M63.5,18.6v-7.5h0V5.2H60v0.2L57.5,9h2.3v10.3c-6.2,1.4-10.7,3.9-10.9,6.2c2.4-1.3,5.1-2.6,8-3.7
          c6.1-2.3,11.9-3.3,16.5-3.3C70.7,18.2,67.2,18.1,63.5,18.6z"/>
      </g>
      <path className="st0" d="M83.9,23.8c-1,0-1.9-0.4-2.6-1.1c-0.7-0.7-1.1-1.6-1.1-2.6v-7.4c0-1,0.4-1.9,1.1-2.6C82,9.3,82.9,9,83.9,9h7.4
        c1,0,1.9,0.4,2.6,1.1c0.7,0.7,1.1,1.6,1.1,2.6v5.6H83.9v1.9H95v3.7H83.9z M91.3,14.5v-1.9h-7.4v1.9H91.3z"/>
    </g>
  </svg>
);

// Interface para o formato de empresa no sessionStorage
interface CompanyStorage {
    idEmpresa: number;
    fantasiaEmpresa: string;
    logoEmpresa?: string;
}

// Componente de seleção de empresa (modal similar ao alert)
const CompanyModal: React.FC<{
    companies: { id: string, name: string, logo?: string }[];
    onSelect: (id: string) => void;
}> = ({ companies, onSelect }) => {
    return (
        <div className="company-modal-backdrop">
            <div className="company-modal">
                <div className="company-modal-header">
                    <div className="modal-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <h3>Selecione sua empresa</h3>
                    <p className="company-modal-subtitle">Escolha a empresa que deseja acessar</p>
                </div>
                <div className="company-search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Buscar empresa..." 
                        className="company-search-input"
                    />
                </div>
                <div className="company-list">
                    {companies.map((company, index) => (
                        <div 
                            key={company.id || `company-${index}`}
                            className="company-item"
                            onClick={() => onSelect(company.id)}
                        >
                            <div className="company-logo">
                                {company.logo ? (
                                    <img src={company.logo} alt={`Logo ${company.name}`} />
                                ) : (
                                    <div className="company-logo-placeholder">
                                        {company.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span className="company-name">{company.name}</span>
                            <div className="company-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
        const empresaAtiva = sessionStorage.getItem("empresa_ativa");
        if (empresaAtiva) {
            router.push('/home');
        }
    }, [router]);
    
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [environmentMessage, setEnvironmentMessage] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);
    const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
    const [companies, setCompanies] = React.useState<Company[]>([]);
    const [showCompanyModal, setShowCompanyModal] = React.useState(false);
    const [isRedirecting, setIsRedirecting] = React.useState(false);

    // Efeito inicial para carregar mensagem, username e logo
    React.useEffect(() => {
        const message = getEnvironmentMessage();
        setEnvironmentMessage(message);
        
        // Verificar se há credenciais salvas
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }

        // Carregar logo do sistema se existir
        try {
            const logo = localStorage.getItem('systemLogo');
            if (logo) {
                setLogoUrl(logo);
            }
        } catch {
            console.error('Erro ao carregar logo');
        }
    }, []);

    React.useEffect(() => {
        // Verificar se o usuário foi redirecionado devido à falta de autenticação
        if (searchParams.get('unauthorized') === 'true') {
            setShowAlert(true);
            
            // Ocultar o alerta após 5 segundos
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        try {
            localStorage.setItem("username", username);
            const success = await handleLogin(username, password);
            
            if (success) {
                const empresaAtiva = sessionStorage.getItem("empresa_ativa");
                
                if (empresaAtiva) {
                    setSuccessMessage('Login realizado com sucesso!');
                    
                    if (rememberMe) {
                        localStorage.setItem('rememberedUsername', username);
                    } else {
                        localStorage.removeItem('rememberedUsername');
                    }
                } else {
                    const empresasLiberadas = sessionStorage.getItem("empresas_liberadas");
                    
                    if (empresasLiberadas) {
                        try {
                            setCompanies([]);
                            
                            const parsedCompanies = JSON.parse(empresasLiberadas) as CompanyStorage[];
                            
                            const formattedCompanies: Company[] = parsedCompanies.map((company: CompanyStorage) => ({
                                id: String(company.idEmpresa),
                                name: company.fantasiaEmpresa,
                                logo: company.logoEmpresa
                            }));
                            
                            if (formattedCompanies.length > 1) {
                                setCompanies(formattedCompanies);
                                setTimeout(() => {
                                    setShowCompanyModal(true);
                                }, 0);
                            } else if (formattedCompanies.length === 1) {
                                const companyId = formattedCompanies[0].id;
                                sessionStorage.setItem("empresa_ativa", companyId);
                                setSuccessMessage('Login realizado com sucesso!');
                                
                                if (rememberMe) {
                                    localStorage.setItem('rememberedUsername', username);
                                } else {
                                    localStorage.removeItem('rememberedUsername');
                                }
                            }
                        } catch {
                            setErrorMessage('Erro ao processar lista de empresas.');
                        }
                    } else {
                        try {
                            const userCompanies = await getUserCompanies();
                            
                            if (userCompanies.length > 1) {
                                setCompanies([]);
                                setCompanies(userCompanies);
                                setTimeout(() => {
                                    setShowCompanyModal(true);
                                }, 0);
                            } else if (userCompanies.length === 1) {
                                const companyId = userCompanies[0].id;
                                sessionStorage.setItem("empresa_ativa", companyId);
                                setSuccessMessage('Login realizado com sucesso!');
                                
                                if (rememberMe) {
                                    localStorage.setItem('rememberedUsername', username);
                                } else {
                                    localStorage.removeItem('rememberedUsername');
                                }
                            } else {
                                setErrorMessage('Não há empresas disponíveis para este usuário.');
                            }
                        } catch {
                            setErrorMessage('Erro ao obter empresas. Tente novamente.');
                        }
                    }
                }
            } else {
                const loginError = sessionStorage.getItem("login_error");
                if (loginError) {
                    setErrorMessage(loginError);
                    sessionStorage.removeItem("login_error");
                } else {
                    setErrorMessage('Usuário ou senha inválidos');
                }
            }
        } catch (error) {
            console.error('Erro no login:', error);
            setErrorMessage('Ocorreu um erro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompanySelect = async (companyId: string) => {
        try {
            setIsRedirecting(true);
            setShowCompanyModal(false);
            sessionStorage.setItem("empresa_ativa", companyId);
            
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            }
            
            // Aguarda um momento para garantir que o sessionStorage foi atualizado
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Usa o router do Next.js para navegação
            router.push('/home');
            
            // Força um hard refresh após a navegação se necessário
            router.refresh();
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            setIsRedirecting(false);
            setErrorMessage('Erro ao redirecionar. Tente novamente.');
        }
    };

    return (
        <div className="login-container">
            {isRedirecting && (
                <div className="redirect-overlay">
                    <div className="redirect-content">
                        <div className="spinner"></div>
                        <p>Redirecionando para o sistema...</p>
                    </div>
                </div>
            )}
            <div className="particle" key="particle-1"></div>
            <div className="particle" key="particle-2"></div>
            <div className="particle" key="particle-3"></div>
            <div className="particle" key="particle-4"></div>
            <div className="particle" key="particle-5"></div>
            <div className="particle" key="particle-6"></div>
            <div className="particle" key="particle-7"></div>
            
            {showCompanyModal && companies.length > 0 && (
                <CompanyModal 
                    companies={companies}
                    onSelect={handleCompanySelect}
                />
            )}
            
            <div className="login-card">
                {/* Logo do sistema */}
                <div className="logo-container">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo do Sistema" className="system-logo" />
                    ) : (
                        <div className="default-logo">
                            <LogoIcon />
                        </div>
                    )}
                </div>
                
                <div className="login-header">
                    <h2>Bem-vindo</h2>
                    <p className="login-subtitle">Faça login para acessar sua conta</p>
                </div>
                
                {environmentMessage && (
                    <div className="environment-banner">
                        <p>{environmentMessage}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="success-banner">
                        <p>{successMessage}</p>
                    </div>
                )}
                
                {errorMessage && (
                    <div className="error-banner">
                        <p>{errorMessage}</p>
                    </div>
                )}

                {showAlert && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-fadeIn">
                        Usuário não está logado. Por favor, faça login.
                    </div>
                )}
                
            <form className="login-form" onSubmit={handleSubmit}>
                    <InputField 
                        id="username"
                        label="Usuário"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Seu nome de usuário"
                        icon={<UserIcon />}
                    />
                    
                    <InputField 
                        id="password"
                        label="Senha"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha"
                        icon={<LockIcon />}
                        rightElement={
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        }
                    />
                    
                    <div className="form-actions">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe">Lembrar-me</label>
                        </div>
                        
                        <div className="forgot-password">
                            <a href="/forgot-password">Esqueceu a senha?</a>
                        </div>
                    </div>
                    
                    <Button type="submit" className="login-button" isLoading={isLoading}>
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}