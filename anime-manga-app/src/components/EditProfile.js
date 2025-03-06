import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Updated to Heroicons v2 import format
import { ArrowLeftIcon, PhotoIcon, UserCircleIcon, CalendarDaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        photo: '',
        cover_image: '',
        date_of_birth: '',
        bio: ''
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        // Obter dados do usuário a partir do localStorage
        const storedUserSession = localStorage.getItem('userSession');
        if (storedUserSession) {
            const user = JSON.parse(storedUserSession);
            setUserData(user);
            setFormData({
                photo: user.photo || '',
                cover_image: user.cover_image || '',
                date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
                bio: user.bio || ''
            });
        } else {
            console.error('Usuário não encontrado. Realize o login novamente.');
            setMessage({ 
                text: 'Usuário não encontrado. Por favor, faça login novamente.', 
                type: 'error' 
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            // Lidar com o upload de arquivos
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));
            
            // Create and set preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                if (name === 'photo') {
                    setPhotoPreview(reader.result);
                } else if (name === 'cover_image') {
                    setCoverPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });
        
        // Enviar os dados para a base de dados
        const formDataToSend = new FormData();
        formDataToSend.append('photo', formData.photo);
        formDataToSend.append('cover_image', formData.cover_image);
        formDataToSend.append('date_of_birth', formData.date_of_birth);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('username', userData.username); // Mantemos o username da sessão

        try {
            const response = await fetch('http://localhost:3000/api/update-profile', {
                method: 'POST',
                body: formDataToSend, // Enviando FormData
                // Removemos o cabeçalho de autorização
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('userSession', JSON.stringify(updatedUser)); // Atualiza o localStorage com os novos dados
                setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
                
                // Redirect to profile after successful update
                setTimeout(() => {
                    navigate('/userprofile');
                }, 2000);
            } else {
                throw new Error('Erro ao atualizar o perfil.');
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!userData) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <div className="flex items-center mb-6">
                <Link to="/userprofile" className="mr-4">
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                </Link>
                <h2 className="text-xl font-bold">Editar Perfil</h2>
            </div>
            
            {message.text && (
                <div className={`p-3 rounded mb-4 ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="photo">
                        <div className="flex items-center">
                            <PhotoIcon className="h-5 w-5 mr-2" />
                            Imagem do Usuário
                        </div>
                    </label>
                    
                    {/* Photo preview */}
                    <div className="mb-3 flex justify-center">
                        <div className="relative w-32 h-32">
                            <img 
                                src={photoPreview || (userData.photo ? `http://localhost:3000/assets/${userData.photo}` : 'https://via.placeholder.com/150?text=User')} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                            />
                        </div>
                    </div>
                    
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cover_image">
                        <div className="flex items-center">
                            <UserCircleIcon className="h-5 w-5 mr-2" />
                            Imagem de Capa
                        </div>
                    </label>
                    
                    {/* Cover image preview */}
                    <div className="mb-3">
                        <div className="h-32 w-full overflow-hidden rounded-md">
                            <img 
                                src={coverPreview || (userData.cover_image ? `http://localhost:3000/assets/${userData.cover_image}` : 'https://via.placeholder.com/800x200?text=Cover+Image')} 
                                alt="Cover Preview" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    
                    <input
                        type="file"
                        name="cover_image"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0
                               file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="date_of_birth">
                        <div className="flex items-center">
                            <CalendarDaysIcon className="h-5 w-5 mr-2" />
                            Data de Nascimento
                        </div>
                    </label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2 border"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bio">
                        <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Bio
                        </div>
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2 border"
                        rows="3"
                        placeholder="Escreva algo sobre você..."
                    />
                </div>
                
                <div className="flex items-center justify-between mt-6">
                    <Link 
                        to="/userprofile"
                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancelar
                    </Link>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;