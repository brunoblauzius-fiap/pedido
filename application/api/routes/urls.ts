import * as express from "express";
import ClienteRoutes from './clienteRoutes';
import ClienteDesabilitarRoutes from './clienteDesabilitarRoutes';
import categoriesRoutes from './categoriaRoutes';
import produtoRoutes from './produtoRoutes';
import PedidoRoutes from './pedidoRoutes';
import { IDataBase } from '../../../interfaces/IDataBase';

export default function urls(dbconnection: IDataBase) {
    const router = express.Router();
    router.use("/api/v1/", ClienteRoutes(dbconnection));
    router.use("/api/v1/", ClienteDesabilitarRoutes(dbconnection));
    router.use("/api/v1/", categoriesRoutes(dbconnection));
    router.use("/api/v1/", produtoRoutes(dbconnection));
    router.use("/api/v1/", PedidoRoutes(dbconnection));
    return router;
}

