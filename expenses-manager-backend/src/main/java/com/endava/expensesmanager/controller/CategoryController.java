package com.endava.expensesmanager.controller;

import com.endava.expensesmanager.entity.Category;
import com.endava.expensesmanager.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {this.categoryService = categoryService;}

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categoryDescriptions = categoryService.getAllCategories();
        return ResponseEntity.ok(categoryDescriptions);
    }

    @GetMapping("/{description}")
    public ResponseEntity<Category> getCategoryByDescription(@PathVariable String description) {
        Optional<Category> category = categoryService.getCategoryByDescription(description);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
