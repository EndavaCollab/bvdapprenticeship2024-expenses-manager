package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.entity.Category;
import com.endava.expensesmanager.entity.Currency;
import com.endava.expensesmanager.entity.Expense;
import com.endava.expensesmanager.entity.Users;
import com.endava.expensesmanager.repository.ExpenseRepository;
import com.endava.expensesmanager.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public Expense createExpense(LocalDateTime date, Category category, Currency currency,
                                 int amount, String description, Users users) {
        Expense expense = new Expense();
        expense.setDate(date);
        expense.setCategory(category);
        expense.setCurrency(currency);
        expense.setAmount(amount);
        expense.setDescription(description);
        expense.setUser(users);

        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Override
    public Optional<Expense> getExpenseById(int id) {
        return expenseRepository.findById(id);
    }

    @Override
    public Expense updateExpense(int id, LocalDateTime date, Category category,
                                 Currency currency, int amount, String description) {
        Optional<Expense> optionalExpense = expenseRepository.findById(id);
        if (optionalExpense.isPresent()) {
            Expense expense = optionalExpense.get();
            expense.setDate(date);
            expense.setCategory(category);
            expense.setCurrency(currency);
            expense.setAmount(amount);
            expense.setDescription(description);

            return expenseRepository.save(expense);
        }
        return null;
    }

    @Override
    public void deleteExpense(int id) {
        expenseRepository.deleteById(id);
    }
}
