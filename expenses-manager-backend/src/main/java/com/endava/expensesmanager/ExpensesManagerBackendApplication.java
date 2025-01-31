package com.endava.expensesmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExpensesManagerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpensesManagerBackendApplication.class, args);
    }

}
