package com.endava.expensesmanager.controller;

import com.endava.expensesmanager.dto.ExpenseDto;
import com.endava.expensesmanager.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<ExpenseDto>> getAllExpenses() {
        List<ExpenseDto> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable int id) {
        Optional<ExpenseDto> expense = expenseService.getExpenseById(id);
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
    public ResponseEntity<List<ExpenseDto>> getExpensesByUserId(@PathVariable int userId, @RequestParam(required = false) LocalDateTime startDate, @RequestParam(required = false) LocalDateTime endDate) {
        List<ExpenseDto> expenses = expenseService.getExpensesByUserId(userId, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }
}
