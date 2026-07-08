export interface Categoria {
  id: number;
  nome: string;
  cor: string | null;
}

export interface Tarefa {
  id: number;
  nome: string;
  descricao: string | null;
  data: string;
  hora_inicio: string;
  hora_termino: string;
  categorias: Categoria[];
}

export interface TarefaPayload {
  nome: string;
  descricao?: string;
  data: string;
  hora_inicio: string;
  hora_termino: string;
  categoria_ids?: number[];
}

export interface CategoriaPayload {
  nome: string;
  cor?: string;
}
