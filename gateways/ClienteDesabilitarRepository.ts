import { IDataBase } from "../interfaces/IDataBase";
import IRepository from "../interfaces/IRepository";

class ClienteDesabilitarRepository implements IRepository {
    public db: IDataBase;
    private nomeTabela = "cliente_desabilitar";

    constructor(database: IDataBase) {
        this.db = database;
    }

    getAll(params: any) {
      throw new Error("Method not implemented.");
    }
    update(params: any, id: any) {
      throw new Error("Method not implemented.");
    }
    store(params: any) {
      throw new Error("Method not implemented.");
    }
    delete(id: any) {
      throw new Error("Method not implemented.");
    }
    findById(id: any) {
      throw new Error("Method not implemented.");
    }

    public disable = async (dadosCliente: any) => {
        let data = await this.db.store(
            this.nomeTabela,
            [{ campo: "nome", valor: dadosCliente.nome },
            { campo: "endereco", valor: dadosCliente.endereco },
            { campo: "telefone", valor: dadosCliente.telefone },
            { campo: "pagamento", valor: dadosCliente.pagamento },
            { campo: "created", valor:  new Date()},
            { campo: "modified", valor: new Date() }]);
        return data;
    }

}

export default ClienteDesabilitarRepository;
