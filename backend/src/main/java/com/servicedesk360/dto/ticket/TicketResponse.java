package com.servicedesk360.dto.ticket;
import com.servicedesk360.entity.Ticket;
import java.time.Instant;
public record TicketResponse(Long id,String ticketNumber,Long requesterId,Long assigneeId,String title,String description,String priority,String status,Instant createdAt,Instant updatedAt,Instant firstResponseDueAt,Instant resolutionDueAt){ public static TicketResponse from(Ticket t){return new TicketResponse(t.getId(),t.getTicketNumber(),t.getRequester().getId(),t.getAssignee()==null?null:t.getAssignee().getId(),t.getTitle(),t.getDescription(),t.getPriority().name(),t.getStatus().name(),t.getCreatedAt(),t.getUpdatedAt(),t.getFirstResponseDueAt(),t.getResolutionDueAt());}}
