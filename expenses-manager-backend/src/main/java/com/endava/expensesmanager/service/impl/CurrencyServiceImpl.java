package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.entity.Currency;
import com.endava.expensesmanager.repository.CurrencyRepository;
import com.endava.expensesmanager.service.CurrencyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CurrencyServiceImpl implements CurrencyService {
    public final CurrencyRepository currencyRepository;

    public CurrencyServiceImpl(CurrencyRepository currencyRepository) {this.currencyRepository = currencyRepository;}


    @Override
    public List<String> getAllCurrencies() {
        return currencyRepository.findAll()
                .stream()
                .map(Currency::getCode)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Currency> getCurrencyByCode(String code) {return currencyRepository.findByCode(code);}
}
