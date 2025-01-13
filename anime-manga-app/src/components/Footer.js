import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 text-center">
            <div className="flex justify-center space-x-4">
                <a href="#" className="hover:text-gray-200">Facebook</a>
                <a href="#" className="hover:text-gray-200">Twitter</a>
                <a href="#" className="hover:text-gray-200">Instagram</a>
            </div>
            <p className="mt-2">© 2024 Anime & Manga. Todos os direitos reservados.</p>
        </footer>
    );
};

export default Footer;
