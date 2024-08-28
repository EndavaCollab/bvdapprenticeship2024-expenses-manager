package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.dto.ExpenseDto;
import com.endava.expensesmanager.entity.Expense;
import com.endava.expensesmanager.mapper.ExpenseMapper;
import com.endava.expensesmanager.repository.ExpenseRepository;
import com.endava.expensesmanager.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private static final ExpenseMapper expenseMapper = ExpenseMapper.INSTANCE;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        Expense createdExpense = expenseMapper.expenseDtoToExpense(expenseDto);
        createdExpense = expenseRepository.save(createdExpense);
        return expenseMapper.expenseToExpenseDto(createdExpense);
    }

    @Override
    public List<ExpenseDto> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream()
                .map(expenseMapper::expenseToExpenseDto)
                .toList();
    }

    @Override
    public Optional<ExpenseDto> getExpenseById(int id) {
        Optional<Expense> expense = expenseRepository.findById(id);
        return expense.map(expenseMapper::expenseToExpenseDto);
    }

    @Override
    public ExpenseDto updateExpense(int id, ExpenseDto expenseDto) {
        Expense updatedExpense = expenseMapper.expenseDtoToExpense(expenseDto);
        updatedExpense = expenseRepository.save(updatedExpense);

        return expenseMapper.expenseToExpenseDto(updatedExpense);
    }

    @Override
    public void deleteExpense(int id) {
        expenseRepository.deleteById(id);
    }
    @Override
    public List<ExpenseDto> getExpensesByUserId(int userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .map(expenseMapper::expenseToExpenseDto)
                .toList();
    }
}