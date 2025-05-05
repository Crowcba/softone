"use client";
import React from 'react';
import { getUserName } from '@/app/mods/login/login';
import '@/styles/base/home.scss';

const HomePage: React.FC = () => {
	const userName = getUserName() || 'Usuário';

	return (
		<div className="welcome-container">
			<div className="welcome-card">
				<h1 className="welcome-title">Bem-vindo(a),</h1>
				<h2 className="welcome-name">{userName}</h2>
				<p className="welcome-message">Sistema de Gestão de Visitas</p>
			</div>
		</div>
	);
};

export default HomePage;
