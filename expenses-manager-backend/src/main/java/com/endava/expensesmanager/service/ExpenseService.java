package com.endava.expensesmanager.service;

import com.endava.expensesmanager.dto.ExpenseDto;
import com.endava.expensesmanager.enums.PropertyEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ExpenseService {
    ExpenseDto createExpense(ExpenseDto expenseDto);

    List<ExpenseDto> getAllExpenses();

    Optional<ExpenseDto> getExpenseById(int id);

    ExpenseDto updateExpense(int id, ExpenseDto expenseDto);

    void deleteExpense(int id);

    List<ExpenseDto> getExpensesByUserId(int userId, LocalDateTime startDate, LocalDateTime endDate);

    BigDecimal getTotalAmountByDateBetween(int userId, LocalDateTime startDate, LocalDateTime endDate);

    List<ExpenseDto> getExpensesPage(int userId, LocalDateTime startDate, LocalDateTime endDate, int page, int size, PropertyEnum property, boolean ascending, Integer categoryId, Integer currencyId);
}
