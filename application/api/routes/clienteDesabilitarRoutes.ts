import * as express from "express";
import ClienteDesabilitarController from "../../../controllers/ClienteDesabilitarController";
import { IDataBase } from '../../../interfaces/IDataBase';

export default function ClienteDesabilitarRoutes(dbconnection: IDataBase) {
    const router = express.Router();
    const clienteDesabilitarController = new ClienteDesabilitarController(dbconnection);
    router.post('/cliente/desabilitar', clienteDesabilitarController.disable);
    return router;
}

//export default router;
