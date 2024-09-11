package com.endava.expensesmanager.enums;

public enum PropertyEnum {
    DATE("date"),
    AMOUNT("amount"),
    NONE("none");

    public final String fieldName;

    PropertyEnum(String fieldName) {
        this.fieldName = fieldName;
    }
}
