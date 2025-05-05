import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCSRFToken, validateCSRFToken, getCSRFHeaderName } from '@/utils/csrf';

// Função para verificar se um caminho é público
const isPublicPath = (path: string) => {
  const publicPaths = ['/login', '/logout'];
  return publicPaths.includes(path);
};

// Mapeia caminhos internos para caminhos públicos
const internalToPublicPaths: Record<string, string> = {
  '/mods/login': '/login',
  '/mods/logout': '/logout',
  '/mods/home': '/home',
  '/mods/visits/home': '/visitas',
  '/mods/visits/audit': '/visitas/visitas-clientes',
  '/mods/visits/locations': '/locais-de-visitas',
  '/mods/visits/prescriber': '/visitas/prescritores',
  '/mods/visits/vehicles': '/visitas/veiculos',
  '/mods/visits/config': '/visitas/configuracoes',
  '/mods/visits/list': '/agenda-lista',
  '/mods/visits/agenda': '/agenda',
  '/mods/visits/reports': '/visitas/relatorios',
  
};

// Verifica se um caminho é interno (começa com /mods)
const isInternalPath = (path: string) => {
  return path.startsWith('/mods');
};

// Função para verificar permissões de acesso
const hasPermission = (token: string, pathname: string): boolean => {
  // Em um cenário real, você decodificaria o token JWT e verificaria
  // as permissões do usuário baseado nos claims do token
  
  // Exemplo simplificado - em produção, use uma solução robusta
  // que valide as permissões baseadas no usuário e no recurso solicitado
  if (token) {
    // Neste exemplo, assumimos que o token já é válido
    // e estamos apenas verificando as permissões
    if (pathname.startsWith('/visitas/audit')) {
      // Simulando verificação para módulos de segurança (requer permissões de admin)
      try {
        // Em um cenário real, você verificaria os claims no token
        // Este é apenas um exemplo simples
        return true; // Permitir acesso temporariamente
      } catch (error) {
        return false;
      }
    }
    return true; // Para outros caminhos, permitir acesso se autenticado
  }
  return false;
};

// Função para verificar token de CSRF
const validateCSRFTokenMiddleware = (request: NextRequest): boolean => {
  const method = request.method;
  
  // Não requer proteção CSRF para métodos seguros
  if (method === 'GET' || method === 'HEAD') {
    return true;
  }
  
  // Para métodos não seguros, verifica o token CSRF
  const csrfToken = request.headers.get(getCSRFHeaderName());
  return validateCSRFToken(csrfToken || '');
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redireciona caminhos internos para caminhos públicos
  if (isInternalPath(pathname)) {
    // Verifica padrões especiais com IDs
    if (pathname.match(/^\/mods\/visits\/locations\/edit\/[^/]+$/)) {
      const id = pathname.split('/').pop();
      return NextResponse.redirect(new URL(`/locais-de-visitas/editar/${id}`, request.url));
    }
    
    if (pathname.match(/^\/mods\/visits\/locations\/details\/[^/]+$/)) {
      const id = pathname.split('/').pop();
      return NextResponse.redirect(new URL(`/locais-de-visitas/detalhes/${id}`, request.url));
    }
    
    // Verifica os caminhos mapeados diretamente
    for (const [internalPath, publicPath] of Object.entries(internalToPublicPaths)) {
      if (pathname === internalPath || pathname === `${internalPath}/`) {
        return NextResponse.redirect(new URL(publicPath, request.url));
      }
    }
  }
  
  // Obtém o token dos cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // Se estiver na página de login e já estiver autenticado, redireciona para home
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Se tentar acessar uma rota protegida sem estar autenticado, redireciona para login
  if (!isPublicPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // Adiciona parâmetro para mostrar alerta
    loginUrl.searchParams.set('unauthorized', 'true');
    return NextResponse.redirect(loginUrl);
  }
  
  // Verificação de permissões - protege rotas sensíveis
  if (isAuthenticated && !hasPermission(token, pathname)) {
    // Redireciona para uma página de acesso negado
    return NextResponse.redirect(new URL('/acesso-negado', request.url));
  }
  
  // Proteção CSRF para métodos não seguros (POST, PUT, DELETE, etc.)
  if (!validateCSRFTokenMiddleware(request)) {
    // Retorna erro 403 para solicitações sem token CSRF válido
    return new NextResponse(JSON.stringify({ error: 'CSRF token inválido' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Rewrite para os módulos correspondentes (mas mantém a URL original)
  if (pathname === '/login') {
    return NextResponse.rewrite(new URL('/mods/login', request.url));
  }
  if (pathname === '/home') {
    return NextResponse.rewrite(new URL('/mods/home', request.url));
  }
  if (pathname === '/logout') {
    return NextResponse.rewrite(new URL('/mods/logout', request.url));
  }
  if(pathname === '/visitas'){
    return NextResponse.rewrite(new URL('/mods/visits/home', request.url));
  }
  if(pathname === '/visitas/visitas-clientes'){
    return NextResponse.rewrite(new URL('/mods/visits/audit', request.url));
  }
  if(pathname === '/locais-de-visitas'){
    return NextResponse.rewrite(new URL('/mods/visits/locations', request.url));
  }
  if(pathname.startsWith('/locais-de-visitas/editar/')){
    const id = pathname.split('/').pop();
    return NextResponse.rewrite(new URL(`/mods/visits/locations/edit/${id}`, request.url));
  }
  if(pathname.startsWith('/locais-de-visitas/detalhes/')){
    const id = pathname.split('/').pop();
    return NextResponse.rewrite(new URL(`/mods/visits/locations/details/${id}`, request.url));
  }
  if(pathname === '/agenda-lista'){
    return NextResponse.rewrite(new URL('/mods/visits/list', request.url));
  }
  if(pathname === '/agenda-lista/register'){
    return NextResponse.rewrite(new URL('/mods/visits/list/register', request.url));
  }
  if(pathname === '/agenda-lista/edit'){
    return NextResponse.rewrite(new URL('/mods/visits/list/edit', request.url));
  }
  if(pathname.startsWith('/em_construcao')){
    const id = pathname.split('/').pop();
    return NextResponse.rewrite(new URL(`/mods/construction`, request.url));
  }
  
  
  if(pathname === '/visitas/prescritores'){
    return NextResponse.rewrite(new URL('/mods/visits/prescriber', request.url));
  }
  if(pathname.startsWith('/visitas/prescritores/editar/')){
    const id = pathname.split('/').pop();
    return NextResponse.rewrite(new URL(`/mods/visits/prescriber/edit/${id}`, request.url));
  }
  if(pathname.startsWith('/visitas/prescritores/detalhes/')){
    const id = pathname.split('/').pop();
    return NextResponse.rewrite(new URL(`/mods/visits/prescriber/details/${id}`, request.url));
  }

  if(pathname === '/visitas/veiculos'){
    return NextResponse.rewrite(new URL('/mods/visits/vehicles', request.url));
  }

  if(pathname === '/visitas/configuracoes'){
    return NextResponse.rewrite(new URL('/mods/visits/config', request.url));
  }
  if(pathname === '/agenda'){
    return NextResponse.rewrite(new URL('/mods/visits/agenda', request.url));
  }
  if(pathname === '/visitas/relatorios'){
    return NextResponse.rewrite(new URL('/mods/visits/reports', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Proteger todas as rotas exceto as públicas e recursos estáticos
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};