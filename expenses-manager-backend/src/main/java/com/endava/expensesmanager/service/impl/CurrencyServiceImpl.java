package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.dto.CurrencyDto;
import com.endava.expensesmanager.entity.Currency;
import com.endava.expensesmanager.mapper.CurrencyMapper;
import com.endava.expensesmanager.repository.CurrencyRepository;
import com.endava.expensesmanager.service.CurrencyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CurrencyServiceImpl implements CurrencyService {
    public final CurrencyRepository currencyRepository;
    private static final CurrencyMapper currencyMapper = CurrencyMapper.INSTANCE;

    public CurrencyServiceImpl(CurrencyRepository currencyRepository) {this.currencyRepository = currencyRepository;}


    @Override
    public List<CurrencyDto> getAllCurrencies() {
        List<Currency> currencies = currencyRepository.findAll();
        return currencies.stream()
                .map(currencyMapper::CurrencyToCurrencyDto)
                .toList();
    }

    @Override
    public Optional<CurrencyDto> getCurrencyById(int id) {
        Optional<Currency> currency = currencyRepository.findById(id);
        return currency.map(currencyMapper::CurrencyToCurrencyDto);
    }
}
