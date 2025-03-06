import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // Updated to Heroicons v2 format

const Dialog = ({ onClose, message = "Adicionado à lista com sucesso!" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm mx-auto">
        <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <p className="text-xl font-semibold text-gray-800">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
};

export default Dialog;