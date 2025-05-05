"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/base/home.scss';

// Componente para os cards de estatísticas
interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
}

const _StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
	<div className="stat-card" style={{ borderColor: color }}>
		<div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
			{icon}
		</div>
		<div className="stat-content">
			<h3 className="stat-title">{title}</h3>
			<p className="stat-value">{value}</p>
		</div>
	</div>
);

// Componente para os gráficos de atividade recente
interface ActivityCardProps {
	title: string;
	children: React.ReactNode;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ title, children }) => (
	<div className="activity-card">
		<h3 className="card-title">{title}</h3>
		<div className="card-content">
			{children}
		</div>
	</div>
);

// Cards de acesso rápido para módulos mais usados
interface QuickAccessCardProps {
	title: string;
	icon: React.ReactNode;
	path: string;
	color: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, icon, path, color }) => (
	<Link href={path} className="quick-access-card" style={{ borderColor: color }}>
		<div className="quick-access-icon" style={{ backgroundColor: `${color}20`, color }}>
			{icon}
		</div>
		<span className="quick-access-title">{title}</span>
	</Link>
);

// Componente para mensagens/notificações
interface NotificationProps {
	message: string;
	date: string;
	type: 'info' | 'warning' | 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, date, type }) => (
	<div className={`notification ${type}`}>
		<div className="notification-icon">
			{type === 'info' && (
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<circle cx="12" cy="12" r="10"></circle>
					<path d="M12 16v-4"></path>
					<path d="M12 8h.01"></path>
				</svg>
			)}
			{type === 'warning' && (
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
					<path d="M12 9v4"></path>
					<path d="M12 17h.01"></path>
				</svg>
			)}
			{type === 'success' && (
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
					<polyline points="22 4 12 14.01 9 11.01"></polyline>
				</svg>
			)}
			{type === 'error' && (
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="15" y1="9" x2="9" y2="15"></line>
					<line x1="9" y1="9" x2="15" y2="15"></line>
				</svg>
			)}
		</div>
		<div className="notification-content">
			<p className="notification-message">{message}</p>
			<span className="notification-date">{date}</span>
		</div>
	</div>
);

export default function HomePage() {
	const router = useRouter();
	const [_companyName, setCompanyName] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		// Verificar se o usuário está logado
		const token = localStorage.getItem('token');
		if (!token) {
			router.push('/login');
			return;
		}
		
		// Simulação de carregamento de dados
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);

		// Carregar informações da empresa
		const empresasLiberadas = sessionStorage.getItem('empresas_liberadas');
		const empresaAtiva = sessionStorage.getItem('empresa_ativa');
		
		if (empresasLiberadas && empresaAtiva) {
			try {
				const empresas = JSON.parse(empresasLiberadas);
				const empresa = empresas.find((e: any) => String(e.idEmpresa) === empresaAtiva);
				if (empresa) {
					setCompanyName(empresa.fantasiaEmpresa);
				}
			} catch (error) {
				console.error('Erro ao carregar informações da empresa:', error);
			}
		}

		return () => clearTimeout(timer);
	}, [router]);

	if (loading) {
		return (
			<div className="loading-container">
				<div className="spinner"></div>
				<p>Carregando dashboard...</p>
			</div>
		);
	}

	return (
		<div className="home-dashboard">
			<div className="dashboard-header">
				<h1 className="dashboard-title">
          Visitas
					
				</h1>
			</div>

			<div className="dashboard-content">
				<div className="content-main">
					<ActivityCard title="">
						<div className="modules-grid">
							{/* quickAccessModules.map((module, index) => (
								<QuickAccessCard
									key={index}
									title={module.title}
									icon={module.icon}
									path={module.path} // Mude de onClick para path
									color={module.color}
								/>
							)) */}
						</div>
					</ActivityCard>
				</div>

				<div className="content-side">
					<ActivityCard title="Notificações Recentes">
						<div className="notifications-list">
							{/* notifications.map((notification, index) => (
								<Notification
									key={index}
									message={notification.message}
									date={notification.date}
									type={notification.type}
								/>
							)) */}
						</div>
					</ActivityCard>
				</div>
			</div>
		</div>
	);
}
