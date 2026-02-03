// Dados financeiros do sistema de controle

export interface CashFlowItem {
  month: string;
  value: number;
}

export interface Member {
  name: string;
  payments: Record<string, "Pago" | "Pendente">;
}

export interface Expense {
  description: string;
  value: number;
}

export interface MonthlyExpenses {
  month: string;
  total: number;
  items: Expense[];
}

export interface Income {
  description: string;
  value: number;
}

export interface MonthlyIncome {
  month: string;
  total: number;
  items: Income[];
}

// Dados da página Início
export const dashboardData = {
  caixaAtual: {
    value: 157.90,
    month: "Fevereiro",
  },
  investimento: {
    value: 5716.35,
  },
  entradaMensal: {
    value: 0.00,
    month: "Fevereiro",
  },
  filhosDaCasa: 12,
};

export const cashFlowData: CashFlowItem[] = [
  { month: "Fevereiro", value: 157.90 },
  { month: "Janeiro", value: 836.15 },
];

// Dados de mensalidades
export const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const members: Member[] = [
  {
    name: "ADRIANA",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "BRUNO",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "CAFU",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "CAROL",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "CELIA",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pago", Março: "Pago", Abril: "Pago",
      Maio: "Pago", Junho: "Pago", Julho: "Pago", Agosto: "Pago",
      Setembro: "Pago", Outubro: "Pago", Novembro: "Pago", Dezembro: "Pago"
    }
  },
  {
    name: "ELAINE",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "FATIMA",
    payments: {
      Janeiro: "Pendente", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "JESSICA",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "LAZARO",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "LETICIA",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "RAYSSA",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
  {
    name: "SYNCLAIR",
    payments: {
      Janeiro: "Pago", Fevereiro: "Pendente", Março: "Pendente", Abril: "Pendente",
      Maio: "Pendente", Junho: "Pendente", Julho: "Pendente", Agosto: "Pendente",
      Setembro: "Pendente", Outubro: "Pendente", Novembro: "Pendente", Dezembro: "Pendente"
    }
  },
];

// Dados de gastos
export const expensesData: MonthlyExpenses[] = [
  {
    month: "Janeiro",
    total: 2021.25,
    items: [
      { description: "Leticia (Sacos de Milhos)", value: 80.00 },
      { description: "Checklist - Manuel", value: 103.27 },
      { description: "Baba", value: 100.00 },
      { description: "Adriana (Pano Bater Cabeça)", value: 20.00 },
      { description: "Cortina", value: 270.00 },
      { description: "Andressa (Thinner Etc)", value: 102.00 },
      { description: "Almoço (Celia)", value: 132.23 },
      { description: "Toalha do Altar", value: 114.50 },
      { description: "Manuel", value: 49.25 },
      { description: "Tintas", value: 620.00 },
      { description: "Tintas", value: 230.00 },
      { description: "Andressa", value: 200.00 },
    ]
  }
];

// Dados de entradas
export const incomeData: MonthlyIncome[] = [
  {
    month: "Janeiro",
    total: 500.00,
    items: [
      { description: "Doação Janaina", value: 500.00 },
    ]
  }
];

// Formatador de moeda
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};
