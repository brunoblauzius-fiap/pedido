import ClienteRepository from './../../../gateways/ClienteRepository';
import Cliente from './../../../entity/cliente';
import  mockDataBase from '../../../mockDatabase/MockDataBase';


describe('ClienteRepository', () => {
    let clienteRepository: ClienteRepository;
  
    beforeEach(() => {
      // Antes de cada teste, criar uma nova instância do ClienteRepository com o mock do banco de dados
      clienteRepository = new ClienteRepository(mockDataBase);
    });
  
    afterEach(() => {
      // Limpar todos os mocks após cada teste
      jest.clearAllMocks();
    });
  
    it('getAll retorna null quando não há clientes', async () => {
      const clientes = await clienteRepository.getAll({});
      expect(clientes).toBeNull();
    });
  
    it('update atualiza um cliente corretamente', async () => {
      const cliente = new Cliente('Nome', 'email@example.com', '31759487740');
      const id =1;
      
      await clienteRepository.update(cliente, id);
      expect(mockDataBase.update).toHaveBeenCalledWith(
        'cliente',
        [
          { campo: 'name', valor: cliente.name },
          { campo: 'email', valor: cliente.email },
          { campo: 'cpf_cnpj', valor: cliente.cpf_cnpj },
          { campo: 'modified', valor: expect.any(Date) }
        ],
        [{ campo: 'id', valor: id }]
      );
    });

    it('getAll should return all clients when no parameters are provided', async () => {
      mockDataBase.find.mockResolvedValue([
        { id: 1, name: 'Cliente 1', email: 'cliente1@example.com', cpf_cnpj: '12345678900' },
        { id: 2, name: 'Cliente 2', email: 'cliente2@example.com', cpf_cnpj: '98765432100' }
      ])
      const clientes = await clienteRepository.getAll({});
      expect(clientes).toHaveLength(2);
      expect(clientes[0].name).toEqual('Cliente 1');
      expect(clientes[1].name).toEqual('Cliente 2');
    });
  
    it('getAll should filter clients by email', async () => {
      mockDataBase.find.mockResolvedValue([
        { id: 1, name: 'Cliente 1', email: 'cliente1@example.com', cpf_cnpj: '12345678900' }
      ])
      const clientes = await clienteRepository.getAll({ email: 'cliente1@example.com' });
      expect(clientes).toHaveLength(1);
      expect(clientes[0].name).toEqual('Cliente 1');
    });
  
    it('getAll should filter clients by CPF/CNPJ', async () => {
      mockDataBase.find.mockResolvedValue([
        { id: 2, name: 'Cliente 2', email: 'cliente2@example.com', cpf_cnpj: '98765432100' }
      ])
      const clientes = await clienteRepository.getAll({ cpf_cnpj: '98765432100' });
      expect(clientes).toHaveLength(1);
      expect(clientes[0].name).toEqual('Cliente 2');
    });
    it('should store a new client', async () => {
      // Mocking database response
      const mockInsertId = 1;
      mockDataBase.store.mockResolvedValue({ insertId: mockInsertId });

      // Creating a mock client
      const mockClient = new Cliente('Mock Client', 'mock@example.com', '98765432100');

      // Calling the method
      const newClient = await clienteRepository.store(mockClient);

      // Verifying if the method was called with the correct parameters
      expect(mockDataBase.store).toHaveBeenCalledWith(
          'cliente',
          [
              { campo: 'name', valor: 'Mock Client' },
              { campo: 'email', valor: 'mock@example.com' },
              { campo: 'cpf_cnpj', valor: '98765432100' },
              { campo: 'created', valor: expect.any(Date)  },
              { campo: 'modified', valor: expect.any(Date)  },
              // Assuming 'created' and 'modified' fields are set automatically by the database
          ]
      );

      // Verifying the return value
      expect(newClient).toBeInstanceOf(Cliente);
      expect(newClient.id).toEqual(mockInsertId);
      expect(newClient.name).toEqual('Mock Client');
      expect(newClient.email).toEqual('mock@example.com');
      expect(newClient.cpf_cnpj).toEqual('98765432100');
  });
    it('deve excluir o cliente corretamente', async () => {
      // Criando um cliente para excluir
      mockDataBase.find.mockResolvedValue([
      ])
      mockDataBase.store.mockResolvedValue([
        { id: 2, name: 'Novo Cliente', email: 'novo@cliente.com', cpf_cnpj: '98765432100' }
      ])
      const newClient = new Cliente('Novo Cliente', 'novo@cliente.com', '98765432100');
      const storedClient = await clienteRepository.store(newClient);

      // Excluindo o cliente
      const deleteResult = await clienteRepository.delete(storedClient.id);

      // Verifica se o cliente não está mais presente no banco de dados
      const foundClient = await clienteRepository.findById(storedClient.id);
      expect(foundClient).toBeNull();
    });

    it('deve retornar false se o cliente não for encontrado para exclusão', async () => {
      // Tentando excluir um cliente que não existe (supondo que o ID 999 não exista)
      // Criando um cliente para excluir
      const newClient = new Cliente('Novo Cliente', 'novo@cliente.com', '98765432100');
      newClient.id=999;
      const deleteResult = await clienteRepository.delete(newClient.id);

      expect(deleteResult).toBeFalsy(); // Verifica se a exclusão retorna false quando o cliente não é encontrado
    });
    it('deve retornar o cliente corretamente se encontrado', async () => {

      mockDataBase.find.mockResolvedValue([
        { id: 2, name: 'Cliente 2', email: 'cliente2@example.com', cpf_cnpj: '98765432100' }
      ])
      // Criando um cliente para excluir
      const newClient = new Cliente('Novo Cliente', 'novo@cliente.com', '98765432100');
      const storedClient = await clienteRepository.store(newClient);

      // Executa o método findByCPF
      const cliente = await clienteRepository.findByCPF(storedClient.cpf_cnpj);

      // Verifica se o cliente retornado corresponde ao CPF fornecido
      expect(cliente).toBeInstanceOf(Cliente);
      expect(cliente.cpf_cnpj).toBe(storedClient.cpf_cnpj);
    });

    it('deve retornar null se o cliente não for encontrado', async () => {
      // Simula um CPF que não existe no banco de dados
      mockDataBase.find.mockResolvedValue([
      ])
      const cpf = '12345678900';

      // Executa o método findByCPF
      const cliente = await clienteRepository.findByCPF(cpf);

      // Verifica se o retorno é null, indicando que o cliente não foi encontrado
      expect(cliente).toBeNull();
    });
    it('deve retornar o cliente corretamente se encontrado', async () => {
      // Simula um e-mail existente no banco de dados
      mockDataBase.find.mockResolvedValue([
        { id: 2, name: 'Novo Cliente', email: 'novo@cliente.com', cpf_cnpj: '98765432100' }
      ])
      const email = 'novo@cliente.com';

      // Executa o método findByEmail
      const cliente = await clienteRepository.findByEmail(email);

      // Verifica se o cliente retornado corresponde ao e-mail fornecido
      expect(cliente).toBeInstanceOf(Cliente);
      expect(cliente.email).toBe(email);
    });

    it('deve retornar null se o cliente não for encontrado', async () => {
      mockDataBase.find.mockResolvedValue([
      ]);
      // Simula um e-mail que não existe no banco de dados
      const email = 'naoexiste@teste.com';

      // Executa o método findByEmail
      const cliente = await clienteRepository.findByEmail(email);

      // Verifica se o retorno é null, indicando que o cliente não foi encontrado
      expect(cliente).toBeNull();
    });
  });