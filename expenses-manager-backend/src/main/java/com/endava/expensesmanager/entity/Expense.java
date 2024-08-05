package com.endava.expensesmanager.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class Expense{
    @Id
    @Column(name = "expense_id")
    private String expenseId;

    @Column(name = "expense_description", nullable = true, unique = false)
    private String description;

    @Column(name = "expense_date", nullable = false, unique = false)
    private Timestamp expenseDate;

    @Column(name = "expense_amount", nullable=false, unique = false)
    private int expenseAmount;

    @OneToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Category category;

    @OneToOne
    @JoinColumn(name = "currency_id", referencedColumnName = "currency_id")
    private Currency currency;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users user;
}
