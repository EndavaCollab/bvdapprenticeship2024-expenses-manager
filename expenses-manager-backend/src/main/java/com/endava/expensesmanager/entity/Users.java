package com.endava.expensesmanager.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class Users{
    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_name", nullable=false, unique=true)
    private String userName;

    @Column(name = "user_created", nullable=false)
    private Timestamp userCreated;
}
