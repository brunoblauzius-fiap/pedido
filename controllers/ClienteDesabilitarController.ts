import * as HttpStatus from 'http-status';
import ClienteDesabilitarRepository from "../gateways/ClienteDesabilitarRepository";
import ResponseAPI from '../adapters/ResponseAPI';
import { IDataBase } from "../interfaces/IDataBase";
import { ClienteDesabilitarCasoDeUso } from '../cases/clienteDesabilitarCasodeUso';
import ResponseErrors from '../adapters/ResponseErrors';

class ClienteDesabilitarController{
    private repository: ClienteDesabilitarRepository;

    /**
     * 
     */
    constructor(dbconnection: IDataBase) {
        this.repository = new ClienteDesabilitarRepository(dbconnection);
    }

    /**
     * 
     * @param request 
     * @param response 
     */
    public disable = async (request, response) => {
        try {
            const data = await ClienteDesabilitarCasoDeUso.desabilitar(request.params, this.repository);
            response.status(HttpStatus.OK).json(ResponseAPI.data(data));
        } catch (err) {
            ResponseErrors.err(response, err);
        }
    }

}

export default ClienteDesabilitarController;
