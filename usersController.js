import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

import { generateToken } from './mddleware/auth.js';

const filePath = path.resolve('./db.json');

// POST 
export const login = (req, res) => {
    const { nome, email, senha } = req.body;
    const data = readData();
    const user = data.find(u => u.nome === nome);

    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    // senha
    if (!bcrypt.compareSync(senha, user.senha)) {
        return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = generateToken(user);
    res.json({ token });
};

// HELPER ler
const readData = () => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// HELPER salvar
const saveData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET todos
export const getDados = (req, res) => {
    const id = parseInt(req.params.id);
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
  
    const data = readData();
    res.json(data);
};

// GET por ID
export const getDadoId = (req, res) => {
    const id = parseInt(req.params.id);
    if (req.user.id !== id) {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    const data = readData();
    const item = data.find(d => d.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: "Item não encontrado" });
    }
};

// POST
export const criaDado = (req, res) => {
    const data = readData();
    const { nome, email, senha } = req.body;

    if (!senha) return res.status(400).json({ message: 'Senha é obrigatória' });

    const hashedPassword = bcrypt.hashSync(senha, 8);

    const newDado = {
        id: data.length ? data[data.length - 1].id + 1 : 1,
        nome,
        email,
        senha: hashedPassword
    };

    data.push(newDado);
    saveData(data);
    res.status(201).json({ id: newDado.id, nome: newDado.nome, email: newDado.email });
};

// PUT
export const atualizaDado = (req, res) => {
    const id = parseInt(req.params.id);
    if (req.user.id !== id) {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    const data = readData();
    const index = data.findIndex(d => d.id === id);
    if (index !== -1) {
        // atualiza sem mudar senha
        const updated = { ...data[index], ...req.body, id };
        data[index] = updated;
        saveData(data);
        res.json({ id: updated.id, nome: updated.nome, email: updated.email });
    } else {
        res.status(404).json({ message: 'Item não encontrado' });
    }
};

// DELETE
export const deletaDado = (req, res) => {
    const id = parseInt(req.params.id);
    if (req.user.id !== id) {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    let data = readData();
    const index = data.findIndex(d => d.id === id);
    if (index !== -1) {
        const removed = data.splice(index, 1);
        saveData(data);
        res.json(removed[0]);
    } else {
        res.status(404).json({ message: 'Item não encontrado' });
    }
};
