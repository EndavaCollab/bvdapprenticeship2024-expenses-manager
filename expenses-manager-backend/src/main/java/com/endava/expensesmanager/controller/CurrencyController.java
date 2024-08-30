package com.endava.expensesmanager.controller;

import com.endava.expensesmanager.entity.Currency;
import com.endava.expensesmanager.service.CurrencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/currencies")
public class CurrencyController {
    private final CurrencyService currencyService;

    public CurrencyController (CurrencyService currencyService) {this.currencyService=currencyService;}

    @GetMapping
    public ResponseEntity<List<String>> getAllCurrencies(){
        List<String> currencies = currencyService.getAllCurrencies();
        return ResponseEntity.ok(currencies);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Currency> getCurrencyByCode(@PathVariable String code){
        Optional<Currency> currency = currencyService.getCurrencyByCode(code);
        return currency.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
