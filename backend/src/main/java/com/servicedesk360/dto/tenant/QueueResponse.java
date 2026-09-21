package com.servicedesk360.dto.tenant;
import com.servicedesk360.entity.Queue;
public record QueueResponse(Long id,Long teamId,String teamName,String name,String description,boolean active){public static QueueResponse from(Queue q){return new QueueResponse(q.getId(),q.getTeam().getId(),q.getTeam().getName(),q.getName(),q.getDescription(),q.isActive());}}
