package com.endava.expensesmanager.service;

import com.endava.expensesmanager.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> getAllCategories();

    Optional<Category> getCategoryByDescription(String description);
}
