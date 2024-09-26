package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.exception.BadRequestException;
import com.endava.expensesmanager.service.CurrencyConversionService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class CurrencyConversionServiceImpl implements CurrencyConversionService {

    private final RestTemplate restTemplate;

    @Value("${api.currency.url}")
    private String apiCurrencyUrl;

    @Value("${api.currency.key}")
    private String apiKey;

    public CurrencyConversionServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (toCurrency == null || toCurrency.trim().isEmpty()) {
            return amount;
        }

        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }

        String url = String.format("%s/pair/%s/%s", apiCurrencyUrl.replace("YOUR-API-KEY", apiKey), fromCurrency, toCurrency);


        CurrencyResponse response = restTemplate.getForObject(url, CurrencyResponse.class);

        if (response == null || !"success".equals(response.getResult())) {
            throw new BadRequestException("Failed to get conversion rates from API");
        }

        Double conversionRate = response.getConversionRate();
        if (conversionRate == null) {
            throw new BadRequestException("Invalid conversion rate received");
        }

        return amount.multiply(BigDecimal.valueOf(conversionRate));
    }

    public static class CurrencyResponse {
        @Setter
        @Getter
        private String result;
        private Double conversion_rate;

        public Double getConversionRate() {
            return conversion_rate;
        }

        public void setConversionRate(Double conversion_rate) {
            this.conversion_rate = conversion_rate;
        }
    }
}
