package com.servicedesk360.controller;
import com.servicedesk360.dto.dashboard.DashboardSummary; import com.servicedesk360.service.DashboardService; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/dashboard") public class DashboardController{private final DashboardService service;public DashboardController(DashboardService s){service=s;}@GetMapping("/summary") public DashboardSummary summary(){return service.summary();}}
