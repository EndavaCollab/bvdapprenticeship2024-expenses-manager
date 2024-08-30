package com.endava.expensesmanager.service;

import com.endava.expensesmanager.entity.Currency;

import java.util.List;
import java.util.Optional;

public interface CurrencyService {
    List<String> getAllCurrencies();

    Optional<Currency> getCurrencyByCode(String code);
}
