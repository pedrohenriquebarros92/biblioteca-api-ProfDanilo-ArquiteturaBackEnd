import express from "express";
import { inicializarBancoDados } from "./data-source";
import { LivroController } from "./controller/LivroController";

// Classe principal da aplicação
class BibliotecaAPI {
    private app: express.Application;
    private livroController: LivroController;
    private readonly PORT = process.env.PORT || 3000;

    constructor() {
        this.app = express();
        this.livroController = new LivroController();
        this.configurarMiddlewares();
        this.configurarRotas();
    }

    // Configura middlewares (plugins do Express)
    private configurarMiddlewares(): void {
        this.app.use(express.json()); // Permite receber JSON no body
        this.app.use(express.urlencoded({ extended: true }));
        
        // Middleware de logging (opcional)
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }

    // Configura as rotas da API
    private configurarRotas(): void {
        const router = express.Router();
        
        // ROTAS CRUD para Livros
        router.post("/livros", (req, res) => this.livroController.criarLivro(req, res));
        router.get("/livros", (req, res) => this.livroController.listarLivros(req, res));
        router.get("/livros/:id", (req, res) => this.livroController.buscarLivroPorId(req, res));
        router.put("/livros/:id", (req, res) => this.livroController.atualizarLivro(req, res));
        router.delete("/livros/:id", (req, res) => this.livroController.deletarLivro(req, res));
        
        // Prefixo /api para todas as rotas
        this.app.use("/api", router);
        
        // Rota de teste
        this.app.get("/", (req, res) => {
            res.json({
                mensagem: "API Biblioteca Online 🏫",
                status: "Operacional",
                endpoints: {
                    criarLivro: "POST /api/livros",
                    listarLivros: "GET /api/livros",
                    buscarLivro: "GET /api/livros/{id}",
                    atualizarLivro: "PUT /api/livros/{id}",
                    deletarLivro: "DELETE /api/livros/{id}"
                }
            });
        });
        
        // Rota para 404 (não encontrado)
        this.app.use((req, res) => {
            res.status(404).json({ 
                mensagem: "Rota não encontrada" 
            });
        });
    }

    // Inicia o servidor
    public async iniciar(): Promise<void> {
        try {
            // Conecta ao banco de dados primeiro
            await inicializarBancoDados();
            
            // Inicia o servidor Express
            this.app.listen(this.PORT, () => {
                console.log(`🚀 Servidor rodando em http://localhost:${this.PORT}`);
                console.log(`📚 API Biblioteca disponível!`);
            });
            
        } catch (error) {
            console.error("Falha ao iniciar a API:", error);
            process.exit(1);
        }
    }
}

// Instancia e inicia a aplicação
const api = new BibliotecaAPI();
api.iniciar();

/*OBSERVAÇÕES IMPORTANTES PARA MIM:

*1:
- O código configura uma API RESTful para gerenciar uma biblioteca online usando Express e :TypeORM.
- Define rotas CRUD para a entidade Livro, incluindo criação, leitura, atualização e exclusão.

 Uma APIRestful -->  é um estilo arquitetural para comunicação entre sistemas, que usa o TypeScript para construir serviços web, lidando com recursos via métodos HTTP (GET, POST) e endpoints (URLs). 

 *2:
- A classe BibliotecaAPI configura middlewares, rotas e inicia o servidor.
- Usa um controlador (LivroController) para separar a lógica de negócios das rotas.

*3: O JSON não aceita comentários --> Comentários só são permitidos com ### no início da linha. Nada além do JSON pode estar dentro do bloco do body*/
