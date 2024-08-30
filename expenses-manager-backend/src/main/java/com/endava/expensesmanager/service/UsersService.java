package com.endava.expensesmanager.service;

import com.endava.expensesmanager.dto.UserDto;
import com.endava.expensesmanager.entity.Users;

import java.util.List;
import java.util.Optional;

public interface UsersService {


    Users createUser(String name);

    List<Users> getAllUsers();

    Optional<Users> getUserById(int id);

    Optional<Users> getUserByName(String name);

    Users updateUser(int id, String name);

    void deleteUser(int id);

    UserDto loginUser(String name);
}
