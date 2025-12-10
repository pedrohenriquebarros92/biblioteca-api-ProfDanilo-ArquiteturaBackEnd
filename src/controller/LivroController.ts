import { Request, Response } from "express";
import { LivroRepository } from "../repository/LivroRepository";
import { Livro } from "../entity/Livro";

// Controller: Responsável por receber requisições HTTP e conter a lógica de negócio das rotas de livros.
export class LivroController {
    
    private livroRepository = new LivroRepository();

    // CREATE - POST /api/livros ---> Aqui de início, deu erro no código, mas eu optei por usar o construtor para corrigir, porque lembrei deles nas aulas do Type ORM e do Java
    async criarLivro(req: Request, res: Response): Promise<Response> { //Nesse caso, ele inicia as propriedades do livro, com os dados que vieram no corpo da requisição, aqui são as propriedades do objeto.
        try {                                                         //async ("assíncrono"): Define uma função que sempre retornará uma promessa ("promise").    
            const livroData = req.body;
            const livro = new Livro(
                livroData.titulo,
                livroData.autor,
                livroData.isbn,
                livroData.anoPublicacao,
                livroData.disponivel
            );
            
            // VALIDAÇÃO DE NEGÓCIO 1: Valida campos obrigatórios
            const errosValidacao = livro.validar();
            if (errosValidacao.length > 0) {
                return res.status(400).json({ 
                    mensagem: "Erro de validação", 
                    erros: errosValidacao 
                });
            }
            
            // VALIDAÇÃO DE NEGÓCIO 2: Verifica se ISBN já existe
            const livroExistente = await this.livroRepository.buscarPorIsbn(livro.isbn);  //o await: ele para a execução aqui, para verificar se o isbn já existe; ou em casos gerais, até que a "promise" seja resolvida.
            if (livroExistente) {
                return res.status(409).json({ 
                    mensagem: "ISBN já cadastrado no sistema" 
                });
            }
            
            // Salva no banco de dados
            const livroSalvo = await this.livroRepository.salvar(livro);
            return res.status(201).json({
                mensagem: "Livro cadastrado com sucesso!",
                livro: livroSalvo
            });
            
        } catch (error) {
            console.error("Erro ao criar livro:", error);
            return res.status(500).json({ 
                mensagem: "Erro interno do servidor" 
            });
        }
    }

    // READ ALL - GET /api/livros
    async listarLivros(req: Request, res: Response): Promise<Response> {
        try {
            const livros = await this.livroRepository.listarTodos();
            
            return res.status(200).json({
                quantidade: livros.length,
                livros: livros
            });
            
        } catch (error) {
            console.error("Erro ao listar livros:", error);
            return res.status(500).json({ 
                mensagem: "Erro interno do servidor" 
            });
        }
    }

    // READ BY ID - GET /api/livros/{id}
    async buscarLivroPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            
            // VALIDAÇÃO: Verifica se ID é válido
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ 
                    mensagem: "ID deve ser um número positivo" 
                });
            }
            
            const livro = await this.livroRepository.buscarPorId(id);
            
            if (!livro) {
                return res.status(404).json({ 
                    mensagem: "Livro não encontrado" 
                });
            }
            
            return res.status(200).json(livro);
            
        } catch (error) {
            console.error("Erro ao buscar livro:", error);
            return res.status(500).json({ 
                mensagem: "Erro interno do servidor" 
            });
        }
    }

    // UPDATE - PUT /api/livros/{id}
    async atualizarLivro(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ 
                    mensagem: "ID inválido" 
                });
            }
            
            const dadosAtualizados = req.body;
            
            // VALIDAÇÃO: Não permite atualizar o ISBN (deve ser único e imutável)
            if (dadosAtualizados.isbn) {
                return res.status(400).json({ 
                    mensagem: "ISBN não pode ser alterado" 
                });
            }
            
            const livroAtualizado = await this.livroRepository.atualizar(id, dadosAtualizados);
            
            if (!livroAtualizado) {
                return res.status(404).json({ 
                    mensagem: "Livro não encontrado para atualização" 
                });
            }
            
            return res.status(200).json({
                mensagem: "Livro atualizado com sucesso!",
                livro: livroAtualizado
            });
            
        } catch (error) {
            console.error("Erro ao atualizar livro:", error);
            return res.status(500).json({ 
                mensagem: "Erro interno do servidor" 
            });
        }
    }

    // DELETE - DELETE /api/livros/{id}
    async deletarLivro(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ 
                    mensagem: "ID inválido" 
                });
            }
            
            const deletado = await this.livroRepository.deletar(id);
            
            if (!deletado) {
                return res.status(404).json({ 
                    mensagem: "Livro não encontrado para exclusão" 
                });
            }
            
            return res.status(200).json({ 
                mensagem: "Livro deletado com sucesso!" 
            });
            
        } catch (error) {
            console.error("Erro ao deletar livro:", error);
            return res.status(500).json({ 
                mensagem: "Erro interno do servidor" 
            });
        }
    }
}