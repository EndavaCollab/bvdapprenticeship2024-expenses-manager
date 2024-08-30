package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.entity.Category;
import com.endava.expensesmanager.repository.CategoryRepository;
import com.endava.expensesmanager.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService{
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {this.categoryRepository = categoryRepository;}

    @Override
    public List<String> getAllCategoryDescriptions() {
        return categoryRepository.findAll()
                .stream()
                .map(Category::getDescription)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Category> getCategoryByDescription(String description) {return categoryRepository.findByDescription(description);}

}
