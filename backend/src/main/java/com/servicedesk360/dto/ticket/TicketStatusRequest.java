package com.servicedesk360.dto.ticket;
import com.servicedesk360.entity.TicketStatus; import jakarta.validation.constraints.NotNull;
public record TicketStatusRequest(@NotNull TicketStatus status){}
