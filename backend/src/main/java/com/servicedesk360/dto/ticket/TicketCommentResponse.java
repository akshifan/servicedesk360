package com.servicedesk360.dto.ticket;
import com.servicedesk360.entity.TicketComment; import java.time.Instant;
public record TicketCommentResponse(Long id,Long authorId,String body,String visibility,Instant createdAt){public static TicketCommentResponse from(TicketComment c){return new TicketCommentResponse(c.getId(),c.getAuthor().getId(),c.getBody(),c.getVisibility().name(),c.getCreatedAt());}}
