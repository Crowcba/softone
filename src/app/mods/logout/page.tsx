"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/base/logout.scss';

// Componente para o logo
const LogoIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
		<polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
		<polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
		<polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
		<polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
		<line x1="12" y1="22.08" x2="12" y2="12"></line>
	</svg>
);

// Componente para as partículas
const Particles: React.FC = () => {
	return (
		<>
			<div className="particle"></div>
			<div className="particle"></div>
			<div className="particle"></div>
			<div className="particle"></div>
			<div className="particle"></div>
		</>
	);
};

const LogoutPage: React.FC = () => {
	const router = useRouter();

	useEffect(() => {
		const handleLogout = async () => {
			try {
				// Limpa a sessão
				sessionStorage.clear();
				localStorage.removeItem('token');
				localStorage.removeItem('username');
				
				// Limpa todos os cookies
				document.cookie.split(";").forEach((c) => {
					document.cookie = c
						.replace(/^ +/, "")
						.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
				});
				
				// Aguarda um momento para mostrar a animação
				await new Promise(resolve => setTimeout(resolve, 2000));
				
				// Redireciona para login
				await router.push('/login');
			} catch (error) {
				console.error('Erro durante o logout:', error);
				// Força o redirecionamento mesmo em caso de erro
				window.location.href = '/login';
			}
		};

		handleLogout();
	}, [router]);

	return (
		<div className="logout-container">
			<Particles />
			
			<div className="logo-container">
				<div className="default-logo">
					<LogoIcon />
				</div>
			</div>
			
			<div className="logout-card">
				<div className="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
						<polyline points="16 17 21 12 16 7"></polyline>
						<line x1="21" y1="12" x2="9" y2="12"></line>
					</svg>
				</div>
				<h1>Saindo do Sistema</h1>
				<p>Finalizando sua sessão de forma segura...</p>
				<div className="spinner"></div>
			</div>
			
			<div className="footer-message">
				Você será redirecionado para a página de login
			</div>
		</div>
	);
};

export default LogoutPage;
