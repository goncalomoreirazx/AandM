import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import loginlogo from '../assets/loginlogo.png';

export default function LoginModal({ isOpen, setIsOpen, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password); // Para depuração
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log(result); // Log da resposta completa para depuração

      if (response.ok) {
        // Tratamento do login bem-sucedido (e.g., salvar informações do usuário, token)
        const { token, user } = result; // Ajuste conforme a estrutura da resposta
        localStorage.setItem('token', token); // Armazenar o token no localStorage
        localStorage.setItem('userSession', JSON.stringify(user)); // Armazenar as informações do usuário

        onLoginSuccess(user); // Passa os dados do usuário para o componente pai
        setIsOpen(false); // Fechar o modal
        setEmail(''); // Limpar o campo de email
        setPassword(''); // Limpar o campo de senha
        setErrorMessage(''); // Limpar mensagens de erro anteriores
      } else {
        // Tratamento de erro (e.g., mostrar mensagem de erro)
        console.error('Login falhou:', result.message || response.statusText);
        setErrorMessage(result.message || 'Falha no login, por favor tente novamente.'); // Define a mensagem de erro
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setErrorMessage('Ocorreu um erro, por favor tente novamente.'); // Define a mensagem de erro
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
                <img className="mx-auto h-72 w-auto" src={loginlogo} alt="Seu logo" />
                <DialogTitle as="h3" className="mt-6 text-center text-lg font-medium text-gray-900">
                  Acesse sua conta
                </DialogTitle>
                {errorMessage && (
                  <div className="mt-2 text-red-600 text-center">{errorMessage}</div> // Mostrar mensagem de erro
                )}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                  <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                      <label htmlFor="email-address" className="sr-only">Endereço de Email</label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Endereço de Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="sr-only">Senha</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Esqueceu sua senha?</a>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Login
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
