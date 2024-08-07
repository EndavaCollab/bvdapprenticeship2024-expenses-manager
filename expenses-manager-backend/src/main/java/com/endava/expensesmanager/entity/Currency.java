package com.endava.expensesmanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Currency{
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;
}
