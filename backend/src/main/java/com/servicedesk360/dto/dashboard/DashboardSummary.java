package com.servicedesk360.dto.dashboard;
public record DashboardSummary(String role,long openTickets,long inProgressTickets,long resolvedTickets,long openTasks,long completedTasks,long totalUsers,long myOpenTickets,long myOpenTasks){}
