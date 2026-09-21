package com.servicedesk360.dto.tenant;
import com.servicedesk360.entity.Team;
public record TeamResponse(Long id,String name,String description,boolean active){public static TeamResponse from(Team t){return new TeamResponse(t.getId(),t.getName(),t.getDescription(),t.isActive());}}
