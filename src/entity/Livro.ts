import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity() // Decorator que marca esta classe como uma entidade do banco de dados
export class Livro {
    
    @PrimaryGeneratedColumn() // Define como chave primária auto-incrementada
    id!: number; // O '!' indica que será inicializado pelo TypeORM

    @Column() // Define como coluna do banco de dados
    titulo!: string;

    @Column()
    autor!: string;

    @Column({ unique: true }) // ISBN deve ser único
    isbn!: string;

    @Column({ name: "ano_publicacao" }) // Mapeia para nome diferente no banco
    anoPublicacao!: number;

    @Column({ default: true }) // Valor padrão: true (disponível)
    disponivel!: boolean;

    // Construtor para inicializar as propriedades (opcional, mas recomendado) - eu preferi usar para no CREATE-POST do controller, porque deu erro sem ele.
    constructor(
        titulo?: string,
        autor?: string,
        isbn?: string,
        anoPublicacao?: number,
        disponivel?: boolean
    ) {
        if (titulo) this.titulo = titulo;
        if (autor) this.autor = autor;
        if (isbn) this.isbn = isbn;
        if (anoPublicacao) this.anoPublicacao = anoPublicacao;
        this.disponivel = disponivel !== undefined ? disponivel : true;
    }

    // Método para validar dados antes de salvar (pode ser usado no controller)
    validar(): string[] {
        const erros: string[] = [];
        
        if (!this.titulo || this.titulo.trim().length < 2) {
            erros.push("Título deve ter pelo menos 2 caracteres");
        }
        
        if (!this.autor || this.autor.trim().length < 3) {
            erros.push("Autor deve ter pelo menos 3 caracteres");
        }
        
        // Validação simples de ISBN (13 dígitos)
        if (!this.isbn || !/^\d{13}$/.test(this.isbn.replace(/-/g, ''))) {
            erros.push("ISBN deve ter 13 dígitos");
        }
        
        const anoAtual = new Date().getFullYear();
        if (!this.anoPublicacao || this.anoPublicacao < 1000 || this.anoPublicacao > anoAtual) {
            erros.push(`Ano de publicação deve estar entre 1000 e ${anoAtual}`);
        }
        
        return erros;
    }
}