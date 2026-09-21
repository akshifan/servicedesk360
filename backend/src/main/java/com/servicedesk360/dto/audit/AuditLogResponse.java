package com.servicedesk360.dto.audit;
import com.servicedesk360.entity.AuditLog; import java.time.Instant;
public record AuditLogResponse(Long id,Long actorUserId,String action,String targetType,Long targetId,String detailsJson,Instant createdAt){public static AuditLogResponse from(AuditLog a){return new AuditLogResponse(a.getId(),a.getActorUserId(),a.getAction(),a.getTargetType(),a.getTargetId(),a.getDetailsJson(),a.getCreatedAt());}}
