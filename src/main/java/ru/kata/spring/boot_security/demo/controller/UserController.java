package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleDao;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@Controller
public class UserController {

    private final UserService userService;
    private final RoleDao roleDao;

    @Autowired
    public UserController(UserService userService, RoleDao roleDao) {
        this.userService = userService;
        this.roleDao = roleDao;
    }


    @GetMapping("/")
    public String homePage() {
        return "index";
    }

    @GetMapping("/user")
    public String userPage(ModelMap model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }


    @GetMapping("/admin")
    public String adminPage(ModelMap model, @AuthenticationPrincipal User user) {
        model.addAttribute("users", userService.findAll());
        model.addAttribute("user", user);
//        model.addAttribute("newUser", new User());
        model.addAttribute("allRoles", roleDao.findAll());
        return "users";
    }


    @GetMapping(value = "/new")
    public String newUser(ModelMap model) {
        model.addAttribute("user", new User());
        model.addAttribute("allRoles", roleDao.findAll());
        return "redirect:/admin";
    }

    @PostMapping(value = "/new")
    public String saveUser(@ModelAttribute("user") User user) {
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping(value = "/admin/edit")
    public String editUser(ModelMap model, @RequestParam(name = "username") String username) {
        model.addAttribute("user", userService.findByUsername(username));
        model.addAttribute("allRoles", roleDao.findAll());
        return "redirect:/admin";
    }

    @PatchMapping(value = "/admin/edit")
    public String update(@ModelAttribute("user") User user, @RequestParam(name = "username") String username) {
        User editUser = userService.findByUsername(username);
        userService.save(editUser);
        return "redirect:/admin";
    }


    @DeleteMapping(value = "/delete")
    public String deleteUserById(@RequestParam(name = "username") String username) {
        userService.delete(userService.findByUsername(username));
        return "redirect:/admin";
    }

}
