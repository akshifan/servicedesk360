package com.servicedesk360.dto.tenant;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;
public record QueueRequest(@NotNull Long teamId,@NotBlank String name,String description){}
