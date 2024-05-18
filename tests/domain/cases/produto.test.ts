import Produto from '../../../entity/produto';
import Categoria from '../../../entity/categoria';
import { ProdutoCasoDeUso } from '../../../cases/produtoCasodeUso';
import IProduto from '../../../interfaces/IProduto';
import IRepository from '../../../interfaces/IRepository';
import BadRequestError from '../../../application/exception/BadRequestError';

jest.mock('../../../interfaces/IProduto');
jest.mock('../../../interfaces/IRepository');

describe('ProdutoCasoDeUso', () => {
    let produtoRepositorio: jest.Mocked<IProduto>;
    let categoriaRepositorio: jest.Mocked<IRepository>;

    beforeEach(() => {
        produtoRepositorio = {
            getAll: jest.fn(),
            store: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
            findByCategory: jest.fn()
        } as any;

        categoriaRepositorio = {
            findById: jest.fn()
        } as any;
    });

    describe('getAllProdutos', () => {
        it('should get all products', async () => {
            const mockProdutos = [{ id: 1, title: 'Produto 1' }];
            produtoRepositorio.getAll.mockResolvedValue(mockProdutos);

            const result = await ProdutoCasoDeUso.getAllProdutos({}, produtoRepositorio);

            expect(result).toEqual(mockProdutos);
            expect(produtoRepositorio.getAll).toHaveBeenCalled();
        });
    });

    describe('criarProduto', () => {
        it('should create a product', async () => {
            const mockCategoria = { id: 1, name: 'Categoria 1' };
            const mockProduto = { id: 1, title: 'Produto 1' };

            categoriaRepositorio.findById.mockResolvedValue(mockCategoria);
            produtoRepositorio.getAll.mockResolvedValue([]);
            produtoRepositorio.store.mockResolvedValue(mockProduto);

            const request = {
                body: {
                    title: 'Produto 1',
                    value: 100,
                    category_id: 1,
                    description: 'Descrição do Produto'
                }
            };

            const result = await ProdutoCasoDeUso.criarProduto(request, categoriaRepositorio, produtoRepositorio);

            expect(categoriaRepositorio.findById).toHaveBeenCalledWith(1);
            expect(produtoRepositorio.getAll).toHaveBeenCalledWith({ name: true, title: 'Produto 1' });
            expect(produtoRepositorio.store).toHaveBeenCalledWith(expect.any(Produto));
            expect(result).toEqual(mockProduto);
        });

        it('should throw an error if the category is not found', async () => {
            categoriaRepositorio.findById.mockResolvedValue(null);

            const request = {
                body: {
                    title: 'Produto 1',
                    value: 100,
                    category_id: 1,
                    description: 'Descrição do Produto'
                }
            };

            await expect(ProdutoCasoDeUso.criarProduto(request, categoriaRepositorio, produtoRepositorio))
                .rejects
                .toThrow(BadRequestError);
        });

        it('should throw an error if the product already exists', async () => {
            const mockCategoria = { id: 1, name: 'Categoria 1' };
            const mockProduto = [{ id: 1, title: 'Produto 1' }];

            categoriaRepositorio.findById.mockResolvedValue(mockCategoria);
            produtoRepositorio.getAll.mockResolvedValue(mockProduto);

            const request = {
                body: {
                    title: 'Produto 1',
                    value: 100,
                    category_id: 1,
                    description: 'Descrição do Produto'
                }
            };

            await expect(ProdutoCasoDeUso.criarProduto(request, categoriaRepositorio, produtoRepositorio))
                .rejects
                .toThrow(BadRequestError);
        });
    });

    describe('atualizarProduto', () => {
        it('should update a product', async () => {
            const mockCategoria = { id: 1, name: 'Categoria 1' };
            const mockProduto = { id: 1, title: 'Produto 1' };

            categoriaRepositorio.findById.mockResolvedValue(mockCategoria);
            produtoRepositorio.findById.mockResolvedValue(mockProduto);
            produtoRepositorio.getAll.mockResolvedValue([]);
            produtoRepositorio.update.mockResolvedValue(mockProduto);

            const request = {
                params: { id: 1 },
                body: {
                    title: 'Produto 1 Atualizado',
                    value: 200,
                    category_id: 1,
                    description: 'Descrição do Produto Atualizado'
                }
            };

            const result = await ProdutoCasoDeUso.atualizarProduto(request, categoriaRepositorio, produtoRepositorio);

            expect(categoriaRepositorio.findById).toHaveBeenCalledWith(1);
            expect(produtoRepositorio.findById).toHaveBeenCalledWith(1);
            expect(produtoRepositorio.getAll).toHaveBeenCalledWith({ name: true, title: 'Produto 1 Atualizado' });
            expect(produtoRepositorio.update).toHaveBeenCalledWith(expect.any(Produto), 1);
            expect(result).toEqual(mockProduto);
        });

        it('should throw an error if the category is not found', async () => {
            categoriaRepositorio.findById.mockResolvedValue(null);

            const request = {
                params: { id: 1 },
                body: {
                    title: 'Produto 1 Atualizado',
                    value: 200,
                    category_id: 1,
                    description: 'Descrição do Produto Atualizado'
                }
            };

            await expect(ProdutoCasoDeUso.atualizarProduto(request, categoriaRepositorio, produtoRepositorio))
                .rejects
                .toThrow(Error);
        });

        it('should throw an error if the product already exists with the new title', async () => {
            const mockCategoria = { id: 1, name: 'Categoria 1' };
            const mockProduto = { id: 1, title: 'Produto 1' };
            const existingProduto = [{ id: 2, title: 'Produto 1 Atualizado' }];

            categoriaRepositorio.findById.mockResolvedValue(mockCategoria);
            produtoRepositorio.findById.mockResolvedValue(mockProduto);
            produtoRepositorio.getAll.mockResolvedValue(existingProduto);

            const request = {
                params: { id: 1 },
                body: {
                    title: 'Produto 1 Atualizado',
                    value: 200,
                    category_id: 1,
                    description: 'Descrição do Produto Atualizado'
                }
            };

            await expect(ProdutoCasoDeUso.atualizarProduto(request, categoriaRepositorio, produtoRepositorio))
                .rejects
                .toThrow(Error);
        });
    });

    describe('encontrarProdutoPorId', () => {
        it('should find a product by id', async () => {
            const mockProduto = { id: 1, title: 'Produto 1' };
            produtoRepositorio.findById.mockResolvedValue(mockProduto);

            const result = await ProdutoCasoDeUso.encontrarProdutoPorId(1, produtoRepositorio);

            expect(result).toEqual(mockProduto);
            expect(produtoRepositorio.findById).toHaveBeenCalledWith(1);
        });
    });

    describe('deleteProduto', () => {
        it('should delete a product', async () => {
            const mockProduto = { id: 1, title: 'Produto 1' };
            produtoRepositorio.delete.mockResolvedValue(mockProduto);

            const result = await ProdutoCasoDeUso.deleteProduto(1, produtoRepositorio);

            expect(result).toEqual(mockProduto);
            expect(produtoRepositorio.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('findByCategory', () => {
        it('should find products by category', async () => {
            const mockProdutos = [{ id: 1, title: 'Produto 1' }];
            produtoRepositorio.findByCategory.mockResolvedValue(mockProdutos);

            const result = await ProdutoCasoDeUso.findByCategory(1, produtoRepositorio);

            expect(result).toEqual(mockProdutos);
            expect(produtoRepositorio.findByCategory).toHaveBeenCalledWith(1);
        });
    });
});
