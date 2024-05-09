import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import Cliente from '../../../entity/cliente';
import Pedido from '../../../entity/pedido';
import { statusPedido } from '../../../entity/enum/statusPedido';
import Produto from '../../../entity/produto';
import Categoria from '../../../entity/categoria';

describe("Validando Pedido", () => {
    test("Cria Pedido sem Cliente", () => {
      const dataPedido = () => {
        new Pedido(
          null,
          statusPedido.CRIADO
        );
      };
      expect(dataPedido).toThrow(Error);
    })

    test("Cria Pedido com Cliente", () => {
        let dataClient = new Cliente(
          "Heitor Bernardo Victor Nogueira",
          "heitoBVN@gmail.com",
          "043.065.619-09"
        );

        let dataPedido = new Pedido(
          dataClient,
          statusPedido.CRIADO
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(dataPedido.cliente.name);
        expect(0).toEqual(dataPedido.getStatus());
    })
    test("Cria Pedido com Cliente e  1 produtos", () => {
      let dataClient = new Cliente(
        "Heitor Bernardo Victor Nogueira",
        "heitoBVN@gmail.com",
        "043.065.619-09"
      );
      let dataProduto = new Produto(
        "X salada",
        10.50,
        new Categoria("Lanche","1"),
        "Um lanche com salada"
      );

      let dataPedido = new Pedido(
        dataClient,
        statusPedido.CRIADO,
      );
      dataPedido.adicionarProduto(dataProduto);

      expect("Heitor Bernardo Victor Nogueira").toEqual(dataPedido.cliente.name);
      expect(1).toEqual(dataPedido.getProdutos().length);
      expect(dataProduto).toEqual(dataPedido.getProdutos()[0]);
      expect(10.50).toEqual(dataPedido.getValorTotal());
      expect(0).toEqual(dataPedido.getStatus());
  })

  test("Cria Pedido com Cliente e 2 produtos", () => {
    let dataClient = new Cliente(
      "Heitor Bernardo Victor Nogueira",
      "heitoBVN@gmail.com",
      "043.065.619-09"
    );
    const dataProduto = [];
    dataProduto.push(new Produto("X-Salada", 10.50, new Categoria("Lanche", "1"), "Um lanche com salada"));
    dataProduto.push(new Produto("Coca-Cola", 3.00, new Categoria("Bebida", "2"), "Refrigerante de cola"));
    dataProduto.push(new Produto("Batata Frita", 5.00, new Categoria("Acompanhamento", "3"), "Batata frita crocante"));

    let dataPedido = new Pedido(
      dataClient,
      statusPedido.CRIADO,
    );

    dataProduto.forEach(produto => {
      dataPedido.adicionarProduto(produto);
    });
    
    expect("Heitor Bernardo Victor Nogueira").toEqual(dataPedido.cliente.name);
    expect(3).toEqual(dataPedido.getProdutos().length);
    expect(18.50).toEqual(dataPedido.getValorTotal());
    expect(0).toEqual(dataPedido.getStatus());
})
test('Deve criar um pedido com todos os parâmetros válidos', () => {
  const cliente = new Cliente('Fulano', 'fulano@example.com', '31759487740');
  const pedido = new Pedido(cliente, statusPedido.CRIADO, 1, 100);
  expect(pedido.cliente).toBe(cliente);
  expect(pedido.getStatus()).toBe(statusPedido.CRIADO);
  expect(pedido.getValorTotal()).toBe(100);
});

test('Deve lançar um erro ao tentar criar um pedido sem um cliente', () => {
  expect(() => new Pedido(null)).toThrow(Error);
});

test('Deve adicionar um produto ao pedido', () => {
  const cliente = new Cliente('Fulano', 'fulano@example.com', '31759487740');
  const produto = new Produto('Produto 1', 50, new Categoria('Categoria 1'));
  const pedido = new Pedido(cliente);
  pedido.adicionarProduto(produto);
  expect(pedido.getProdutos()).toContain(produto);
  expect(pedido.getValorTotal()).toBe(50);
});

test('Deve verificar o status inicial do pedido', () => {
  const cliente = new Cliente('Fulano', 'fulano@example.com', '31759487740');
  const pedido = new Pedido(cliente);
  expect(pedido.getStatus()).toBe(statusPedido.CRIADO);
});

test('Deve verificar o valor total do pedido após adicionar produtos', () => {
  const cliente = new Cliente('Fulano', 'fulano@example.com', '31759487740');
  const produto1 = new Produto('Produto 1', 50, new Categoria('Categoria 1'));
  const produto2 = new Produto('Produto 2', 75, new Categoria('Categoria 1'));
  const pedido = new Pedido(cliente);
  pedido.adicionarProduto(produto1);
  pedido.adicionarProduto(produto2);
  expect(pedido.getValorTotal()).toBe(125);
});

test('Deve obter a lista de produtos do pedido', () => {
  const cliente = new Cliente('Fulano', 'fulano@example.com', '31759487740');
  const produto1 = new Produto('Produto 1', 50, new Categoria('Categoria 1'));
  const produto2 = new Produto('Produto 2', 75, new Categoria('Categoria 1'));
  const pedido = new Pedido(cliente);
  pedido.adicionarProduto(produto1);
  pedido.adicionarProduto(produto2);
  expect(pedido.getProdutos()).toEqual([produto1, produto2]);
});
});
