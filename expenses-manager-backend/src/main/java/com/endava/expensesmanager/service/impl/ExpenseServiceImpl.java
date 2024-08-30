package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.dto.ExpenseDto;
import com.endava.expensesmanager.entity.Expense;
import com.endava.expensesmanager.exception.BadRequestException;
import com.endava.expensesmanager.mapper.ExpenseMapper;
import com.endava.expensesmanager.repository.ExpenseRepository;
import com.endava.expensesmanager.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
    public List<ExpenseDto> getExpensesByUserId(int userId, LocalDateTime startDate, LocalDateTime endDate) {
        if (!validateDates(startDate, endDate)) {
            throw new BadRequestException();
        }
        if (startDate == null) {
            return expenseRepository.findByUserId(userId).stream()
                    .map(expenseMapper::expenseToExpenseDto)
                    .toList();
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }
        return expenseRepository.findAllByUserIdAndDateBetween(userId, startDate, endDate).stream()
                .map(expenseMapper::expenseToExpenseDto)
                .toList();

    }

    private boolean validateDates(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null && endDate == null) {
            return true;
        }
        if (startDate != null && endDate != null) {
            return startDate.isBefore(endDate);
        }
        if (startDate != null) {
            return startDate.isBefore(LocalDateTime.now());
        }
        return false;
    }


}