'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ConstructionPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

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
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-8 h-8"
            >
              <svg
                className="w-full h-full text-blue-500"
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </motion.div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            Módulo em Construção
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            Estamos trabalhando duro para trazer este módulo para você. 
            Em breve estará disponível!
          </p>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </motion.div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Redirecionando para a página inicial em alguns segundos...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
