// src/components/RegisterModal.js
'use client';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import registerlogo from '../assets/registerlogo.png';

export default function RegisterModal({ isOpen, setIsOpen }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State para mensagens de erro
  const [successMessage, setSuccessMessage] = useState(''); // State para mensagens de sucesso

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    // Limpar mensagens de erro ao iniciar a submissão
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('API URL:', process.env.REACT_APP_API_URL); // Verifique se está sendo exibido corretamente

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });


      if (!response.ok) {
        throw new Error('Erro ao registrar usuário');
      }

      const data = await response.json();
      setSuccessMessage(data.message); // Mensagem de sucesso
      setIsOpen(false); // Fechar o modal após o envio
    } catch (error) {
      setErrorMessage(error.message); // Tratar o erro de maneira apropriada
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-6 sm:p-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Imagem no topo */}
                <img
                  className="mx-auto h-72 w-auto"
                  src={registerlogo}
                  alt="Your logo"
                />
                <DialogTitle as="h3" className="mt-6 text-center text-lg font-medium text-gray-900">
                  Create an Account
                </DialogTitle>
                {errorMessage && (
                  <div className="text-red-500 text-center">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-center">{successMessage}</div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="-space-y-px rounded-md shadow-sm">
                    <div className='mb-2 rounded-md'>
                      <label htmlFor="username" className="sr-only">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Username"
                      />
                    </div>
                    <div className='mt-2 rounded-md'>
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="relative block w-full appearance-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Email address"
                      />
                    </div>
                    <div className='mb-2 rounded-md'>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="relative block w-full appearance-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Password"
                      />
                    </div>
                    <div className='mb-2 rounded-md'>
                      <label htmlFor="confirm-password" className="sr-only">
                        Verify Password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Verify Password"
                      />
                    </div>
                  </div>

                  {/* Checkbox para termos e condições */}
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      checked={agreedToTerms}
                      onChange={() => setAgreedToTerms(!agreedToTerms)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                      I agree to the terms and conditions.
                    </label>
                  </div>

                  {/* Botão de Registro */}
                  <div>
                    <button
                      type="submit"
                      className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
