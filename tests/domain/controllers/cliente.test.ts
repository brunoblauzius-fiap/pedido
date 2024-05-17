import { Request, Response } from 'express';
import ClienteController from '../../../controllers/ClienteController';
import { ClienteCasoDeUso } from '../../../cases/clienteCasodeUso';
import * as HttpStatus from 'http-status';
import ResponseAPI from '../../../adapters/ResponseAPI';
import ResponseErrors from '../../../adapters/ResponseErrors';
import ClienteRepository from '../../../gateways/ClienteRepository';
import Cliente from '../../../entity/cliente';
import BadRequestError from '../../../application/exception/BadRequestError';
import mockDataBase from '../../../mockDatabase/MockDataBase';
import ICliente from '../../../interfaces/ICliente';

jest.mock('../../../cases/clienteCasodeUso');
jest.mock('../../../adapters/ResponseAPI');
// Mock the ResponseErrors module
jest.mock('../../../adapters/ResponseErrors', () => {
    const originalModule = jest.requireActual('../../../adapters/ResponseErrors');
    return {
        __esModule: true,
        default: {
            err: jest.fn((response, err) => originalModule.default.err(response, err)),
        },
    };
});
// Mocking the ClienteRepository
const mockRepository: jest.Mocked<ICliente> = {
    db: {} as any,  // Assuming db is an object, you can customize it if needed
    getAll: jest.fn(),
    update: jest.fn(),
    store: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(), // Add this line if findByEmail method exists in ClienteRepository
    findByCPF: jest.fn(),   // Add this line if findByCPF method exists in ClienteRepository
};

const controller = new ClienteController(mockDataBase);

describe('ClienteController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      body: {},
      params: {},
      query: {}
    };

    mockResponse = {
      status: responseStatus
    };
  });

  describe('all', () => {
    it('should return all clients', async () => {
      const mockData = [{ name: 'Client1' }];
      (ClienteCasoDeUso.getAllClientes as jest.Mock).mockResolvedValue(mockData);

      await controller.all(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseJson).toHaveBeenCalledWith(ResponseAPI.list(mockData));
    });

    it('should handle errors', async () => {
        const error = new Error('Some error');
        // Mocking the behavior of ClienteCasoDeUso.getAllClientes to throw an error
        (ClienteCasoDeUso.getAllClientes as jest.Mock).mockRejectedValueOnce(error);

        // Execute the method under test
        await controller.all(mockRequest as Request, mockResponse as Response);

        // Verify that ResponseErrors.err is called with the correct arguments
        expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
    });
  });

  describe('store', () => {
    it('should create a new client', async () => {
      mockRequest.body = { name: 'Client1', email: 'client1@example.com', cpf_cnpj: '31759487740' };
      const mockClient = new Cliente('Client1', 'client1@example.com', '31759487740');
      const mockData = { id: '1', name: 'Client1' };
      (ClienteCasoDeUso.criarCliente as jest.Mock).mockResolvedValue(mockData);

      await controller.store(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseJson).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors', async () => {
      const error = new Error('Nome do cliente é obrigatório.');
      (ClienteCasoDeUso.criarCliente as jest.Mock).mockRejectedValue(error);

      await controller.store(mockRequest as Request, mockResponse as Response);

      expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
    });
  });

  describe('update', () => {
    it('should update an existing client', async () => {
      mockRequest.body = { name: 'Updated Client', email: 'updated@example.com', cpf_cnpj: '45553466539' };
      mockRequest.params = { id: '1' };
      const mockClient = new Cliente('Updated Client', 'updated@example.com', '45553466539');
      const mockData = { id: '1', name: 'Updated Client' };
      (ClienteCasoDeUso.atualizarCliente as jest.Mock).mockResolvedValue(mockData);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseJson).toHaveBeenCalledWith(ResponseAPI.data(mockData));
    });

    it('should handle errors', async () => {
      const error = new Error('Nome do cliente é obrigatório.');
      (ClienteCasoDeUso.atualizarCliente as jest.Mock).mockRejectedValue(error);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
    });
  });

  describe('show', () => {
    it('should return a client by id', async () => {
      mockRequest.params = { id: '1' };
      const mockData = { id: '1', name: 'Client1' };
      (ClienteCasoDeUso.encontrarClientePorId as jest.Mock).mockResolvedValue(mockData);

      await controller.show(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseJson).toHaveBeenCalledWith(ResponseAPI.data(mockData));
    });

    it('should handle errors', async () => {
      const error = new Error('ID do registro é requerido.');
      (ClienteCasoDeUso.encontrarClientePorId as jest.Mock).mockRejectedValue(error);

      await controller.show(mockRequest as Request, mockResponse as Response);

      expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
    });

    it('should handle missing id', async () => {
      mockRequest.params = { id: '' };

      await controller.show(mockRequest as Request, mockResponse as Response);

      expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, new BadRequestError('ID do registro é requerido.'));
    });
  });

  describe('identifyByCPF', () => {
    it('should return a client by CPF', async () => {
      mockRequest.params = { cpfcnpj: '123456789' };
      const mockData = { id: '1', name: 'Client1', cpf_cnpj: '123456789' };
      mockRepository.findByCPF.mockResolvedValue(mockData);

      await controller.identifyByCPF(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseJson).toHaveBeenCalledWith(ResponseAPI.data(mockData));
    });

    it('should handle errors', async () => {
      const error = new Error('CPF do registro é requerido.');
      mockRepository.findByCPF.mockRejectedValue(error);

      await controller.identifyByCPF(mockRequest as Request, mockResponse as Response);

      expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
    });

    it('should handle missing cpfcnpj', async () => {
      mockRequest.params = { cpfcnpj: '' };

      await controller.identifyByCPF(mockRequest as Request, mockResponse as Response);

      expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, new BadRequestError('CPF do registro é requerido.'));
    });
  });

  describe('delete', () => {
    it('should delete a client by id', async () => {
      mockRequest.params = { id: '1' };

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(responseJson).toHaveBeenCalledWith({});
    });

   

    it('should handle missing id', async () => {
      mockRequest.params = { id: '' };

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(responseJson).toHaveBeenCalledWith(ResponseAPI.inputError('id', 'ID do registro é requerido.'));
    });
  });
});
