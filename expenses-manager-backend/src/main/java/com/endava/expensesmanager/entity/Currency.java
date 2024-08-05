package com.endava.expensesmanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Currency{
    @Id
    @Column(name = "currency_id")
    private int currencyId;

    @Column(name = "currency_code", nullable = true, unique = true)
    private String currencyCode;
}
