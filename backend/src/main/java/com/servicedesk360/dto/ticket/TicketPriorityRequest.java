package com.servicedesk360.dto.ticket;
import com.servicedesk360.entity.TicketPriority; import jakarta.validation.constraints.NotNull;
public record TicketPriorityRequest(@NotNull TicketPriority priority){}
