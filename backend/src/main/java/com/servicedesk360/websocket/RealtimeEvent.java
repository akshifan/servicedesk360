package com.servicedesk360.websocket;
import java.time.Instant;
public record RealtimeEvent(String type,Long tenantId,Long resourceId,String message,Instant occurredAt){public static RealtimeEvent of(String type,Long tenantId,Long resourceId,String message){return new RealtimeEvent(type,tenantId,resourceId,message,Instant.now());}}
