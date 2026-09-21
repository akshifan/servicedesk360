package com.servicedesk360.dto.notification;
import com.servicedesk360.entity.Notification;
import java.time.Instant;
public record NotificationResponse(Long id,String type,String title,String message,String referenceType,Long referenceId,Instant readAt,Instant createdAt){public static NotificationResponse from(Notification n){return new NotificationResponse(n.getId(),n.getType(),n.getTitle(),n.getMessage(),n.getReferenceType(),n.getReferenceId(),n.getReadAt(),n.getCreatedAt());}}
