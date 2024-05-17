import { Request, Response } from 'express';
import CategoriaController from '../../../controllers/CategoriaController';
import { CategoriaCasoDeUso } from '../../../cases/categoriaCasodeUso';
import * as HttpStatus from 'http-status';
import ResponseAPI from '../../../adapters/ResponseAPI';
import ResponseErrors from '../../../adapters/ResponseErrors';
import mockDataBase from '../../../mockDatabase/MockDataBase';
import IRepository from '../../../interfaces/IRepository';

jest.mock('../../../cases/categoriaCasodeUso');
jest.mock('../../../adapters/ResponseErrors');
jest.mock('../../../adapters/ResponseAPI');

// Mocking the IRepository
const mockRepository: jest.Mocked<IRepository> = {
    db: {} as any,  // Assuming db is an object, you can customize it if needed
    getAll: jest.fn(),
    update: jest.fn(),
    store: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
};

const controller = new CategoriaController(mockDataBase);

describe('CategoriaController', () => {
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
            query: {},
        };

        mockResponse = {
            status: responseStatus,
        };

        jest.clearAllMocks(); // Clear mock calls to ensure a clean state for each test
    });

    describe('all', () => {
        it('should return all categories', async () => {
            const mockData = [{ name: 'Category1' }];
            (CategoriaCasoDeUso.getAllCategorias as jest.Mock).mockResolvedValue(mockData);

            await controller.all(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
            expect(responseJson).toHaveBeenCalledWith(ResponseAPI.list(mockData));
        });

        it('should handle errors', async () => {
            const error = new Error('Some error');
            (CategoriaCasoDeUso.getAllCategorias as jest.Mock).mockRejectedValue(error);

            await controller.all(mockRequest as Request, mockResponse as Response);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('store', () => {
        it('should create a new category', async () => {
            mockRequest.body = { name: 'Category1' };
            const mockData = { id: '1', name: 'Category1' };
            (CategoriaCasoDeUso.criarCategoria as jest.Mock).mockResolvedValue(mockData);

            await controller.store(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
            expect(responseJson).toHaveBeenCalledWith(ResponseAPI.data(mockData));
        });

        it('should handle errors', async () => {
            const error = new Error('O nome da categoria é obrigatório.');
            (CategoriaCasoDeUso.criarCategoria as jest.Mock).mockRejectedValue(error);

            await controller.store(mockRequest as Request, mockResponse as Response);

            expect(ResponseErrors.err).toHaveBeenCalledTimes(1);
            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('update', () => {
        it('should update an existing category', async () => {
            mockRequest.body = { name: 'Updated Category' };
            mockRequest.params = { id: '1' };
            const mockData = { id: '1', name: 'Updated Category' };
            (CategoriaCasoDeUso.atualizarCategoria as jest.Mock).mockResolvedValue(mockData);

            await controller.update(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
            expect(responseJson).toHaveBeenCalledWith(ResponseAPI.data(mockData));
        });

        it('should handle errors', async () => {
            const error = new Error('O nome da categoria é obrigatório.');
            (CategoriaCasoDeUso.atualizarCategoria as jest.Mock).mockRejectedValue(error);

            await controller.update(mockRequest as Request, mockResponse as Response);

            expect(ResponseErrors.err).toHaveBeenCalledTimes(1);
            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('show', () => {
        it('should return a category by id', async () => {
            mockRequest.params = { id: '1' };
            const mockData = { id: '1', name: 'Category1' };
            (CategoriaCasoDeUso.encontrarCategoriaPorId as jest.Mock).mockResolvedValue(mockData);

            await controller.show(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(HttpStatus.OK);
            expect(responseJson).toHaveBeenCalledWith(ResponseAPI.data(mockData));
        });

        it('should handle errors', async () => {
            const error = new Error('Some error');
            (CategoriaCasoDeUso.encontrarCategoriaPorId as jest.Mock).mockRejectedValue(error);

            await controller.show(mockRequest as Request, mockResponse as Response);

            expect(ResponseErrors.err).toHaveBeenCalledTimes(1);
            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
        });
    });

    describe('delete', () => {
        it('should delete a category by id', async () => {
            mockRequest.params = { id: '1' };

            await controller.delete(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(responseJson).toHaveBeenCalledWith({});
        });

        it('should handle errors', async () => {
            const error = new Error('Some error');
            (CategoriaCasoDeUso.deleteCategoria as jest.Mock).mockRejectedValue(error);

            await controller.delete(mockRequest as Request, mockResponse as Response);

            expect(ResponseErrors.err).toHaveBeenCalledTimes(1);
            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, error);
        });
    });
});
