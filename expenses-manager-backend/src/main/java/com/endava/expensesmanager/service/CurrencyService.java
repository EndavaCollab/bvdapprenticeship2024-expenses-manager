package com.endava.expensesmanager.service;

import com.endava.expensesmanager.dto.CurrencyDto;

import java.util.List;
import java.util.Optional;

public interface CurrencyService {
    List<CurrencyDto> getAllCurrencies();

    Optional<CurrencyDto> getCurrencyById(int id);
}
