package com.endava.expensesmanager.service;

import com.endava.expensesmanager.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<String> getAllCategoryDescriptions();

    Optional<Category> getCategoryByDescription(String description);
}
