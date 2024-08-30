package com.endava.expensesmanager.repository;

import com.endava.expensesmanager.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findByUserId(int userId);

    List<Expense> findAllByUserIdAndDateBetween(int userId, LocalDateTime startDate, LocalDateTime endDate);
}
