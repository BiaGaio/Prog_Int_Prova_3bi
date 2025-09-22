
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'db.json');

const loadAlunos = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
    return { alunos: [], nextId: 1 };
};

const saveAlunos = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
    }
};

let { alunos, nextId } = loadAlunos();

const getDados = () => alunos;

const getDadoId = (id) => {
    const alunoId = parseInt(id);
    return alunos.find(aluno => aluno.id === alunoId);
};

const criaDado = (alunoData) => {
    const novoAluno = {
        id: nextId++,
        ...alunoData
    };
    alunos.push(novoAluno);

    saveAlunos({ alunos, nextId });
    return novoAluno;
};

const atualizaDado = (id, alunoData) => {
    const alunoId = parseInt(id);
    const index = alunos.findIndex(aluno => aluno.id === alunoId);

    if (index !== -1) {
        alunos[index] = { id: alunoId, ...alunoData };


        saveAlunos({ alunos, nextId });
        return alunos[index];
    }

    return null;
};

const deletaDado = (id) => {
    const alunoId = parseInt(id);
    const index = alunos.findIndex(aluno => aluno.id === alunoId);

    if (index !== -1) {
        alunos.splice(index, 1);


        saveAlunos({ alunos, nextId });
        return true;
    }

    return false;
};

module.exports = {
    getDados,
    getDadoId,
    criaDado,
    atualizaDado,
    deletaDado
}; 
