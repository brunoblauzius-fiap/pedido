import Categoria from '../../../entity/categoria';
import IRepository from '../../../interfaces/IRepository';
import { CategoriaCasoDeUso } from '../../../cases/categoriaCasodeUso';

// Mocking the IRepository
const mockRepository: jest.Mocked<IRepository> = {
    db: {} as any,  // Assuming db is an object, you can customize it if needed
    getAll: jest.fn(),
    update: jest.fn(),
    store: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
};

describe('CategoriaCasoDeUso', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllCategorias', () => {
        it('should return all categories', async () => {
            const query = { name: 'example' };
            const mockCategories = [{ id: 1, name: 'Category1' }, { id: 2, name: 'Category2' }];
            mockRepository.getAll.mockResolvedValue(mockCategories);

            const result = await CategoriaCasoDeUso.getAllCategorias(query, mockRepository);

            expect(mockRepository.getAll).toHaveBeenCalledWith(query);
            expect(result).toEqual(mockCategories);
        });

        it('should handle errors', async () => {
            const query = { name: 'example' };
            const error = new Error('Failed to fetch categories');
            mockRepository.getAll.mockRejectedValue(error);

            await expect(CategoriaCasoDeUso.getAllCategorias(query, mockRepository)).rejects.toThrow('Failed to fetch categories');
        });
    });

    describe('criarCategoria', () => {
        it('should create a new category', async () => {
            const newCategoria = new Categoria('Category1');
            const mockCategoria = { id: '1', name: 'Category1' };
            mockRepository.store.mockResolvedValue(mockCategoria);

            const result = await CategoriaCasoDeUso.criarCategoria(newCategoria, mockRepository);

            expect(mockRepository.store).toHaveBeenCalledWith(newCategoria);
            expect(result).toEqual(mockCategoria);
        });

        it('should handle errors', async () => {
            const newCategoria = new Categoria('Category1');
            const error = new Error('Failed to create category');
            mockRepository.store.mockRejectedValue(error);

            await expect(CategoriaCasoDeUso.criarCategoria(newCategoria, mockRepository)).rejects.toThrow('Failed to create category');
        });
    });

    describe('atualizarCategoria', () => {
        it('should update an existing category', async () => {
            const updatedCategoria = new Categoria('Updated Category');
            const id = '1';
            const mockCategoria = { id: '1', name: 'Updated Category' };
            mockRepository.update.mockResolvedValue(mockCategoria);

            const result = await CategoriaCasoDeUso.atualizarCategoria(updatedCategoria, id, mockRepository);

            expect(mockRepository.update).toHaveBeenCalledWith(updatedCategoria, id);
            expect(result).toEqual(mockCategoria);
        });

        it('should handle errors', async () => {
            const updatedCategoria = new Categoria('Updated Category');
            const id = '1';
            const error = new Error('Failed to update category');
            mockRepository.update.mockRejectedValue(error);

            await expect(CategoriaCasoDeUso.atualizarCategoria(updatedCategoria, id, mockRepository)).rejects.toThrow('Failed to update category');
        });
    });

    describe('encontrarCategoriaPorId', () => {
        it('should return a category by id', async () => {
            const id = '1';
            const mockCategoria = { id: '1', name: 'Category1' };
            mockRepository.findById.mockResolvedValue(mockCategoria);

            const result = await CategoriaCasoDeUso.encontrarCategoriaPorId(id, mockRepository);

            expect(mockRepository.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockCategoria);
        });

        it('should handle errors', async () => {
            const id = '1';
            const error = new Error('Failed to fetch category');
            mockRepository.findById.mockRejectedValue(error);

            await expect(CategoriaCasoDeUso.encontrarCategoriaPorId(id, mockRepository)).rejects.toThrow('Failed to fetch category');
        });
    });

    describe('deleteCategoria', () => {
        it('should delete a category by id', async () => {
            const id = '1';
            const mockResult = { success: true };
            mockRepository.delete.mockResolvedValue(mockResult);

            const result = await CategoriaCasoDeUso.deleteCategoria(id, mockRepository);

            expect(mockRepository.delete).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockResult);
        });

        it('should handle errors', async () => {
            const id = '1';
            const error = new Error('Failed to delete category');
            mockRepository.delete.mockRejectedValue(error);

            await expect(CategoriaCasoDeUso.deleteCategoria(id, mockRepository)).rejects.toThrow('Failed to delete category');
        });
    });
});
