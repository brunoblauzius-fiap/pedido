import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';
import CategoriaRepository from '../../../gateways/CategoriaRepository';
import  MockDataBase from './mockDatabase/MockDataBase';
import Categoria from '../../../entity/categoria';

describe('CategoriaRepository', () => {
  test('should fetch all categories', async () => {
    // Crie uma instância do CategoriaRepository com o mock do banco de dados
    const categoriaRepository = new CategoriaRepository(MockDataBase);

    // Chame o método getAll que você está testando
    const categorias = await categoriaRepository.getAll({});

    // Verifique se o método getAll funcionou corretamente
    expect(categorias).toHaveLength(2);
    expect(categorias[0].name).toEqual('Categoria 1');
    expect(categorias[1].name).toEqual('Categoria 2');
  });

  test('store categoria', async () => {
    // Crie uma instância do CategoriaRepository com o mock do banco de dados
    const categoriaRepository = new CategoriaRepository(MockDataBase);

    // Chame o método getAll que você está testando
    const categoria = await categoriaRepository.store({
        name: 'CategoriaTest'
    });
    expect(categoria).toBeDefined();
    expect(categoria.name).toEqual('CategoriaTest');
    expect(categoria.id).toEqual(1); // Como definido no mock do banco de dados
  });

  test('update categoria', async () => {
    // Crie uma instância do CategoriaRepository com o mock do banco de dados
    const categoriaRepository = new CategoriaRepository(MockDataBase);

    // Chame o método update que você está testando
    const updatedCategoria = await categoriaRepository.update({
        name: 'NovaCategoria'
    }, 1);

    // Verifique se o método update funcionou corretamente
    expect(MockDataBase.update).toHaveBeenCalledWith(
        'categoria', // nomeTabela
        [{ campo: "name", valor: 'NovaCategoria' }, { campo: "modified", valor: expect.any(Date) }], // campos
        [{ campo: "id", valor: 1 }] // where
    );

    // Verifique se o objeto Categoria retornado tem as propriedades esperadas
    expect(updatedCategoria).toBeDefined();
    expect(updatedCategoria.name).toEqual('NovaCategoria');
    expect(updatedCategoria.id).toEqual(1);
    });
  
    // Teste para o método delete do CategoriaRepository
test('delete categoria', async () => {
    // Crie uma instância do CategoriaRepository com o mock do banco de dados
    const categoriaRepository = new CategoriaRepository(MockDataBase);

    // Configurar o mock para retornar o resultado esperado
    MockDataBase.delete.mockResolvedValue(undefined);

    // Chame o método delete que você está testando
    const result = await categoriaRepository.delete(1);

    // Verifique se o método delete funcionou corretamente
    expect(MockDataBase.delete).toHaveBeenCalledWith(
        'categoria', // nomeTabela
        [{ campo: "id", valor: 1 }] // parametros
    );

    // Verifique se o resultado é o esperado
    expect(result).toBeUndefined();
    });

// Teste para o método findById do CategoriaRepository
test('findById categoria existente', async () => {
    // Crie uma instância do CategoriaRepository com o mock do banco de dados
    const categoriaRepository = new CategoriaRepository(MockDataBase);

    // Dados de categoria simulados retornados pelo banco de dados
    const categoriaData = [{ id: 1, name: 'CategoriaTest' }];

    // Configurar o mock para retornar os dados da categoria simulados
    MockDataBase.find.mockResolvedValue(categoriaData);

    // Chame o método findById que você está testando
    const result = await categoriaRepository.findById(1);

    // Verifique se o método find foi chamado com os parâmetros corretos
    expect(MockDataBase.find).toHaveBeenCalledWith(
        'categoria', // nomeTabela
        null, // campos
        [{ campo: "id", valor: 1 }] // parametros
    );

    // Verifique se o resultado retornado é uma instância de Categoria com os valores esperados
    expect(result).toEqual(new Categoria('CategoriaTest', 1));
});

  // Outros testes para os outros métodos do CategoriaRepository...
});




// import Categoria from '../../../entity/categoria';
// import CategoriaRepository from '../../../gateways/CategoriaRepository';

// describe("Tests unitarios categoria", () => {
//     test("Metodo GetALL", () => {

//         let instance = new CategoriaRepository();
//         expect("Categoria Teste").toEqual(instance.name);
//     });

//     test("Update", () => {
//         let instance = new Categoria("Categoria Teste", 1);
//         expect("Categoria Teste").toEqual(instance.name);
//         expect(1).toEqual(instance.id);
//     });

//     test("Store", () => {
//         expect(() => {
//             let instance = new Categoria("");
//         }).toThrow("O nome da categoria é obrigatório.");
//     });

//     test("delete", () => {
//         expect(() => {
//             let instance = new Categoria();
//         }).toThrow("O nome da categoria é obrigatório.");
//     });
//     test("findById", () => {
//         expect(() => {
//             let instance = new Categoria();
//         }).toThrow("O nome da categoria é obrigatório.");
//     });
// });
