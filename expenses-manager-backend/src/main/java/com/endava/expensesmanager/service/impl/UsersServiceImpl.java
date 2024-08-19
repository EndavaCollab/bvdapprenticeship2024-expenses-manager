package com.endava.expensesmanager.service.impl;

import com.endava.expensesmanager.entity.Users;
import com.endava.expensesmanager.repository.UsersRepository;
import com.endava.expensesmanager.service.UsersService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;

    // Constructor Injection
    public UsersServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public Users createUser(String name) {
        Users user = new Users();
        user.setName(name);
        user.setCreated(LocalDateTime.now());
        return usersRepository.save(user);
    }

    @Override
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    @Override
    public Optional<Users> getUserById(int id) {
        return usersRepository.findById(id);
    }

    @Override
    public Users updateUser(int id, String name) {
        Optional<Users> optionalUser = usersRepository.findById(id);
        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            user.setName(name);
            return usersRepository.save(user);
        }
        return null;
    }

    @Override
    public void deleteUser(int id) {
        usersRepository.deleteById(id);
    }
}