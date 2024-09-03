export interface User {
    id: number;
    name: string;
    created: Date;
}

export interface Expense {
    description: string;
    date: string;
    amount: number;
    categoryId: number;
    currencyId: number;
    userId: number;
}

export interface Category {
    id: number;
    description: string;
    color: string;
}

export interface Currency {
    id: number;
    code: string;
}
