import { AppDataSource } from "../data-source";
import { Livro } from "../entity/Livro";

// Classe responsável pela comunicação com o banco de dados
export class LivroRepository {
    
    // Obtém o repositório do TypeORM para a entidade Livro
    private livroRepository = AppDataSource.getRepository(Livro);

    // CREATE: Salva um novo livro
    async salvar(livro: Livro): Promise<Livro> {
        return await this.livroRepository.save(livro);
    }

    // READ ALL: Retorna todos os livros
    async listarTodos(): Promise<Livro[]> {
        return await this.livroRepository.find({
            order: { id: "ASC" } // Ordena por ID crescente
        });
    }

    // READ BY ID: Busca um livro pelo ID
    async buscarPorId(id: number): Promise<Livro | null> {
        return await this.livroRepository.findOneBy({ id });
    }

    // UPDATE: Atualiza um livro existente
    async atualizar(id: number, dadosAtualizados: Partial<Livro>): Promise<Livro | null> {
        const livro = await this.buscarPorId(id);
        if (!livro) return null;
        
        // Mescla os dados atualizados com o livro existente
        Object.assign(livro, dadosAtualizados);
        return await this.livroRepository.save(livro);
    }

    // DELETE: Remove um livro
    async deletar(id: number): Promise<boolean> {
        const resultado = await this.livroRepository.delete(id);
        return resultado.affected !== 0;
    }

    // Busca por ISBN (para validação de unicidade)
    async buscarPorIsbn(isbn: string): Promise<Livro | null> {
        return await this.livroRepository.findOneBy({ isbn });
    }
}