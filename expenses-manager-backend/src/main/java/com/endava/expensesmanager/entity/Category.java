package com.endava.expensesmanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Category{
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "description", nullable = false, unique = true)
    private String description;

    @Column(name = "color", nullable = false, unique = true)
    private String color;
}

