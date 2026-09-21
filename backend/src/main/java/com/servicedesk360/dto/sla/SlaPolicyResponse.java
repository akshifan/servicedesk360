package com.servicedesk360.dto.sla;
import com.servicedesk360.entity.SlaPolicy;
public record SlaPolicyResponse(Long id,String priority,Integer firstResponseMinutes,Integer resolutionMinutes,boolean active){public static SlaPolicyResponse from(SlaPolicy p){return new SlaPolicyResponse(p.getId(),p.getPriority().name(),p.getFirstResponseMinutes(),p.getResolutionMinutes(),p.isActive());}}
