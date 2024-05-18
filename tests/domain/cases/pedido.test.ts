import { statusPedido } from '../../../entity/enum/statusPedido';
import Pedido from '../../../entity/pedido';
import { PedidoCasoDeUso } from '../../../cases/pedidoCasodeUso';
import IClienteRepository from '../../../interfaces/ICliente';
import IPedido from '../../../interfaces/IPedido';
import IProduto from '../../../interfaces/IProduto';

jest.mock('../../../interfaces/ICliente');
jest.mock('../../../interfaces/IPedido');
jest.mock('../../../interfaces/IProduto');

describe('PedidoCasoDeUso', () => {
    let pedidoRepositorio: jest.Mocked<IPedido>;
    let clienteRepositorio: jest.Mocked<IClienteRepository>;
    let produtoRepositorio: jest.Mocked<IProduto>;

    beforeEach(() => {
        pedidoRepositorio = {
            getAll: jest.fn(),
            store: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            adicionarProdutoAoPedido: jest.fn(),
            delete: jest.fn()
        } as any;

        clienteRepositorio = {
            findById: jest.fn()
        } as any;

        produtoRepositorio = {
            findByMultipleIds: jest.fn()
        } as any;
    });

    describe('getAllPedidos', () => {
        it('should get all pedidos', async () => {
            const mockPedidos = [{ id: 1, name: 'Pedido 1' }];
            pedidoRepositorio.getAll.mockResolvedValue(mockPedidos);

            const result = await PedidoCasoDeUso.getAllPedidos({}, pedidoRepositorio);

            expect(result).toEqual(mockPedidos);
            expect(pedidoRepositorio.getAll).toHaveBeenCalled();
        });
    });

    describe('criarPedido', () => {
        it('should create a pedido', async () => {
            const mockPedido = { id: 1, name: 'Pedido 1' };
            pedidoRepositorio.store.mockResolvedValue(mockPedido);

            const result = await PedidoCasoDeUso.criarPedido({}, pedidoRepositorio);

            expect(result).toEqual(mockPedido);
            expect(pedidoRepositorio.store).toHaveBeenCalled();
        });
    });

    describe('atualizarPedido', () => {
        it('should update a pedido', async () => {
            const mockPedido = { id: 1, name: 'Pedido 1' };
            pedidoRepositorio.update.mockResolvedValue(mockPedido);

            const result = await PedidoCasoDeUso.atualizarPedido({}, 1, pedidoRepositorio);

            expect(result).toEqual(mockPedido);
            expect(pedidoRepositorio.update).toHaveBeenCalled();
        });
    });

    describe('encontrarPedidoPorId', () => {
        it('should find a pedido by id', async () => {
            const mockPedido = { id: 1, name: 'Pedido 1' };
            pedidoRepositorio.findById.mockResolvedValue(mockPedido);

            const result = await PedidoCasoDeUso.encontrarPedidoPorId(1, pedidoRepositorio);

            expect(result).toEqual(mockPedido);
            expect(pedidoRepositorio.findById).toHaveBeenCalledWith(1);
        });
    });

    describe('pedidoEmPreparacao', () => {
        it('should set a pedido to EM_PREPARACAO status', async () => {
            const mockPedido = { id: 1, setStatus: jest.fn() };
            pedidoRepositorio.update.mockResolvedValue(mockPedido);

            const result = await PedidoCasoDeUso.pedidoEmPreparacao(mockPedido as any, pedidoRepositorio);

            expect(mockPedido.setStatus).toHaveBeenCalledWith(statusPedido.EM_PREPARACAO);
            expect(pedidoRepositorio.update).toHaveBeenCalledWith(mockPedido, mockPedido.id);
            expect(result).toEqual(mockPedido);
        });
    });

    describe('adicionarProdutoPedido', () => {
        it('should add products to a pedido', async () => {
            const mockCliente = { id: 1 };
            const mockProdutos = [{ id: 1 }, { id: 2 }];
            const mockPedido = { id: 1, adicionarProduto: jest.fn(), getProdutos: jest.fn().mockReturnValue(mockProdutos) };

            clienteRepositorio.findById.mockResolvedValue(mockCliente);
            produtoRepositorio.findByMultipleIds.mockResolvedValue(mockProdutos);
            pedidoRepositorio.store.mockResolvedValue(mockPedido as any);
            pedidoRepositorio.adicionarProdutoAoPedido.mockResolvedValue({});

            const request = {
                body: {
                    client_id: 1,
                    produtosIds: [1, 2],
                    status: 'NEW'
                }
            };

            const result = await PedidoCasoDeUso.adicionarProdutoPedido(request, clienteRepositorio, produtoRepositorio, pedidoRepositorio);

            expect(clienteRepositorio.findById).toHaveBeenCalledWith(1);
            expect(produtoRepositorio.findByMultipleIds).toHaveBeenCalledWith([1, 2]);
            expect(pedidoRepositorio.store).toHaveBeenCalledWith(expect.any(Pedido));
            expect(pedidoRepositorio.adicionarProdutoAoPedido).toHaveBeenCalledTimes(mockProdutos.length);
            expect(result).toEqual(mockPedido);
        });

        it('should handle errors when adding products to a pedido', async () => {
            clienteRepositorio.findById.mockRejectedValue(new Error('Cliente not found'));

            const request = {
                body: {
                    client_id: 1,
                    produtosIds: [1, 2],
                    status: 'NEW'
                }
            };

            await expect(PedidoCasoDeUso.adicionarProdutoPedido(request, clienteRepositorio, produtoRepositorio, pedidoRepositorio))
                .rejects
                .toThrow('Cliente not found');
        });
    });

    describe('deletePedido', () => {
        it('should delete a pedido', async () => {
            const mockPedido = { id: 1 };
            pedidoRepositorio.delete.mockResolvedValue(mockPedido);

            const result = await PedidoCasoDeUso.deletePedido(1, pedidoRepositorio);

            expect(result).toEqual(mockPedido);
            expect(pedidoRepositorio.delete).toHaveBeenCalledWith(1);
        });
    });
});
