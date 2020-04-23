import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, InputError } from './styles';

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@GithuExplorer:repositories',
    );

    return storageRepositories ? JSON.parse(storageRepositories) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithuExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o nome do autor/repositório');
      return;
    }

    try {
      const response = await api.get(`repos/${newRepo}`);

      const responsetory = response.data;

      setRepositories([...repositories, responsetory]);
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositório');
    }

    setNewRepo('');
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore reporitórios no GitHub</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          type="text"
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <InputError>{inputError}</InputError>}

      <Repositories>
        {repositories &&
          repositories.map((repository) => (
            <Link
              to={`repositories/${repository.full_name}`}
              key={`${repository}`}
            >
              <img
                src={`${repository.owner.avatar_url}`}
                alt={`${repository.full_name}`}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
