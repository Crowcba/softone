import Cookies from 'js-cookie';

export const logout = () => {
	// Limpa o sessionStorage
	sessionStorage.clear();
	localStorage.clear();

	// Limpa o cache
	if ('caches' in window) {
		caches.keys().then(function(names) {
			for (let name of names) caches.delete(name);
		});
	}
	
	// Remove o cookie do token usando js-cookie
	Cookies.remove('token', { path: '/' });
	
	// Redireciona para a página de login
	window.location.href = '/login';
};
