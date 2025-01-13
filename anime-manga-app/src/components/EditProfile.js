import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        photo: '',
        cover_image: '',
        date_of_birth: '',
        bio: ''
    });

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
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            // Lidar com o upload de arquivos
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                alert('Perfil atualizado com sucesso!');
            } else {
                throw new Error('Erro ao atualizar o perfil.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    if (!userData) return <p>Carregando dados do usuário...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="photo">
                        Imagem do Usuário
                    </label>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="cover_image">
                        Imagem de Capa
                    </label>
                    <input
                        type="file"
                        name="cover_image"
                        accept="image/*"
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="date_of_birth">
                        Data de Nascimento
                    </label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="bio">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        rows="3"
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Salvar Alterações
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
