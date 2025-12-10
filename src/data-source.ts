import "reflect-metadata";
import { DataSource } from "typeorm";
import { Livro } from "./entity/Livro";

// Configuração da conexão com o banco de dados
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true, // ATENÇÃO: Em produção, usar migrações
    logging: false,
    entities: [Livro],
    migrations: [],
    subscribers: [],
});

// Inicializa a conexão com o banco
export async function inicializarBancoDados() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Banco de dados conectado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
        throw error;
    }
}