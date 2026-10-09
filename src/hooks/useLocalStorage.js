import { useEffect, useState } from 'react';

// Hook personalizado: funciona como useState pero guarda el valor en el navegador
export default function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado ? JSON.parse(guardado) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      /* si el almacenamiento falla, la app sigue funcionando en memoria */
    }
  }, [clave, valor]);

  return [valor, setValor];
}
