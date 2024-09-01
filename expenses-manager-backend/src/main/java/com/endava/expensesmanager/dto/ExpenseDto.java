package com.endava.expensesmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ExpenseDto {

    private int id;

    private String description;

    private LocalDateTime date;

    private int amount;

    private int categoryId;

    private int currencyId;

    private int userId;

    private String userName;
}
