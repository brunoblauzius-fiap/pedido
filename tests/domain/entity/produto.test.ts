import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import Categoria from '../../../entity/categoria';
import Produto from '../../../entity/produto';
import BadRequestError from '../../../application/exception/BadRequestError';

describe("Validando Entity Produto", () => {
    test("Instanciar Produto com minimo de parametros", () => {
        let produto = new Produto(
            "Produto Teste",
            10,
            new Categoria("Categoria Teste", 1)
        );
        expect("Produto Teste").toEqual(produto.title);
        expect(10).toEqual(produto.value);
        expect("Categoria Teste").toEqual(produto.categoria.name);
        expect(1).toEqual(produto.categoria.id);
    });

    test("Instanciar Produto todos os parametros", () => {
        let produto = new Produto(
            "Produto Teste",
            10,
            new Categoria("Categoria Teste", 1),
            "DESCRIÇÃO DO PRODUTO",
            1
        );
        expect("Produto Teste").toEqual(produto.title);
        expect("DESCRIÇÃO DO PRODUTO").toEqual(produto.description);
        expect(10).toEqual(produto.value);
        expect("Categoria Teste").toEqual(produto.categoria.name);
        expect(1).toEqual(produto.categoria.id);
        expect(1).toEqual(produto.id);
    });
    
    test("Instanciar Produto todos os parametros", () => {
        expect(() => {
            let produto = new Produto(
                "Produto Teste",
                10,
                new Categoria("", 1)
            );
        }).toThrow("O nome da categoria é obrigatório.");
    });

    test('Deve criar um produto com todos os parâmetros válidos', () => {
        const categoria = new Categoria('Categoria 1');
        const produto = new Produto('Produto 1', 50, categoria);
        expect(produto.title).toBe('Produto 1');
        expect(produto.value).toBe(50);
        expect(produto.categoria).toBe(categoria);
      });
    
      test('Deve lançar um erro ao tentar criar um produto sem um título', () => {
        const categoria = new Categoria('Categoria 1');
        expect(() => new Produto('', 50, categoria)).toThrow(BadRequestError);
      });
    
      test('Deve lançar um erro ao tentar criar um produto sem um valor', () => {
        const categoria = new Categoria('Categoria 1');
        expect(() => new Produto('Produto 1', null, categoria)).toThrow(BadRequestError);
      });
    
      test('Deve lançar um erro ao tentar criar um produto sem uma categoria', () => {
        expect(() => new Produto('Produto 1', 50, null)).toThrow(BadRequestError);
      });
});