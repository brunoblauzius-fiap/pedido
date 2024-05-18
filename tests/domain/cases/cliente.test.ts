import BadRequestError from '../../../application/exception/BadRequestError';
import Cliente from '../../../entity/cliente';
import { ClienteCasoDeUso } from '../../../cases/clienteCasodeUso';
import ICliente from '../../../interfaces/ICliente';


// Mock da implementação da interface ICliente
const mockClienteRepositorio: jest.Mocked<ICliente> = {
    db: {} as any,  // Assuming db is an object, you can customize it if needed
    getAll: jest.fn(),
    update: jest.fn(),
    store: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(), // Add this line if findByEmail method exists in ClienteRepository
    findByCPF: jest.fn(),   // Add this line if findByCPF method exists in ClienteRepository
};


describe('ClienteCasoDeUso', () => {
    describe('criarCliente', () => {
        it('should create a new client', async () => {
            // Mockando os métodos findByCPF e findByEmail para retornar null (cliente não encontrado)
            mockClienteRepositorio.findByCPF.mockResolvedValueOnce(null);
            mockClienteRepositorio.findByEmail.mockResolvedValueOnce(null);

            // Criando um cliente fictício
            const cliente = new Cliente('John Doe', 'john@example.com', '45553466539');

            // Configurando o mock do método store para retornar o cliente criado
            mockClienteRepositorio.store.mockResolvedValueOnce(cliente);

            // Executando a função criarCliente
            const result = await ClienteCasoDeUso.criarCliente(cliente, mockClienteRepositorio);

            // Verificando se a função retorna o cliente criado
            expect(result).toEqual(cliente);

            // Verificando se os métodos findByCPF e findByEmail foram chamados
            expect(mockClienteRepositorio.findByCPF).toHaveBeenCalledWith('45553466539');
            expect(mockClienteRepositorio.findByEmail).toHaveBeenCalledWith('john@example.com');
        });

        it('should throw BadRequestError if email is already registered', async () => {
            // Mockando o método findByEmail para retornar um cliente (email já cadastrado)
            mockClienteRepositorio.findByEmail.mockResolvedValueOnce(new Cliente('John Doe', 'john@example.com', '45553466539'));

            // Criando um cliente fictício
            const cliente = new Cliente('John Doe', 'john@example.com', '45553466539');

            // Executando a função criarCliente e verificando se ela lança um BadRequestError
            await expect(ClienteCasoDeUso.criarCliente(cliente, mockClienteRepositorio)).rejects.toThrowError(BadRequestError);
        });
        it('should throw BadRequestError if email already exists', async () => {
            // Mockando o retorno do método findByEmail para simular um email já cadastrado
            mockClienteRepositorio.findByEmail.mockResolvedValueOnce(new Cliente('John Doe', 'john@example.com', '45553466539'));
    
            // Criando um cliente com email já existente
            const cliente = new Cliente('Jane Doe', 'john@example.com', '45553466539');
    
            // Verificando se uma BadRequestError é lançada quando tentamos criar o cliente
            await expect(ClienteCasoDeUso.criarCliente(cliente, mockClienteRepositorio)).rejects.toThrowError(BadRequestError);
        });
    
        it('should throw BadRequestError if CPF or CNPJ already exists', async () => {
            // Mockando o retorno do método findByCPF para simular um CPF ou CNPJ já cadastrado
            mockClienteRepositorio.findByCPF.mockResolvedValueOnce(new Cliente('John Doe', 'john@example.com', '45553466539'));
    
            // Criando um cliente com CPF ou CNPJ já existente
            const cliente = new Cliente('Jane Doe', 'jane@example.com', '45553466539');
    
            // Verificando se uma BadRequestError é lançada quando tentamos criar o cliente
            await expect(ClienteCasoDeUso.criarCliente(cliente, mockClienteRepositorio)).rejects.toThrowError(BadRequestError);
        });
    
        it('should create a new client if email and CPF/CNPJ are unique', async () => {
            // Mockando o retorno dos métodos findByEmail e findByCPF para simular que o cliente não está cadastrado
            mockClienteRepositorio.findByEmail.mockResolvedValueOnce(null);
            mockClienteRepositorio.findByCPF.mockResolvedValueOnce(null);
    
            // Criando um cliente sem email ou CPF/CNPJ já cadastrados
            const cliente = new Cliente('Jane Doe', 'jane@example.com', '45553466539');
    
            // Configurando o mock do método store para retornar o cliente criado
            mockClienteRepositorio.store.mockResolvedValueOnce(cliente);
    
            // Verificando se o cliente é criado com sucesso
            const result = await ClienteCasoDeUso.criarCliente(cliente, mockClienteRepositorio);
            expect(result).toEqual(cliente);
        });
        it('should throw BadRequestError if client is not found', async () => {
            // Mockando o retorno do método findById para simular um cliente não encontrado
            mockClienteRepositorio.findById.mockResolvedValueOnce(null);
    
            // Criando um cliente a ser atualizado
            const cliente = new Cliente('Jane Doe', 'jane@example.com', '45553466539');
    
            // Verificando se uma BadRequestError é lançada quando tentamos atualizar o cliente
            await expect(ClienteCasoDeUso.atualizarCliente(cliente, 1, mockClienteRepositorio)).rejects.toThrowError(BadRequestError);
        });
    
        // it('should throw BadRequestError if CPF or CNPJ already exists', async () => {
        //     // Mockando o retorno do método findById para simular um cliente encontrado
        //     mockClienteRepositorio.findById.mockResolvedValueOnce(new Cliente('Jane Doe', 'jane@example.com', '45553466539'));
    
        //     // Mockando o retorno do método findByCPF para simular um CPF ou CNPJ já cadastrado
        //     mockClienteRepositorio.findByCPF.mockResolvedValueOnce(new Cliente('Another Client', 'another@example.com', '45553466539'));
    
        //     // Criando um cliente a ser atualizado com um CPF ou CNPJ já existente
        //     const cliente = new Cliente('Updated Jane Doe', 'jane@example.com', '45553466539');
    
        //     // Verificando se uma BadRequestError é lançada quando tentamos atualizar o cliente
        //     await expect(ClienteCasoDeUso.atualizarCliente(cliente, 1, mockClienteRepositorio)).rejects.toThrowError(BadRequestError);
        // });
    
        it('should throw BadRequestError if email already exists', async () => {
            // Mockando o retorno do método findById para simular um cliente encontrado
            mockClienteRepositorio.findById.mockResolvedValueOnce(new Cliente('Jane Doe', 'jane@example.com', '45553466539'));
    
            // Mockando o retorno do método findByEmail para simular um email já cadastrado
            mockClienteRepositorio.findByEmail.mockResolvedValueOnce(new Cliente('Another Client', 'another@example.com', '45553466539'));
    
            // Criando um cliente a ser atualizado com um email já existente
            const cliente = new Cliente('Updated Jane Doe', 'another@example.com', '45553466539');
    
            // Verificando se uma BadRequestError é lançada quando tentamos atualizar o cliente
            await expect(ClienteCasoDeUso.atualizarCliente(cliente, 1, mockClienteRepositorio)).rejects.toThrowError(BadRequestError);
        });
    
        it('should update client if no conflicts exist', async () => {
            // Mockando o retorno dos métodos findById, findByCPF e findByEmail para simular que o cliente está cadastrado e sem conflitos
            mockClienteRepositorio.findById.mockResolvedValueOnce(new Cliente('Jane Doe', 'jane@example.com', '45553466539'));
            mockClienteRepositorio.findByCPF.mockResolvedValueOnce(null);
            mockClienteRepositorio.findByEmail.mockResolvedValueOnce(null);
    
            // Criando um cliente a ser atualizado
            const cliente = new Cliente('Updated Jane Doe', 'updated@example.com', '45553466539');
    
            // Configurando o mock do método update para retornar o cliente atualizado
            mockClienteRepositorio.update.mockResolvedValueOnce(cliente);
    
            // Verificando se o cliente é atualizado com sucesso
            const result = await ClienteCasoDeUso.atualizarCliente(cliente, 1, mockClienteRepositorio);
            expect(result).toEqual(cliente);
        });
        it('should return client if found by ID', async () => {
            // Criando um cliente simulado
            const cliente = new Cliente('John Doe', 'john@example.com', '45553466539');
    
            // Mockando o retorno do método findById para simular que o cliente foi encontrado
            mockClienteRepositorio.findById.mockResolvedValueOnce(cliente);
    
            // Verificando se o cliente é retornado corretamente
            const result = await ClienteCasoDeUso.encontrarClientePorId(1, mockClienteRepositorio);
            expect(result).toEqual(cliente);
        });
        it('should return cliente when found by CPF', async () => {
            
            // Dados de entrada
            const cliente = new Cliente('John Doe', 'john@example.com', '14682965662');
          
             // Configurando o mock do método store para retornar o cliente criado
             mockClienteRepositorio.findByCPF.mockResolvedValueOnce(cliente);

             // Executando a função criarCliente
             let result=await ClienteCasoDeUso.criarCliente(cliente, mockClienteRepositorio);
             const clientex = await ClienteCasoDeUso.encontrarClientePorCPF(cliente.cpf_cnpj, mockClienteRepositorio);
             // Verificando se a função retorna o cliente criado
             expect(cliente).toEqual(clientex);
        });
        it('should delete a cliente by ID', async () => {
            // Mock do ID do cliente
            const clientId = '1';
    
            // Chama o método deleteCliente
            await ClienteCasoDeUso.deleteCliente(clientId, mockClienteRepositorio);
    
            // Verifica se o método delete do clienteRepositorio foi chamado com o ID correto
            expect(mockClienteRepositorio.delete).toHaveBeenCalledWith(clientId);
        });

        it('should return all clients', async () => {
            // Mock dos clientes a serem retornados pelo repositório
            const mockClientes = [
              { id: 1, nome: 'Cliente 1', email: 'cliente1@example.com', cpf_cnpj: '12345678900' },
              { id: 2, nome: 'Cliente 2', email: 'cliente2@example.com', cpf_cnpj: '98765432100' },
            ];
        
            // Configuração do mock do método getAll do ClienteRepositorio
            mockClienteRepositorio.getAll.mockResolvedValue(mockClientes);
        
            // Chama o método getAllClientes do ClienteCasoDeUso
            const result = await ClienteCasoDeUso.getAllClientes(null, mockClienteRepositorio);
        
            // Verifica se o método retorna os clientes esperados
            expect(result).toEqual(mockClientes);
          });

    });
});
