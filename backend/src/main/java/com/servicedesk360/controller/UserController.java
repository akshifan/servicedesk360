package com.servicedesk360.controller;

import com.servicedesk360.dto.common.PageResponse;
import com.servicedesk360.dto.user.UpdateUserRoleRequest;
import com.servicedesk360.dto.user.UpdateUserStatusRequest;
import com.servicedesk360.dto.user.UserResponse;
import com.servicedesk360.dto.user.CreateUserRequest;
import com.servicedesk360.service.CurrentUserService;
import com.servicedesk360.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserService userService;

    public UserController(
            CurrentUserService currentUserService,
            UserService userService
    ) {
        this.currentUserService = currentUserService;
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse currentUser() {
        return currentUserService.getRequiredUserResponse();
    }

    @GetMapping
    public PageResponse<UserResponse> listUsers(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        return userService.listUsers(pageable);
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/status")
    public UserResponse updateStatus(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @Valid @org.springframework.web.bind.annotation.RequestBody
            UpdateUserStatusRequest request
    ) {
        return userService.updateStatus(id, request);
    }

    @org.springframework.web.bind.annotation.PatchMapping("/{id}/role")
    public UserResponse updateRole(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @Valid @org.springframework.web.bind.annotation.RequestBody
            UpdateUserRoleRequest request
    ) {
        return userService.updateRole(id, request);
    }
}
