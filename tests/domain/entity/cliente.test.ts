import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';


import Cliente from '../../../entity/cliente';
import BadRequestError from '../../../application/exception/BadRequestError';

describe("Validando Entity Cliente", () => {
    test("Instanciar Cliente", () => {
        let dataClient = new Cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitobvn@gmail.com",
            "317.594.877-40"
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(dataClient.name);
        expect("heitobvn@gmail.com").toEqual(dataClient.email);
        expect("31759487740").toEqual(dataClient.cpf_cnpj);
    })
    test("CPF com formatação", () => {
        let dataClient = new Cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitobvn@gmail.com",
            "317.594.877-40"
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(dataClient.name);
        expect("heitobvn@gmail.com").toEqual(dataClient.email);
        expect("317.594.877-40").not.toEqual(dataClient.cpf_cnpj);
    })
    test("CPF VÁLIDO", () => {
        let dataClient = new Cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitobvn@gmail.com",
            "317.594.877-40"
        );
        expect(dataClient.isValidCpf()).toEqual(true);
    });
    test("CPF INVÁLIDO", () => {
        expect(() => {
            let dataClient = new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitobvn@gmail.com",
                "317.594.877-41"
            );
        }).toThrow("CPF do cliente é inválido.");
    });
    test("E-MAIL VÁLIDO", () => {
        let dataClient = new Cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitobvn@gmail.com",
            "317.594.877-40"
        );
        expect(dataClient.isValidEmail()).toEqual(true);
    });
    test("E-MAIL INVÁLIDO", () => {
        expect(() => {
            let dataClient = new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitobvn@gmail",
                "317.594.877-40"
            );
        }).toThrow("E-mail do cliente é inválido.");
    });
    test('Quando todos os parâmetros são fornecidos corretamente', () => {
        const cliente = new Cliente('Fulano', 'fulano@example.com', '317.594.877-40');
        expect(cliente.name).toEqual('Fulano');
        expect(cliente.email).toEqual('fulano@example.com');
        expect(cliente.cpf_cnpj).toEqual('31759487740');
      });
    
      test('Quando o nome do cliente está faltando', () => {
        expect(() => new Cliente('', 'fulano@example.com', '31759487740')).toThrow(BadRequestError);
      });
    
      test('Quando o e-mail do cliente está faltando', () => {
        expect(() => new Cliente('Fulano', '', '31759487740')).toThrow(BadRequestError);
      });
    
      test('Quando o e-mail do cliente é inválido', () => {
        expect(() => new Cliente('Fulano', 'invalid-email', '31759487740')).toThrow(BadRequestError);
      });
    
      test('Quando o CPF do cliente está faltando', () => {
        expect(() => new Cliente('Fulano', 'fulano@example.com', '')).toThrow(BadRequestError);
      });
    
      test('Quando o CPF do cliente é inválido', () => {
        expect(() => new Cliente('Fulano', 'fulano@example.com', '31759487741')).toThrow(BadRequestError);
      });

      test('Deve formatar corretamente o CPF', () => {
        const cliente = new Cliente('Fulano', 'fulano@example.com', '31759487740');
        expect(cliente.cpfFormat()).toEqual('317.594.877-40');
      });
});