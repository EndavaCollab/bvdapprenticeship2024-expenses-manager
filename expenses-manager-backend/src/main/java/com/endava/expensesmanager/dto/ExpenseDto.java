package com.endava.expensesmanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ExpenseDto {

    private int id;

    private String description;

    private LocalDateTime date;

    private BigDecimal amount;

    private int categoryId;

    private int currencyId;

    private int userId;

    private String userName;
}
