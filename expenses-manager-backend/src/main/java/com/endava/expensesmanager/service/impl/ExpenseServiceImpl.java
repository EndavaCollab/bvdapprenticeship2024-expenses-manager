package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.dto.ExpenseDto;
import com.endava.expensesmanager.entity.Expense;
import com.endava.expensesmanager.enums.PropertyEnum;
import com.endava.expensesmanager.exception.BadRequestException;
import com.endava.expensesmanager.mapper.ExpenseMapper;
import com.endava.expensesmanager.repository.ExpenseRepository;
import com.endava.expensesmanager.service.CurrencyConversionService;
import com.endava.expensesmanager.service.ExpenseService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper = ExpenseMapper.INSTANCE;
    private final CurrencyConversionService currencyConversionService;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, CurrencyConversionService currencyConversionService) {
        this.expenseRepository = expenseRepository;
        this.currencyConversionService = currencyConversionService;
    }

    @Override
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        Expense createdExpense = expenseMapper.expenseDtoToExpense(expenseDto);
        createdExpense = expenseRepository.save(createdExpense);
        return expenseMapper.expenseToExpenseDto(createdExpense);
    }

    @Override
    public List<ExpenseDto> getAllExpenses(String currency) {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream()
                .map(expense -> convertToDtoWithCurrency(expense, currency))
                .toList();
    }

    @Override
    public Optional<ExpenseDto> getExpenseById(int id, String currency) {
        Optional<Expense> expense = expenseRepository.findById(id);
        return expense.map(exp -> convertToDtoWithCurrency(exp, currency));
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
    public List<ExpenseDto> getExpensesByUserId(int userId, LocalDateTime startDate, LocalDateTime endDate, String currency) {

        if (!validateDates(startDate, endDate)) {
            throw new BadRequestException("Invalid date range");
        }

        List<Expense> expenses;
        if (startDate == null && endDate == null) {
            expenses = expenseRepository.findByUserId(userId);
        } else {

            if (endDate == null) {
                endDate = LocalDateTime.now();
            }
            expenses = expenseRepository.findAllByUserIdAndDateBetween(userId, startDate, endDate);
        }


        return expenses.stream()
                .map(expense -> convertToDtoWithCurrency(expense, currency))
                .toList();
    }


    @Override
    public BigDecimal getTotalAmountByDateBetween(int userId, LocalDateTime startDate, LocalDateTime endDate, String currency) {
        List<ExpenseDto> expenses = getExpensesByUserId(userId, startDate, endDate, currency);
        return expenses.stream()
                .map(ExpenseDto::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public List<ExpenseDto> getExpensesPage(int userId, LocalDateTime startDate, LocalDateTime endDate, int page, int size, PropertyEnum property, boolean ascending, Integer categoryId, Integer currencyId, String currency) {
        PageRequest pageRequest = ascending
                ? PageRequest.of(page, size, Sort.by(property.fieldName).ascending())
                : PageRequest.of(page, size, Sort.by(property.fieldName).descending());

        List<Expense> expenses = expenseRepository.findAllExpensesOnPage(userId, startDate, endDate, categoryId, currencyId, pageRequest);
        return expenses.stream()
                .map(expense -> convertToDtoWithCurrency(expense, currency))
                .toList();
    }

    @Override
    public BigDecimal convertExpenseToCurrency(int expenseId, String targetCurrency) {
        Optional<Expense> expenseOptional = expenseRepository.findById(expenseId);
        if (expenseOptional.isEmpty()) {
            throw new BadRequestException("Expense not found");
        }

        Expense expense = expenseOptional.get();
        String sourceCurrency = expense.getCurrency().getCode();
        BigDecimal amount = expense.getAmount();

        return currencyConversionService.convert(amount, sourceCurrency, targetCurrency);
    }

    private ExpenseDto convertToDtoWithCurrency(Expense expense, String currency) {
        ExpenseDto expenseDto = expenseMapper.expenseToExpenseDto(expense);

        if (currency != null && !currency.equals(expense.getCurrency().getCode())) {
            BigDecimal convertedAmount = currencyConversionService.convert(
                    expenseDto.getAmount(),
                    expense.getCurrency().getCode(),
                    currency
            );
            expenseDto.setAmount(convertedAmount);
        }

        return expenseDto;
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

    public Integer countExpensesPage(int userId, LocalDateTime startDate, LocalDateTime endDate, int size, Integer categoryId, Integer currencyId) {
        int expensesCount=expenseRepository.countAllExpenses(userId, startDate, endDate, categoryId, currencyId);
        return (int) Math.ceil((double) expensesCount/size);
    }
}
