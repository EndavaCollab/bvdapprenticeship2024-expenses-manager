package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.dto.CategoryDto;
import com.endava.expensesmanager.entity.Category;
import com.endava.expensesmanager.mapper.CategoryMapper;
import com.endava.expensesmanager.repository.CategoryRepository;
import com.endava.expensesmanager.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService{
    private final CategoryRepository categoryRepository;
    private static final CategoryMapper categoryMapper = CategoryMapper.INSTANCE;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {this.categoryRepository = categoryRepository;}

    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(categoryMapper::CategoryToCategoryDto)
                .toList();
    }

    @Override
    public Optional<CategoryDto> getCategoryById(int id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(categoryMapper::CategoryToCategoryDto);
    }

}
