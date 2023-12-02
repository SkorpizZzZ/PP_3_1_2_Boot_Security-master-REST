package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {

    User findByUsername(String username);

    List<User> findAll();

    User save(User user);

    void delete(User user);

    void truncateTable();
}
