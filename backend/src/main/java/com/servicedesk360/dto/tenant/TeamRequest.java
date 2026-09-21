package com.servicedesk360.dto.tenant;
import jakarta.validation.constraints.NotBlank;
public record TeamRequest(@NotBlank String name,String description){}
