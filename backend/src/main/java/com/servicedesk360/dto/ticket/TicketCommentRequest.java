package com.servicedesk360.dto.ticket;
import com.servicedesk360.entity.TicketCommentVisibility; import jakarta.validation.constraints.*;
public record TicketCommentRequest(@NotBlank String body,@NotNull TicketCommentVisibility visibility){}
