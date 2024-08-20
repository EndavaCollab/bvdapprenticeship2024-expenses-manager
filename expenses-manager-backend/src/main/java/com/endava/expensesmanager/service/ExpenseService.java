package com.endava.expensesmanager.service;

import com.endava.expensesmanager.entity.Category;
import com.endava.expensesmanager.entity.Currency;
import com.endava.expensesmanager.entity.Expense;
import com.endava.expensesmanager.entity.Users;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ExpenseService {
    Expense createExpense(LocalDateTime date, Category category, Currency currency,
                          int amount, String description, Users users);

    List<Expense> getAllExpenses();

    Optional<Expense> getExpenseById(int id);

    Expense updateExpense(int id, LocalDateTime date, Category category,
                          Currency currency, int amount, String description);

    void deleteExpense(int id);
}
