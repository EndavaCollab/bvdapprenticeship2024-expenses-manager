package com.endava.expensesmanager.service.impl;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CurrencyResponse {
    private String result;
    private String baseCode;
    private String targetCode;
    private Double conversionRate;
}
