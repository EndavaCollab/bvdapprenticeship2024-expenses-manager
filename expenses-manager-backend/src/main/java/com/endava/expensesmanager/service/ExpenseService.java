package com.endava.expensesmanager.service;

import com.endava.expensesmanager.dto.ExpenseDto;

import java.util.List;
import java.util.Optional;

public interface ExpenseService {
    ExpenseDto createExpense(ExpenseDto expenseDto);

    List<ExpenseDto> getAllExpenses();

    Optional<ExpenseDto> getExpenseById(int id);

    ExpenseDto updateExpense(int id, ExpenseDto expenseDto);

    void deleteExpense(int id);

    List<ExpenseDto> getExpensesByUserId(int userId);
}
