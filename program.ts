import Server  from "./server";
import {MysqlDataBase} from "./external/MysqlDataBase";

let  port = process.env.PORT || 3001;
const _db = new MysqlDataBase();
const _server = new Server(_db);
_server.app.listen(port, () => {
    console.log('Server exec: PORTA -> ' + port);
});
