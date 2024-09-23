package com.endava.expensesmanager.service;

import java.math.BigDecimal;

public interface CurrencyConversionService {
    BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency);
}
