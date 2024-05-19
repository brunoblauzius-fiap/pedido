import * as mariadb from 'mariadb';
class MysqlConnection
{

    
    connection: mariadb.Connection = null;

    constructor(){
        this.connect();
    }

    async connect(){
        this.connection = await mariadb.createConnection({            
            host: process.env.MARIADB_HOST,
            user: process.env.MARIADB_USER,
            password: process.env.MARIADB_PASS,
            database: process.env.MARIADB_DATABASE,
            port : parseInt(process.env.MARIADB_PORT),
        });

        await this.connection.query(`CREATE TABLE IF NOT EXISTS cliente (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(200) not null,
            email VARCHAR(245) not null unique,
            cpf_cnpj VARCHAR(20) not null unique,
            created datetime null,
            modified datetime null
        )  ENGINE=INNODB;`);

        await this.connection.query(`CREATE TABLE IF NOT EXISTS categoria (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(200) not null unique,
            created datetime null,
            modified datetime null
        )  ENGINE=INNODB;`);

        await this.connection.query(`
            CREATE TABLE IF NOT EXISTS produto (
                id INT PRIMARY KEY AUTO_INCREMENT,
                category_id INT not null,
                title VARCHAR(200) not null unique,
                description text null,
                value decimal(19,2) not null default 0,
                created datetime null,
                modified datetime null,
                FOREIGN KEY (category_id) REFERENCES categoria(id)
            )  ENGINE=INNODB;
        `);

        await this.connection.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                customer_id INT NOT NULL,
                status VARCHAR(200) NOT NULL DEFAULT 'created',
                total_value DECIMAL(19,2) NOT NULL DEFAULT 0,
                created DATETIME NULL,
                modified DATETIME NULL,
                FOREIGN KEY (customer_id) REFERENCES cliente(id)
            ) ENGINE=INNODB;
        `);

        await this.connection.query(`
        CREATE TABLE IF NOT EXISTS pedido_produtos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            created DATETIME NULL,
            modified DATETIME NULL,
            FOREIGN KEY (order_id) REFERENCES pedidos(id),
            FOREIGN KEY (product_id) REFERENCES produto(id)
        ) ENGINE=INNODB;
        `);
    }

    public conn () {
        return this.connection;
    }
}

export default MysqlConnection