package com.servicedesk360.dto.task;
import com.servicedesk360.entity.TaskStatus; import jakarta.validation.constraints.NotNull;
public record TaskStatusRequest(@NotNull TaskStatus status){}
