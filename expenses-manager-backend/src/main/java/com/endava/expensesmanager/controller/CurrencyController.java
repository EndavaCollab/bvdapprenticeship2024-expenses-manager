package com.endava.expensesmanager.controller;

import com.endava.expensesmanager.dto.CurrencyDto;
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
    public ResponseEntity<List<CurrencyDto>> getAllCurrencies(){
        List<CurrencyDto> currencies = currencyService.getAllCurrencies();
        return ResponseEntity.ok(currencies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CurrencyDto> getCurrencyById(@PathVariable int id){
        Optional<CurrencyDto> currency = currencyService.getCurrencyById(id);
        return currency.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
