const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

const pastaImagens = path.join(__dirname, 'usersImg');
const arquivoUsuarios = path.join(__dirname, 'users.json');

if (!fs.existsSync(pastaImagens)) {
    fs.mkdirSync(pastaImagens, { recursive: true });
}

if (!fs.existsSync(arquivoUsuarios)) {
    fs.writeFileSync(arquivoUsuarios, '[]', 'utf8');
}

function lerUsuarios() {
    try {
        return JSON.parse(fs.readFileSync(arquivoUsuarios, 'utf8') || '[]');
    } catch (error) {
        return [];
    }
}

function salvarUsuarios(usuarios) {
    fs.writeFileSync(arquivoUsuarios, JSON.stringify(usuarios, null, 2), 'utf8');
}

function normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function limparTexto(valor) {
    return String(valor || '').trim();
}

function normalizarDataEntrada(data) {
    if (!data) return '';

    if (data instanceof Date && !Number.isNaN(data.getTime())) {
        return data.toISOString().slice(0, 10);
    }

    const valor = String(data).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return valor;
    }

    const matchIso = valor.match(/^(\d{4}-\d{2}-\d{2})/);
    if (matchIso) {
        return matchIso[1];
    }

    const matchBr = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (matchBr) {
        return `${matchBr[3]}-${matchBr[2]}-${matchBr[1]}`;
    }

    return '';
}

function validarDataISO(data) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(data || ''));
}

function normalizarHabito(habito) {
    return {
        nome: limparTexto(habito.nome),
        concluido: !!habito.concluido
    };
}

function normalizarHumor(humor) {
    if (!humor) return null;
    return {
        nivelDoHumor: Number(humor.nivelDoHumor),
        observacao: limparTexto(humor.observacao)
    };
}

function normalizarRegistro(registro, index = 0) {
    return {
        id: limparTexto(registro.id) || `${limparTexto(registro.data)}_${index}`,
        data: normalizarDataEntrada(registro.data),
        humor: registro.humor ? normalizarHumor(registro.humor) : null,
        habitos: Array.isArray(registro.habitos)
            ? registro.habitos.map(normalizarHabito).filter((h) => h.nome)
            : []
    };
}

function normalizarUsuario(usuario) {
    if (!usuario) return null;

    return {
        nome: limparTexto(usuario.nome),
        email: limparTexto(usuario.email),
        senha: limparTexto(usuario.senha),
        foto: limparTexto(usuario.foto),
        habitosPadrao: Array.isArray(usuario.habitosPadrao)
            ? usuario.habitosPadrao.map(normalizarHabito).filter((h) => h.nome)
            : [],
        registrosDiarios: Array.isArray(usuario.registrosDiarios)
            ? usuario.registrosDiarios
                .map((registro, index) => normalizarRegistro(registro, index))
                .filter((registro) => registro.data)
            : []
    };
}

function getEmojiHumor(nivel) {
    const mapa = { 1: '😢', 2: '😐', 3: '🙂', 4: '😄' };
    return mapa[Number(nivel)] || '🙂';
}

function buscarUsuarioPorEmail(email) {
    const usuarios = lerUsuarios();
    const indice = usuarios.findIndex((item) => normalizarEmail(item.email) === normalizarEmail(email));
    return {
        usuarios,
        indice,
        usuario: indice >= 0 ? usuarios[indice] : null
    };
}

function obterEmailDaRequisicao(req) {
    return normalizarEmail(req.body && req.body.email)
        || normalizarEmail(req.query && req.query.email)
        || normalizarEmail(req.headers['x-user-email']);
}

function obterOuCriarRegistro(usuario, data) {
    if (!Array.isArray(usuario.registrosDiarios)) {
        usuario.registrosDiarios = [];
    }

    let registro = usuario.registrosDiarios.find((item) => normalizarDataEntrada(item.data) === data);

    if (!registro) {
        registro = {
            id: `${data}_${Date.now()}`,
            data,
            humor: null,
            habitos: []
        };
        usuario.registrosDiarios.push(registro);
    }

    return registro;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pastaImagens);
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        const nomeBase = path.basename(file.originalname, extensao)
            .toLowerCase()
            .replace(/[^a-z0-9_-]/gi, '_');

        cb(null, `${Date.now()}_${nomeBase}${extensao}`);
    }
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Arquivo enviado não é uma imagem válida.'));
        }
    }
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/verificar-email', (req, res) => {
    const email = normalizarEmail(req.query.email);
    const ignorar = normalizarEmail(req.query.ignorarEmail);

    if (!email) {
        return res.status(400).json({ sucesso: false, mensagem: 'Informe um email para verificação.' });
    }

    const usuarios = lerUsuarios();
    const existe = usuarios.some((usuario) => {
        const emailUsuario = normalizarEmail(usuario.email);
        return emailUsuario === email && emailUsuario !== ignorar;
    });

    return res.json({ sucesso: true, existe });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const emailNormalizado = normalizarEmail(email);

    if (!emailNormalizado || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: 'Informe email e senha.' });
    }

    const usuarios = lerUsuarios();
    const usuario = usuarios.find((item) =>
        normalizarEmail(item.email) === emailNormalizado && item.senha === senha
    );

    if (!usuario) {
        return res.status(401).json({ sucesso: false, mensagem: 'Email ou senha inválidos.' });
    }

    return res.json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso.',
        usuario: normalizarUsuario(usuario)
    });
});

app.get('/usuario', (req, res) => {
    const email = normalizarEmail(req.query.email);

    if (!email) {
        return res.status(400).json({ sucesso: false, mensagem: 'Informe o email do usuário.' });
    }

    const { usuario } = buscarUsuarioPorEmail(email);

    if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
    }

    return res.json({ sucesso: true, usuario: normalizarUsuario(usuario) });
});

app.post('/cadastrar', upload.single('foto'), (req, res) => {
    try {
        const nome = limparTexto(req.body.nome);
        const email = limparTexto(req.body.email);
        const senha = limparTexto(req.body.senha);

        if (!nome || !email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome, email e senha são obrigatórios.'
            });
        }

        const usuarios = lerUsuarios();
        const emailNormalizado = normalizarEmail(email);
        const emailJaExiste = usuarios.some((usuario) => normalizarEmail(usuario.email) === emailNormalizado);

        if (emailJaExiste) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este email já está cadastrado.'
            });
        }

        const caminhoFoto = req.file ? `usersImg/${req.file.filename}` : '';

        const novoUsuario = {
            nome,
            email,
            senha,
            foto: caminhoFoto,
            habitosPadrao: [],
            registrosDiarios: []
        };

        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso.',
            usuario: normalizarUsuario(novoUsuario)
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar usuário no users.json.'
        });
    }
});

app.put('/usuario', upload.single('foto'), (req, res) => {
    try {
        const emailAtual = normalizarEmail(req.body.emailAtual);
        const nome = limparTexto(req.body.nome);
        const email = limparTexto(req.body.email);
        const senha = limparTexto(req.body.senha);
        const manterFoto = req.body.manterFoto;

        if (!emailAtual || !nome || !email || !senha) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nome, email e senha são obrigatórios.'
            });
        }

        const usuarios = lerUsuarios();
        const indiceUsuario = usuarios.findIndex((usuario) => normalizarEmail(usuario.email) === emailAtual);

        if (indiceUsuario === -1) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado.'
            });
        }

        const novoEmailNormalizado = normalizarEmail(email);
        const emailJaExiste = usuarios.some((usuario, indice) =>
            indice !== indiceUsuario && normalizarEmail(usuario.email) === novoEmailNormalizado
        );

        if (emailJaExiste) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(409).json({
                sucesso: false,
                mensagem: 'Este email já está cadastrado.'
            });
        }

        const usuarioAtual = usuarios[indiceUsuario];
        let caminhoFoto = limparTexto(usuarioAtual.foto);

        if (req.file) {
            if (caminhoFoto) {
                const caminhoAntigo = path.join(__dirname, caminhoFoto);
                if (fs.existsSync(caminhoAntigo)) {
                    fs.unlinkSync(caminhoAntigo);
                }
            }
            caminhoFoto = `usersImg/${req.file.filename}`;
        } else if (manterFoto === 'false') {
            if (caminhoFoto) {
                const caminhoAntigo = path.join(__dirname, caminhoFoto);
                if (fs.existsSync(caminhoAntigo)) {
                    fs.unlinkSync(caminhoAntigo);
                }
            }
            caminhoFoto = '';
        }

        usuarios[indiceUsuario] = {
            ...usuarioAtual,
            nome,
            email,
            senha,
            foto: caminhoFoto,
            habitosPadrao: Array.isArray(usuarioAtual.habitosPadrao) ? usuarioAtual.habitosPadrao : [],
            registrosDiarios: Array.isArray(usuarioAtual.registrosDiarios) ? usuarioAtual.registrosDiarios : []
        };

        salvarUsuarios(usuarios);

        return res.json({
            sucesso: true,
            mensagem: 'Dados atualizados com sucesso.',
            usuario: normalizarUsuario(usuarios[indiceUsuario])
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar usuário.'
        });
    }
});

app.get('/registros', (req, res) => {
    const email = obterEmailDaRequisicao(req);
    const data = normalizarDataEntrada(req.query.data);
    const humorNivel = Number(req.query.humorNivel || 0);

    if (!email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Não foi possível identificar o usuário logado.'
        });
    }

    const { usuario } = buscarUsuarioPorEmail(email);

    if (!usuario) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado.'
        });
    }

    let registros = Array.isArray(usuario.registrosDiarios)
        ? usuario.registrosDiarios
            .map((registro, index) => normalizarRegistro(registro, index))
            .filter((registro) => registro.data)
        : [];

    if (data) {
        registros = registros.filter((registro) => registro.data === data);
    }

    if (humorNivel >= 1 && humorNivel <= 4) {
        registros = registros.filter((registro) =>
            registro.humor && Number(registro.humor.nivelDoHumor) === humorNivel
        );
    }

    registros.sort((a, b) => String(b.data).localeCompare(String(a.data)));

    return res.json({ sucesso: true, registros });
});

app.get('/dashboard', (req, res) => {
    const email = obterEmailDaRequisicao(req);

    if (!email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Não foi possível identificar o usuário logado.'
        });
    }

    const { usuario } = buscarUsuarioPorEmail(email);

    if (!usuario) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado.'
        });
    }

    const registros = Array.isArray(usuario.registrosDiarios)
        ? usuario.registrosDiarios
            .map((registro, index) => normalizarRegistro(registro, index))
            .filter((registro) => registro.data)
        : [];

    const totalRegistros = registros.length;
    const ultimoRegistro = registros.slice().sort((a, b) => String(b.data).localeCompare(String(a.data)))[0] || null;
    const habitosTotais = registros.reduce((acc, registro) =>
        acc + (Array.isArray(registro.habitos) ? registro.habitos.length : 0), 0);
    const habitosConcluidos = registros.reduce((acc, registro) =>
        acc + (Array.isArray(registro.habitos) ? registro.habitos.filter((h) => h.concluido).length : 0), 0);

    const registrosComHumor = registros.filter((r) => r.humor && r.humor.nivelDoHumor);
    const mediaHumor = registrosComHumor.length
        ? registrosComHumor.reduce((acc, r) => acc + Number(r.humor.nivelDoHumor), 0) / registrosComHumor.length
        : 0;

    return res.json({
        sucesso: true,
        resumo: {
            totalRegistros,
            habitosTotais,
            habitosConcluidos,
            percentualHabitos: habitosTotais ? Math.round((habitosConcluidos / habitosTotais) * 100) : 0,
            mediaHumor: Number(mediaHumor.toFixed(1)),
            ultimoRegistro: ultimoRegistro
                ? {
                    ...ultimoRegistro,
                    emojiHumor: ultimoRegistro.humor ? getEmojiHumor(ultimoRegistro.humor.nivelDoHumor) : ''
                }
                : null
        }
    });
});

app.post('/registros/humor', (req, res) => {
    const email = obterEmailDaRequisicao(req);
    const data = normalizarDataEntrada(req.body.data);
    const nivelDoHumor = Number(req.body.nivelDoHumor);
    const observacao = limparTexto(req.body.observacao);

    if (!email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Não foi possível identificar o usuário logado.'
        });
    }

    if (!validarDataISO(data) || !(nivelDoHumor >= 1 && nivelDoHumor <= 4)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe uma data válida e selecione um nível de humor entre 1 e 4.'
        });
    }

    const { usuarios, indice, usuario } = buscarUsuarioPorEmail(email);

    if (!usuario) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado.'
        });
    }

    const registro = obterOuCriarRegistro(usuario, data);
    registro.humor = normalizarHumor({ nivelDoHumor, observacao });

    usuarios[indice] = normalizarUsuario(usuario);
    salvarUsuarios(usuarios);

    return res.json({
        sucesso: true,
        mensagem: 'Humor registrado com sucesso.',
        registro: normalizarRegistro(registro)
    });
});

app.post('/registros/habitos', (req, res) => {
    const email = obterEmailDaRequisicao(req);
    const data = normalizarDataEntrada(req.body.data);
    const habitos = Array.isArray(req.body.habitos) ? req.body.habitos : [];

    if (!email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Não foi possível identificar o usuário logado.'
        });
    }

    if (!validarDataISO(data)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Informe uma data válida.'
        });
    }

    const habitosNormalizados = habitos
        .map(normalizarHabito)
        .filter((h) => h.nome);

    const { usuarios, indice, usuario } = buscarUsuarioPorEmail(email);

    if (!usuario) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado.'
        });
    }

    const registro = obterOuCriarRegistro(usuario, data);

    registro.habitos = habitosNormalizados;

    const mapaHabitos = new Map(
        (Array.isArray(usuario.habitosPadrao) ? usuario.habitosPadrao : [])
            .map((h) => [h.nome.toLowerCase(), normalizarHabito(h)])
    );

    registro.habitos.forEach((h) => {
        mapaHabitos.set(h.nome.toLowerCase(), { nome: h.nome, concluido: false });
    });

    usuario.habitosPadrao = Array.from(mapaHabitos.values());

    usuarios[indice] = normalizarUsuario(usuario);
    salvarUsuarios(usuarios);

    return res.json({
        sucesso: true,
        mensagem: 'Hábitos registrados com sucesso.',
        registro: normalizarRegistro(registro),
        habitosPadrao: usuario.habitosPadrao
    });
});

app.delete('/registros/:data', (req, res) => {
    const email = obterEmailDaRequisicao(req);
    const data = normalizarDataEntrada(req.params.data);

    if (!email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Não foi possível identificar o usuário logado.'
        });
    }

    if (!validarDataISO(data)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Data do registro inválida.'
        });
    }

    const { usuarios, indice, usuario } = buscarUsuarioPorEmail(email);

    if (!usuario) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado.'
        });
    }

    if (!Array.isArray(usuario.registrosDiarios)) {
        usuario.registrosDiarios = [];
    }

    const totalAntes = usuario.registrosDiarios.length;

    usuario.registrosDiarios = usuario.registrosDiarios.filter((registro) => {
        return normalizarDataEntrada(registro.data) !== data;
    });

    if (usuario.registrosDiarios.length === totalAntes) {
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Registro não encontrado.'
        });
    }

    usuarios[indice] = normalizarUsuario(usuario);
    salvarUsuarios(usuarios);

    return res.json({
        sucesso: true,
        mensagem: 'Registro excluído com sucesso.'
    });
});

app.use((error, req, res, next) => {
    return res.status(400).json({
        sucesso: false,
        mensagem: error.message || 'Erro na requisição.'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});