import BadRequestError from '../application/exception/BadRequestError';
import ClienteDesabilitarRepository from '../gateways/ClienteDesabilitarRepository';

export class ClienteDesabilitarCasoDeUso {
    static async desabilitar(dadosCliente: { nome: any; endereco: any; telefone: any; pagamento: any }, repository: ClienteDesabilitarRepository) {
      if (!dadosCliente.nome) {
          throw new BadRequestError("Nome é obrigatório.");
      }

      if (!dadosCliente.endereco) {
          throw new BadRequestError("Endereço é obrigatório.");
      }

      if (!dadosCliente.telefone) {
          throw new BadRequestError("Telefone é obrigatório.");
      }

      const data = await repository.disable(dadosCliente);
      return data;
    }
}
