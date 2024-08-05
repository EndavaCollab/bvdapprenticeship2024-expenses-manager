package com.endava.expensesmanager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Category{
    @Id
    @Column(name = "category_id")
    private int categoryId;

    @Column(name = "category_description", nullable = false, unique = true)
    private String categoryDescription;

    @Column(name = "category_color", nullable = false, unique = true)
    private String categoryColor;
}

