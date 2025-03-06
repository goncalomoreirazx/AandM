const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurar o CORS
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limite para o corpo da requisição
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(bodyParser.json());

// Servir arquivos estáticos da pasta assets
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// Configurar o Multer para uploads de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../src/assets')); // Define a pasta de destino para os uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Usar um nome único para evitar conflitos
    },
});
const upload = multer({ storage });

// Conexão ao banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandm',
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Verifica a conexão com o banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota de registro de usuários
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (error, results) => {
                if (error) {
                    return res.status(500).json({ message: 'Erro ao registrar usuário', error });
                }
                res.status(201).json({ message: 'Usuário registrado com sucesso' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
});

// Rota de login de usuários
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Erro no servidor', error });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Login bem-sucedido
            res.status(200).json({ message: 'Login bem-sucedido', user });
        }
    );
});

// Endpoint para buscar o perfil do usuário baseado no username
app.get('/user-profile', (req, res) => {
    const { username } = req.query; // Recebe o nome de usuário do front-end

    if (!username) {
        return res.status(400).json({ error: 'Nome de usuário não fornecido' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar os dados do usuário' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(results[0]);
    });
});

// Endpoint para atualizar o perfil do usuário
app.post('/api/update-profile', upload.fields([{ name: 'photo' }, { name: 'cover_image' }]), (req, res) => {
    const { username, date_of_birth, bio } = req.body;

    // Armazenar o caminho da imagem, se houver upload
    const photo = req.files['photo'] ? req.files['photo'][0].filename : null; // Caminho do arquivo
    const cover_image = req.files['cover_image'] ? req.files['cover_image'][0].filename : null; // Caminho do arquivo

    const query = `
        UPDATE users SET 
            photo = COALESCE(?, photo), 
            cover_image = COALESCE(?, cover_image), 
            date_of_birth = ?, 
            bio = ? 
        WHERE username = ?
    `;
    
    connection.query(query, [photo, cover_image, date_of_birth, bio, username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar os dados do usuário' });
        }
        
        // Busca o usuário atualizado
        connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar os dados do usuário atualizado' });
            }
            res.json(results[0]); // Retorna o usuário atualizado
        });
    });
});


//Funciona tanto para anime como manga
// Função para adicionar um item ao banco de dados
async function addToDatabase(userId, externalId, contentType) {
    console.log('Adicionando ao banco de dados:', { userId, externalId, contentType });

    return new Promise((resolve, reject) => {
        // Verifica se a entrada já existe
        connection.query(
            'SELECT * FROM user_lists WHERE user_id = ? AND external_id = ? AND content_type = ?',
            [userId, externalId, contentType],
            (selectError, selectResults) => {
                if (selectError) {
                    console.error('Erro ao verificar entrada existente:', selectError);
                    return reject(selectError);
                }

                // Se já existe, rejeita a operação
                if (selectResults.length > 0) {
                    console.log('Registro já existe:', { userId, externalId, contentType });
                    return reject(new Error('Este item já está na sua lista.'));
                }

                // Se não existe, insere novo registro
                connection.query(
                    'INSERT INTO user_lists (user_id, external_id, content_type) VALUES (?, ?, ?)',
                    [userId, externalId, contentType],
                    (insertError, insertResults) => {
                        if (insertError) {
                            console.error('Erro ao inserir no banco de dados:', insertError);
                            return reject(insertError);
                        }
                        resolve(insertResults); // Resolve com os resultados da inserção
                    }
                );
            }
        );
    });
}

// Rota para adicionar à lista
app.post('/api/list', async (req, res) => {
    const { userId, externalId, contentType } = req.body;

    if (!userId || !externalId || !contentType) {
        return res.status(400).json({ message: 'Dados insuficientes' });
    }

    try {
        const result = await addToDatabase(userId, externalId, contentType);
        res.status(201).json({ message: 'Adicionado à lista com sucesso!', data: result });
    } catch (error) {
        console.error('Erro ao adicionar à lista:', error);
        res.status(500).json({ message: error.message || 'Erro ao adicionar à lista.' });
    }
});

// Rota para obter a lista do usuário
app.get('/api/list', async (req, res) => {
    const { userId, contentType } = req.query;

    console.log('userId:', userId); // Verifica o userId
    console.log('contentType:', contentType); // Verifica o contentType

    if (!userId || !contentType) {
        return res.status(400).json({ message: 'User ID e tipo de conteúdo são necessários.' });
    }

    try {
        connection.query(
            'SELECT * FROM user_lists WHERE user_id = ? AND content_type = ?',
            [userId, contentType],
            (err, results) => {
                if (err) {
                    console.error('Erro ao buscar lista do usuário:', err);
                    return res.status(500).json({ message: 'Erro ao buscar lista.' });
                }

                console.log('Resultados da consulta:', results); // Verifica os resultados da consulta
                res.json(results); // Retorna a lista para o frontend
            }
        );
    } catch (error) {
        console.error('Erro ao buscar lista do usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar lista.' });
    }
});

//REMOVER ANIMES
async function yourDatabaseFunctionToRemoveAnime(userId, animeId) {
    return new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM user_lists WHERE user_id = ? AND external_id = ? AND content_type = ?',
            [userId, animeId, 'anime'], // O content_type deve ser 'anime'
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
}


// Endpoint para remover um anime da lista
app.delete('/api/user/:userId/anime/:animeId', async (req, res) => {
    const { userId, animeId } = req.params;

    console.log('Requisição DELETE recebida:', { userId, animeId }); // Verifique se a requisição é recebida

    try {
        // Aqui você deve ter a lógica para remover o anime do banco de dados
        const result = await yourDatabaseFunctionToRemoveAnime(userId, animeId);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Anime removido com sucesso.' });
        } else {
            return res.status(404).json({ message: 'Anime não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao remover anime:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


//REMOVER MANGAS
async function yourDatabaseFunctionToRemoveManga(userId, mangaId) {
    return new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM user_lists WHERE user_id = ? AND external_id = ? AND content_type = ?',
            [userId, mangaId, 'manga'], // O content_type deve ser 'manga'
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
}

// Endpoint para remover um manga da lista
app.delete('/api/user/:userId/manga/:mangaId', async (req, res) => {
    const { userId, mangaId } = req.params;

    console.log('Requisição DELETE recebida:', { userId, mangaId }); // Log da requisição

    try {
        const result = await yourDatabaseFunctionToRemoveManga(parseInt(userId), parseInt(mangaId));
        console.log('Resultado da remoção:', result); // Log do resultado da remoção
        
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Mangá removido com sucesso.' });
        } else {
            return res.status(404).json({ message: 'Mangá não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao remover mangá:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// Add this endpoint to your server.js file after the other API endpoints

// Endpoint to update the status of an item in the user's list
app.put('/api/list/status', async (req, res) => {
    const { userId, externalId, contentType, status } = req.body;
  
    if (!userId || !externalId || !contentType || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    // Validate that status is one of the allowed values
    const validStatuses = ['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
  
    try {
      connection.query(
        'UPDATE user_lists SET status = ? WHERE user_id = ? AND external_id = ? AND content_type = ?',
        [status, userId, externalId, contentType],
        (err, results) => {
          if (err) {
            console.error('Error updating item status:', err);
            return res.status(500).json({ message: 'Error updating status.' });
          }
  
          if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found in your list.' });
          }
  
          res.json({ message: 'Status updated successfully.' });
        }
      );
    } catch (error) {
      console.error('Error updating item status:', error);
      res.status(500).json({ message: 'Error updating status.' });
    }
  });

