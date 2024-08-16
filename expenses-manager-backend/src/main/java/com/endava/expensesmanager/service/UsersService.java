package com.endava.expensesmanager.service;

import com.endava.expensesmanager.entity.Users;
import com.endava.expensesmanager.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    public Users createUser(String name) {
        Users user = new Users();
        user.setName(name);
        user.setCreated(LocalDateTime.now());
        return usersRepository.save(user);
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public Optional<Users> getUserById(int id) {
        return usersRepository.findById(id);
    }

    public Users updateUser(int id, String name) {
        Optional<Users> optionalUser = usersRepository.findById(id);
        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            user.setName(name);
            return usersRepository.save(user);
        }
        return null;
    }

    public void deleteUser(int id) {
        usersRepository.deleteById(id);
    }
}
