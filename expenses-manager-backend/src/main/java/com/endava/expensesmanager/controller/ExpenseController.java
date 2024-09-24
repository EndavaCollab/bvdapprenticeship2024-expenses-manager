package com.endava.expensesmanager.controller;

import com.endava.expensesmanager.dto.ExpenseDto;
import com.endava.expensesmanager.enums.PropertyEnum;
import com.endava.expensesmanager.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@RequestBody ExpenseDto expense) {
        ExpenseDto createdExpense = expenseService.createExpense(expense);
        return ResponseEntity.ok(createdExpense);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getAllExpenses(@RequestParam(required = false) String currency) {
        List<ExpenseDto> expenses = expenseService.getAllExpenses(currency);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable int id, @RequestParam(required = false) String currency) {
        Optional<ExpenseDto> expense = expenseService.getExpenseById(id, currency);
        return expense.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto> updateExpense(@PathVariable int id, @RequestBody ExpenseDto expense) {
        ExpenseDto updatedExpense = expenseService.updateExpense(id, expense);
        return updatedExpense != null ? ResponseEntity.ok(updatedExpense) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable int id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExpenseDto>> getExpensesByUserId(
            @PathVariable int userId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) String currency) {
        List<ExpenseDto> expenses = expenseService.getExpensesByUserId(userId, startDate, endDate, currency);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/user/total")
    public ResponseEntity<BigDecimal> getTotalAmountByDateBetween(
            @RequestParam int userId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) String currency) {
        BigDecimal total = expenseService.getTotalAmountByDateBetween(userId, startDate, endDate, currency);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/user/{userId}/")
    public ResponseEntity<List<ExpenseDto>> getExpensesPage(
            @PathVariable int userId,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "DATE") PropertyEnum sortBy,
            @RequestParam(required = false) boolean ascending,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer currencyId,
            @RequestParam(required = false) String currency) {
        List<ExpenseDto> expenses = expenseService.getExpensesPage(
                userId, startDate, endDate, page, size, sortBy, ascending, categoryId, currencyId, currency);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/convert/{expenseId}")
    public ResponseEntity<BigDecimal> convertExpenseToCurrency(
            @PathVariable int expenseId,
            @RequestParam String targetCurrency) {
        BigDecimal convertedAmount = expenseService.convertExpenseToCurrency(expenseId, targetCurrency);
        return ResponseEntity.ok(convertedAmount);
    }
}
