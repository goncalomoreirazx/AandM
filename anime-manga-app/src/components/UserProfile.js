import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Update imports to Heroicons v2 format
import { 
    EnvelopeIcon, 
    CalendarIcon, 
    UserIcon, 
    ClockIcon, 
    PencilIcon 
} from '@heroicons/react/24/outline';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserSession = localStorage.getItem('userSession');
        if (storedUserSession) {
            setUserData(JSON.parse(storedUserSession));
        } else {
            console.error('Usuário não encontrado. Realize o login novamente.');
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="max-w-full md:max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-20">
                <div className="text-center">
                    <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Usuário não encontrado</h2>
                    <p className="text-gray-500 mb-4">Parece que você não está logado</p>
                    <Link 
                        to="/" 
                        className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-full md:max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-5 px-4 sm:px-6 mt-20 lg:px-8">
            <div
                className="h-32 sm:h-48 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url(${userData.cover_image ? `http://localhost:3000/assets/${userData.cover_image}` : 'https://via.placeholder.com/1200x300?text=Cover+Image'})`
                }}
            >
                <div className="absolute inset-0 bg-blue-900 opacity-10"></div>
            </div>
            <div className="flex flex-col sm:flex-row p-4 sm:p-6">
                <div className="flex-shrink-0 mx-auto sm:mx-0 sm:mr-6">
                    <img
                        className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg object-cover"
                        src={userData.photo ? `http://localhost:3000/assets/${userData.photo}` : 'https://via.placeholder.com/150?text=User'}
                        alt="Foto do usuário"
                    />
                </div>
                <div className="flex flex-col mt-4 sm:mt-0 sm:flex-grow">
                    <div className="flex justify-between items-start">
                        <h1 className="text-xl sm:text-2xl font-semibold mt-2">{userData.username}</h1>
                        <Link to="/edit-profile">
                            <button className="flex items-center bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm transition">
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Editar Perfil
                            </button>
                        </Link>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center text-gray-700 text-sm sm:text-base">
                            <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span><strong>Email:</strong> {userData.email}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-700 text-sm sm:text-base">
                            <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span><strong>Data de Nascimento:</strong> {userData.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : 'Não informado'}</span>
                        </div>
                        
                        <div className="flex items-start text-gray-700 text-sm sm:text-base">
                            <UserIcon className="h-5 w-5 text-gray-500 mr-2 mt-1" />
                            <div>
                                <strong>Bio:</strong> 
                                <p className="mt-1">{userData.bio || 'Sem bio'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center text-gray-700 text-sm sm:text-base">
                            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span><strong>Data de Cadastro:</strong> {new Date(userData.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex space-x-2">
                        <Link 
                            to="/mylist" 
                            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
                        >
                            Minha Lista
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;