package com.servicedesk360.dto.task;
import com.servicedesk360.entity.Task; import java.time.Instant;
public record TaskResponse(Long id,Long ticketId,Long assigneeId,String title,String description,String priority,String status,Instant dueAt,Instant createdAt,Instant updatedAt){public static TaskResponse from(Task t){return new TaskResponse(t.getId(),t.getTicket()==null?null:t.getTicket().getId(),t.getAssignee()==null?null:t.getAssignee().getId(),t.getTitle(),t.getDescription(),t.getPriority().name(),t.getStatus().name(),t.getDueAt(),t.getCreatedAt(),t.getUpdatedAt());}}
