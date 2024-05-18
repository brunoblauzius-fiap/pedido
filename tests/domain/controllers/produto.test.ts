import * as HttpStatus from 'http-status';
import ProdutoController from '../../../controllers/ProdutoController';
import { ProdutoCasoDeUso } from '../../../cases/produtoCasodeUso';
import ProdutoRepository from '../../../gateways/ProdutoRepository';
import CategoriaRepository from '../../../gateways/CategoriaRepository';
import ResponseAPI from '../../../adapters/ResponseAPI';
import ResponseErrors from '../../../adapters/ResponseErrors';
import BadRequestError from '../../../application/exception/BadRequestError';
import { IDataBase } from '../../../interfaces/IDataBase';

jest.mock('../../../cases/produtoCasodeUso');
jest.mock('../../../gateways/ProdutoRepository');
jest.mock('../../../gateways/CategoriaRepository');
jest.mock('../../../adapters/ResponseAPI');
jest.mock('../../../adapters/ResponseErrors');

describe('ProdutoController', () => {
    let produtoController: ProdutoController;
    let mockDbConnection: IDataBase;

    beforeEach(() => {
        mockDbConnection = {} as IDataBase;
        produtoController = new ProdutoController(mockDbConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('store', () => {
        it('should create a new product', async () => {
            const mockRequest = { body: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockData = { id: 1, title: 'New Product' };

            jest.spyOn(ProdutoCasoDeUso, 'criarProduto').mockResolvedValue(mockData);

            await produtoController.store(mockRequest, mockResponse);

            expect(ProdutoCasoDeUso.criarProduto).toHaveBeenCalledWith(mockRequest, produtoController.categoryRepository, produtoController.repository);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(ResponseAPI.data(mockData));
        });

        it('should handle errors', async () => {
            const mockRequest = { body: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Something went wrong');

            jest.spyOn(ProdutoCasoDeUso, 'criarProduto').mockRejectedValue(mockError);

            await produtoController.store(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
    });

    describe('update', () => {
        it('should update a product', async () => {
            const mockRequest = { params: { id: 1 }, body: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockData = { id: 1, title: 'Updated Product' };

            jest.spyOn(ProdutoCasoDeUso, 'atualizarProduto').mockResolvedValue(mockData);

            await produtoController.update(mockRequest, mockResponse);

            expect(ProdutoCasoDeUso.atualizarProduto).toHaveBeenCalledWith(mockRequest, produtoController.categoryRepository, produtoController.repository);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(ResponseAPI.data(mockData));
        });

        it('should handle errors', async () => {
            const mockRequest = { params: { id: 1 }, body: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Something went wrong');

            jest.spyOn(ProdutoCasoDeUso, 'atualizarProduto').mockRejectedValue(mockError);

            await produtoController.update(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
    });

    describe('show', () => {
        it('should return a product by ID', async () => {
            const mockRequest = { params: { id: 1 } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockData = { id: 1, title: 'Product 1' };

            jest.spyOn(ProdutoCasoDeUso, 'encontrarProdutoPorId').mockResolvedValue(mockData);

            await produtoController.show(mockRequest, mockResponse);

            expect(ProdutoCasoDeUso.encontrarProdutoPorId).toHaveBeenCalledWith(mockRequest.params.id, produtoController.repository);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(ResponseAPI.data(mockData));
        });

        it('should handle errors', async () => {
            const mockRequest = { params: { id: 1 } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Product not found');

            jest.spyOn(ProdutoCasoDeUso, 'encontrarProdutoPorId').mockRejectedValue(mockError);

            await produtoController.show(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
    });

    describe('delete', () => {
        it('should delete a product', async () => {
            const mockRequest = { params: { id: 1 } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await produtoController.delete(mockRequest, mockResponse);

            expect(ProdutoCasoDeUso.deleteProduto).toHaveBeenCalledWith(mockRequest.params.id, produtoController.repository);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(mockResponse.json).toHaveBeenCalledWith({});
        });

        it('should handle errors', async () => {
            const mockRequest = { params: { id: 1 } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Failed to delete product');

            jest.spyOn(ProdutoCasoDeUso, 'deleteProduto').mockRejectedValue(mockError);

            await produtoController.delete(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
        it('should return all products', async () => {
            const mockRequest = { query: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockData = [{ id: 1, title: 'Product 1' }];

            jest.spyOn(ProdutoCasoDeUso, 'getAllProdutos').mockResolvedValue(mockData);
            ResponseAPI.list = jest.fn().mockReturnValue({ totals: mockData.length, results: mockData });

            await produtoController.all(mockRequest, mockResponse);

            expect(ProdutoCasoDeUso.getAllProdutos).toHaveBeenCalledWith(mockRequest.query, produtoController.repository);
            expect(ResponseAPI.list).toHaveBeenCalledWith(mockData);
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockResponse.json).toHaveBeenCalledWith({ totals: mockData.length, results: mockData });
        });

        it('should handle errors', async () => {
            const mockRequest = { query: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Failed to fetch products');

            jest.spyOn(ProdutoCasoDeUso, 'getAllProdutos').mockRejectedValue(mockError);

            await produtoController.all(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
        it('should throw BadRequestError if id is not provided', async () => {
            const mockRequest = { params: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await produtoController.show(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, expect.any(BadRequestError));
        });

        it('should handle errors', async () => {
            const mockRequest = { params: { id: 1 } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Product not found');

            jest.spyOn(ProdutoCasoDeUso, 'encontrarProdutoPorId').mockRejectedValue(mockError);

            await produtoController.show(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
        it('should throw BadRequestError if id is not provided', async () => {
            const mockRequest = { params: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await produtoController.delete(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, expect.any(BadRequestError));
        });

        it('should handle errors', async () => {
            const mockRequest = { params: { id: 1 } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Failed to delete product');

            jest.spyOn(ProdutoCasoDeUso, 'deleteProduto').mockRejectedValue(mockError);

            await produtoController.delete(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
        it('should throw BadRequestError if category_id is not provided', async () => {
            const mockRequest = { params: {} };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await produtoController.getByidCategory(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, expect.any(BadRequestError));
        });

        it('should handle errors', async () => {
            const mockRequest = { params: { category_id: 1 } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockError = new Error('Failed to find products by category');

            jest.spyOn(ProdutoCasoDeUso, 'findByCategory').mockRejectedValue(mockError);

            await produtoController.getByidCategory(mockRequest, mockResponse);

            expect(ResponseErrors.err).toHaveBeenCalledWith(mockResponse, mockError);
        });
    });
});
