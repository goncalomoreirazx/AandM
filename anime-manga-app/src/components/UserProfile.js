import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUserSession = localStorage.getItem('userSession');
        if (storedUserSession) {
            setUserData(JSON.parse(storedUserSession));
        } else {
            console.error('Usuário não encontrado. Realize o login novamente.');
        }
    }, []);

    if (!userData) return <p className="text-center">Carregando dados do usuário...</p>;

    return (
        <div className="max-w-full md:max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-5 px-4 sm:px-6 mt-20 lg:px-8 ">
            <div
                className="h-32 sm:h-48 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url(${userData.cover_image ? `http://localhost:3000/assets/${userData.cover_image}` : '/default-cover.jpg'})`
                }}
            >
            </div>
            <div className="flex flex-col sm:flex-row p-4 sm:p-6">
                <div className="flex-shrink-0 mx-auto sm:mx-0 sm:mr-6">
                    <img
                        className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg"
                        src={userData.photo ? `http://localhost:3000/assets/${userData.photo}` : '/default-avatar.jpg'}
                        alt="Foto do usuário"
                    />
                </div>
                <div className="flex flex-col mt-4 sm:mt-0 sm:flex-grow">
                    <div className="flex justify-between items-start">
                        <h1 className="text-xl sm:text-2xl font-semibold mt-2">{userData.username}</h1>
                        <Link to="/edit-profile">
                            <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm">
                                Editar Perfil
                            </button>
                        </Link>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mt-2"><strong>Email:</strong> {userData.email}</p>
                    <p className="text-gray-700 text-sm sm:text-base mt-2">
                        <strong>Data de Nascimento:</strong> {userData.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : 'Não informado'}
                    </p>
                    <p className="text-gray-700 text-sm sm:text-base mt-2"><strong>Bio:</strong> {userData.bio || 'Sem bio'}</p>
                    <p className="text-gray-700 text-sm sm:text-base mt-2"><strong>Data de Cadastro:</strong> {new Date(userData.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
