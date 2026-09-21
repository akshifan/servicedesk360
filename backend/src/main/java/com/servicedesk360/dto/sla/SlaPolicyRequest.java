package com.servicedesk360.dto.sla;
import com.servicedesk360.entity.TicketPriority; import jakarta.validation.constraints.*;
public record SlaPolicyRequest(@NotNull TicketPriority priority,@NotNull @Positive Integer firstResponseMinutes,@NotNull @Positive Integer resolutionMinutes,@NotNull Boolean active){}
