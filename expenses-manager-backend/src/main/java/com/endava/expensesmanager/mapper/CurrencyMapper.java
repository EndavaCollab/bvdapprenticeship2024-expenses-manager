package com.endava.expensesmanager.mapper;

import com.endava.expensesmanager.dto.CurrencyDto;
import com.endava.expensesmanager.entity.Currency;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CurrencyMapper {
    CurrencyMapper INSTANCE = Mappers.getMapper(CurrencyMapper.class);

    CurrencyDto CurrencyToCurrencyDto(Currency currency);

    Currency CurrencyDtoToCurrency(CurrencyDto currencyDto);
}
