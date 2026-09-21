package com.servicedesk360.dto.task;
import com.servicedesk360.entity.TicketPriority; import jakarta.validation.constraints.*; import java.time.Instant;
public record TaskCreateRequest(Long ticketId,Long assigneeId,@NotBlank @Size(max=240) String title,String description,@NotNull TicketPriority priority,Instant dueAt){}
