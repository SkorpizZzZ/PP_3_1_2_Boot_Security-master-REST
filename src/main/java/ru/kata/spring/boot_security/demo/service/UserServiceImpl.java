package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserDao;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserDao userDao;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserServiceImpl(UserDao userDao, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userDao = userDao;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    @Transactional
    public List<User> findAll() {
        return userDao.findAll();
    }

    @Override
    @Transactional
    public User save(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userDao.saveAndFlush(user);
    }

    @Override
    @Transactional
    public void delete(User user) {
        userDao.delete(findByUsername(user.getUsername()));
    }

    @Override
    @Transactional
    public void truncateTable() {
        userDao.deleteAll();
    }

    @Override
    public User updateUser(User user) {
        return userDao.saveAndFlush(user);
    }


    @Override
    public User findByUsername(String username) {
        return userDao.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден."));
    }

    @Override
    public User findById(Long id) {
        return userDao.findById(id).orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден."));
    }

}