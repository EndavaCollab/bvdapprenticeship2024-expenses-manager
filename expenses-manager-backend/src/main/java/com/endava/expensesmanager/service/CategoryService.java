package com.endava.expensesmanager.service;

import com.endava.expensesmanager.dto.CategoryDto;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<CategoryDto> getAllCategories();

    Optional<CategoryDto> getCategoryById(int id);
}
