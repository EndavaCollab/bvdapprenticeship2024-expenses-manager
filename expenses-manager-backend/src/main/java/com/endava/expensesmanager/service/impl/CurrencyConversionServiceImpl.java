package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.exception.BadRequestException;
import com.endava.expensesmanager.service.CurrencyConversionService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class CurrencyConversionServiceImpl implements CurrencyConversionService {


    private static final Map<String, Map<String, Double>> conversionRates = new HashMap<>();

    static {
        Map<String, Double> eurRates = new HashMap<>();
        eurRates.put("RON", 5.0);
        eurRates.put("USD", 1.10);
        conversionRates.put("EUR", eurRates);

        Map<String, Double> usdRates = new HashMap<>();
        usdRates.put("EUR", 0.91);
        usdRates.put("RON", 4.54);
        conversionRates.put("USD", usdRates);

        Map<String, Double> ronRates = new HashMap<>();
        ronRates.put("EUR", 0.20);
        ronRates.put("USD", 0.22);
        conversionRates.put("RON", ronRates);
    }

    @Override
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }


        Map<String, Double> rates = conversionRates.get(fromCurrency);
        if (rates == null || !rates.containsKey(toCurrency)) {
            throw new BadRequestException("Unsupported currency conversion from " + fromCurrency + " to " + toCurrency);
        }

        Double conversionRate = rates.get(toCurrency);
        return amount.multiply(BigDecimal.valueOf(conversionRate));
    }
}
