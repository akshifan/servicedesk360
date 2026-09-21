package com.servicedesk360.dto.ticket;
import com.servicedesk360.entity.TicketPriority;
import jakarta.validation.constraints.*;
public record TicketCreateRequest(@NotBlank @Size(max=240) String title,@NotBlank String description,@NotNull TicketPriority priority){}
