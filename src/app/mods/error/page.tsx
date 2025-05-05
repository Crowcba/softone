'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('Ocorreu um erro inesperado');
  const [errorCode, setErrorCode] = useState('500');

  useEffect(() => {
    // Pega o código de erro da URL
    const code = searchParams.get('code');
    if (code) {
      setErrorCode(code);
      // Define a mensagem baseada no código de erro
      switch (code) {
        case '404':
          setErrorMessage('Página não encontrada');
          break;
        case '401':
          setErrorMessage('Acesso não autorizado');
          break;
        case '403':
          setErrorMessage('Acesso negado');
          break;
        case '500':
          setErrorMessage('Erro interno do servidor');
          break;
        default:
          setErrorMessage('Ocorreu um erro inesperado');
      }
    }

    // Redireciona para home após 5 segundos
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="content-wrapper">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm mx-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-8 h-8"
            >
              <svg
                className="w-full h-full text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold text-red-500 mb-2">
            {errorCode}
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {errorMessage}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            Você será redirecionado para a página inicial em alguns segundos.
          </p>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </motion.div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Se o redirecionamento não acontecer automaticamente, 
            <button 
              onClick={() => router.push('/home')}
              className="text-red-500 hover:text-red-600 ml-1 underline"
            >
              clique aqui
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
