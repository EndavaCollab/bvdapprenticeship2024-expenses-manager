package com.endava.expensesmanager.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Users{
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "name", nullable = false, unique=true)
    private String name;

    @Column(name = "created", nullable = false)
    private LocalDateTime created;
}
