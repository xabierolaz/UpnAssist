import React, { useEffect } from 'react';

const Email: React.FC = () => {
  useEffect(() => {
    window.location.href = 'https://webmail.unavarra.es/round/';
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-700">Redirigiendo a correo institucional...</p>
    </div>
  );
};

export default Email;
