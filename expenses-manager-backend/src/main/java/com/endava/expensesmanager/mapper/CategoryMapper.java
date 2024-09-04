package com.endava.expensesmanager.mapper;

import com.endava.expensesmanager.dto.CategoryDto;
import com.endava.expensesmanager.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    CategoryDto CategoryToCategoryDto(Category category);

    Category CategoryDtoToCategory(CategoryDto categoryDto);
}
