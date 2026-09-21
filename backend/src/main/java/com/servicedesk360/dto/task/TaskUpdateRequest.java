package com.servicedesk360.dto.task;
import com.servicedesk360.entity.TicketPriority; import java.time.Instant;
public record TaskUpdateRequest(String title,String description,TicketPriority priority,Instant dueAt,Long assigneeId){}
