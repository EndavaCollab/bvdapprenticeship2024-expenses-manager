package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.entity.Currency;
import com.endava.expensesmanager.exception.BadRequestException;
import com.endava.expensesmanager.repository.CurrencyRepository;
import com.endava.expensesmanager.service.CurrencyConversionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CurrencyConversionServiceImpl implements CurrencyConversionService {

    private final RestTemplate restTemplate;

    private final Map<String, Map<String, Double>> exchangeRatesCache = new HashMap<>();

    private final CurrencyRepository currencyRepository;

    @Value("${api.currency.url}")
    private String apiCurrencyUrl;

    @Value("${api.currency.key}")
    private String apiKey;

    public CurrencyConversionServiceImpl(RestTemplate restTemplate, CurrencyRepository currencyRepository) {
        this.restTemplate = restTemplate;
        this.currencyRepository = currencyRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void loadExchangeRatesOnStartup() {
        loadExchangeRates();
    }

    @Scheduled(cron = "0 0 0 * * MON")
    public void loadExchangeRates(){
        try {
            List<Currency> currencies = currencyRepository.findAll();
            for (Currency baseCurrency: currencies) {
                String url = String.format("%s/%s/latest/%s", apiCurrencyUrl, apiKey, baseCurrency.getCode());
                CurrencyResponse response = restTemplate.getForObject(url, CurrencyResponse.class);

                if (response != null && "success".equals(response.getResult())) {
                    Map<String, Double> rates = response.getConversionRates();

                    Map<String, Double> filteredRates = new HashMap<>();
                    for (Currency toCurrency: currencies) {
                        if (!baseCurrency.equals(toCurrency) && rates.containsKey(toCurrency.getCode())) {
                            filteredRates.put(toCurrency.getCode(), rates.get(toCurrency.getCode()));
                        }
                    }

                    exchangeRatesCache.put(baseCurrency.getCode(), filteredRates);
                }
                else{
                    throw new BadRequestException("Failed to load rates for base currency: " + baseCurrency.getCode());
                }
            }
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (toCurrency == null || toCurrency.trim().isEmpty()) {
            return amount;
        }

        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }

        Map<String, Double> rates = exchangeRatesCache.get(fromCurrency);
        if (rates == null) {
            throw new BadRequestException("No exchange rates available for currency: " + fromCurrency);
        }

        Double conversionRate = rates.get(toCurrency);
        if (conversionRate == null) {
            throw new BadRequestException("No exchange rate found for conversion from " + fromCurrency + " to " + toCurrency);
        }

        return amount.multiply(BigDecimal.valueOf(conversionRate));
    }
}
