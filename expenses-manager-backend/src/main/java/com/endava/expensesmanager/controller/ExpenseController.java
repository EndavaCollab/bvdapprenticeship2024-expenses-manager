package com.endava.expensesmanager.controller;

import com.endava.expensesmanager.entity.Category;
import com.endava.expensesmanager.entity.Currency;
import com.endava.expensesmanager.entity.Expense;
import com.endava.expensesmanager.entity.Users;
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
    public ResponseEntity<Expense> createExpense(@RequestParam LocalDateTime date, @RequestParam Category category,
                                                 @RequestParam Currency currency, @RequestParam int amount,
                                                 @RequestParam String description, @RequestParam Users users) {
        Expense expense = expenseService.createExpense(date, category, currency, amount, description, users);
        return ResponseEntity.ok(expense);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable int id) {
        Optional<Expense> expense = expenseService.getExpenseById(id);
        return expense.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable int id, @RequestParam LocalDateTime date,
                                                 @RequestParam Category category, @RequestParam Currency currency,
                                                 @RequestParam int amount, @RequestParam String description) {
        Expense updatedExpense = expenseService.updateExpense(id, date, category, currency, amount, description);
        return updatedExpense != null ? ResponseEntity.ok(updatedExpense) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Expense> deleteExpense(@PathVariable int id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
