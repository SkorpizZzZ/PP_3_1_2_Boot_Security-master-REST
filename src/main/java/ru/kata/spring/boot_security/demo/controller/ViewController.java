package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleDao;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@Controller
public class ViewController {

    @GetMapping("/")
    public String homePage() {
        return "html/index";
    }

    @GetMapping("/adminJs")
    public String adminPageJS() {
        return "html/result/adminPage";
    }
    @GetMapping("/userJs")
    public String userPageJS() {
        return "html/result/userPage";
    }
}

