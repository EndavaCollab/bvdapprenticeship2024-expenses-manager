package com.endava.expensesmanager.repository;

import com.endava.expensesmanager.entity.Expense;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findByUserId(int userId);

    List<Expense> findAllByUserIdAndDateBetween(int userId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("""
            SELECT e
            FROM Expense e
            WHERE e.user.id = :userId
            AND (e.date >= :startDate OR :startDate IS NULL)
            AND (e.date <= :endDate OR :endDate IS NULL)
            AND (e.category.id= :categoryId OR :categoryId IS NULL)
            AND (e.currency.id= :currencyId OR :currencyId IS NULL)""")
    List<Expense> findAllExpensesOnPage(int userId, LocalDateTime startDate, LocalDateTime endDate, Integer categoryId, Integer currencyId, Pageable pageable);

    @Query("""
            SELECT COUNT (e)
            FROM Expense e
            WHERE e.user.id = :userId
            AND (e.date >= :startDate OR :startDate IS NULL)
            AND (e.date <= :endDate OR :endDate IS NULL)
            AND (e.category.id= :categoryId OR :categoryId IS NULL)
            AND (e.currency.id= :currencyId OR :currencyId IS NULL)""")
    int countAllExpenses(int userId, LocalDateTime startDate, LocalDateTime endDate, Integer categoryId, Integer currencyId);
}
