package com.endava.expensesmanager.mapper;

import com.endava.expensesmanager.dto.ExpenseDto;
import com.endava.expensesmanager.entity.Expense;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ExpenseMapper {

    ExpenseMapper INSTANCE = Mappers.getMapper( ExpenseMapper.class );

    @Mapping(source = "expense.category.id", target = "categoryId")
    @Mapping(source = "expense.currency.id", target = "currencyId")
    @Mapping(source = "expense.user.id", target = "userId")
    @Mapping(source = "expense.user.name", target = "userName")
    ExpenseDto expenseToExpenseDto(Expense expense);

    @Mapping(source = "categoryId", target = "category.id")
    @Mapping(source = "currencyId", target = "currency.id")
    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "userName", target = "user.name")
    Expense expenseDtoToExpense(ExpenseDto expenseDto);
}
