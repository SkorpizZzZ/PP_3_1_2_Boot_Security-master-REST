package ru.kata.spring.boot_security.demo.configs;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class DatabaseInitializer {

    private final UserService userService;
    private final RoleService roleService;

    public DatabaseInitializer(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void init() {
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(Optional.ofNullable(roleService.findByName("ROLE_ADMIN")).orElseGet(() -> roleService.save(new Role("ROLE_ADMIN"))));

        Set<Role> userRoles = new HashSet<>();
        userRoles.add(Optional.ofNullable(roleService.findByName("ROLE_USER")).orElseGet(() -> roleService.save(new Role("ROLE_USER"))));
            userService.save(new User("admin", "admin", adminRoles));
            userService.save(new User("user", "user", userRoles));

    }
    @PreDestroy
    void preDestroy() {
        userService.truncateTable();
        roleService.truncateTable();
    }
}
