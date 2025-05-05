'use client';

import { AuthGuard } from '@/components/AuthGuard';

export default function ConfigPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Configurações do Sistema</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Preferências</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tema</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                  <option>Claro</option>
                  <option>Escuro</option>
                  <option>Sistema</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Idioma</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                  <option>Português</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                  value="usuario@empresa.com.br" 
                  readOnly 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Empresa Ativa</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                  value="Empresa XYZ" 
                  readOnly 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Salvar Alterações
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
