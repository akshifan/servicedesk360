package com.servicedesk360.dto.ticket;
import jakarta.validation.constraints.NotNull;
public record TicketAssignmentRequest(@NotNull Long assigneeId){}
