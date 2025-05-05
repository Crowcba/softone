/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self' http: https:; connect-src 'self' http: https: ws: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: http: https:; font-src 'self' data: http: https:;"
              : "default-src 'self'; connect-src 'self' http://softoneapi.tecnovida.com.br:8080 https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:;"
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://softoneapi.tecnovida.com.br:8080'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/mods/login',
      },
      {
        source: '/logout',
        destination: '/mods/logout',
      },
      {
        source: '/home',
        destination: '/mods/home',
      },
      {
        source: '/visitas',
        destination: '/mods/visits/home',
      },
      {
        source: '/agenda-lista',
        destination: '/mods/visits/list',
      },
      {
        source: '/agenda-lista/register',
        destination: '/mods/visits/list/register',
      },
      {
        source: '/agenda-lista/edit',
        destination: '/mods/visits/list/edit',
      },
      {
        source: '/visitas/visitas-clientes',
        destination: '/mods/visits/audit',
      },
      {
        source: '/visitas/relatorios',
        destination: '/mods/visits/reports',
      },
      {
        source: '/agenda',
        destination: '/mods/visits/agenda',
      },
      {
        source: '/locais-de-visitas',
        destination: '/mods/visits/locations',
      },
      {
        source: '/visitas/prescritores',
        destination: '/mods/visits/prescriber',
      },
      {
        source: '/visitas/prescritores/detalhes/:id',
        destination: '/mods/visits/prescriber/details/:id',
      },
      {
        source: '/visitas/prescritores/editar/:id',
        destination: '/mods/visits/prescriber/edit/:id',
      },
      {
        source: '/locais-de-visitas/detalhes/:id',
        destination: '/mods/visits/locations/details/:id',
      },
      {
        source: '/locais-de-visitas/editar/:id',
        destination: '/mods/visits/locations/edit/:id',
      },
      {
        source: '/visitas/veiculos',
        destination: '/mods/visits/vehicles',
      },
      {
        source: '/visitas/configuracoes',
        destination: '/mods/visits/config',
      },
      {
        source: '/em_construcao',
        destination: '/mods/construction',
      }
    ];
  },
  // Configurações para permitir acesso pela rede
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 