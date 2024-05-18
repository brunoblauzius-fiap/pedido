import PedidoController from '../../../controllers/PedidoController';
import PedidoRepository from '../../../gateways/PedidoRepository';
import ClienteRepository from '../../../gateways/ClienteRepository';
import ProdutoRepository from '../../../gateways/ProdutoRepository';
import ResponseAPI from '../../../adapters/ResponseAPI';
import ResponseErrors from '../../../adapters/ResponseErrors';
import { PedidoCasoDeUso } from '../../../cases/pedidoCasodeUso';
import * as HttpStatus from 'http-status';


jest.mock('../../../gateways/PedidoRepository');
jest.mock('../../../gateways/ClienteRepository');
jest.mock('../../../gateways/ProdutoRepository');
jest.mock('../../../cases/pedidoCasodeUso');
jest.mock('../../../adapters/ResponseAPI');
jest.mock('../../../adapters/ResponseErrors');

const mockDbConnection = {};  // Mock database connection

let pedidoController: PedidoController;
let request: any;
let response: any;

beforeEach(() => {
    pedidoController = new PedidoController(mockDbConnection as any);
    request = { params: {}, body: {}, query: {} };
    response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
});

describe('PedidoController', () => {
    describe('all', () => {
        it('should return all pedidos', async () => {
            const mockPedidos = [{ id: 1, name: 'Pedido 1' }];
            (PedidoCasoDeUso.getAllPedidos as jest.Mock).mockResolvedValue(mockPedidos);

            await pedidoController.all(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(response.json).toHaveBeenCalledWith(ResponseAPI.list(mockPedidos));
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            (PedidoCasoDeUso.getAllPedidos as jest.Mock).mockRejectedValue(error);

            await pedidoController.all(request, response);

            expect(ResponseErrors.err).toHaveBeenCalledWith(response, error);
        });
    });

    describe('store', () => {
        it('should store a new pedido', async () => {
            const mockOrderId = 1;
            (PedidoCasoDeUso.adicionarProdutoPedido as jest.Mock).mockResolvedValue(mockOrderId);

            await pedidoController.store(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(response.json).toHaveBeenCalledWith(ResponseAPI.data(mockOrderId));
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            (PedidoCasoDeUso.adicionarProdutoPedido as jest.Mock).mockRejectedValue(error);

            await pedidoController.store(request, response);

            expect(ResponseErrors.err).toHaveBeenCalledWith(response, error);
        });
    });

    describe('update', () => {
        it('should update an existing pedido', async () => {
            const mockPedido = { setStatus: jest.fn() };
            (PedidoCasoDeUso.encontrarPedidoPorId as jest.Mock).mockResolvedValue(mockPedido);
            (PedidoCasoDeUso.atualizarPedido as jest.Mock).mockResolvedValue(mockPedido);

            request.params.id = 1;
            request.body.status = 'UPDATED';

            await pedidoController.update(request, response);

            expect(mockPedido.setStatus).toHaveBeenCalledWith('UPDATED');
            expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(response.json).toHaveBeenCalledWith(ResponseAPI.data(mockPedido));
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            (PedidoCasoDeUso.encontrarPedidoPorId as jest.Mock).mockRejectedValue(error);

            await pedidoController.update(request, response);

            expect(ResponseErrors.err).toHaveBeenCalledWith(response, error);
        });
    });

    describe('show', () => {
        it('should show a specific pedido', async () => {
            const mockPedido = { id: 1, name: 'Pedido 1' };
            (PedidoCasoDeUso.encontrarPedidoPorId as jest.Mock).mockResolvedValue(mockPedido);

            request.params.id = 1;

            await pedidoController.show(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(response.json).toHaveBeenCalledWith(ResponseAPI.data(mockPedido));
        });

        it('should handle missing ID error', async () => {
            request.params.id = undefined;

            await pedidoController.show(request, response);

            expect(ResponseErrors.err).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            request.params.id = 1;
            (PedidoCasoDeUso.encontrarPedidoPorId as jest.Mock).mockRejectedValue(error);

            await pedidoController.show(request, response);

            expect(ResponseErrors.err).toHaveBeenCalledWith(response, error);
        });
    });

    describe('delete', () => {
        it('should delete a specific pedido', async () => {
            request.params.id = 1;
            (PedidoCasoDeUso.deletePedido as jest.Mock).mockResolvedValue(null);

            await pedidoController.delete(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(response.json).toHaveBeenCalledWith({});
        });

        it('should handle missing ID error', async () => {
            request.params.id = undefined;

            await pedidoController.delete(request, response);

            expect(ResponseErrors.err).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            request.params.id = 1;
            (PedidoCasoDeUso.deletePedido as jest.Mock).mockRejectedValue(error);

            await pedidoController.delete(request, response);

            expect(ResponseErrors.err).toHaveBeenCalledWith(response, error);
        });
    });
});
