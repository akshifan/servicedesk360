package com.servicedesk360.websocket;

import com.servicedesk360.security.JwtAuthenticationConverter;
import com.servicedesk360.security.SecurityConstants;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {
    private final JwtDecoder decoder;
    private final JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

    public WebSocketAuthInterceptor(JwtDecoder decoder) {
        this.decoder = decoder;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (accessor.getCommand() == StompCommand.CONNECT) {
            String header = accessor.getFirstNativeHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                throw new MessagingException("Bearer token required");
            }

            Jwt jwt = decoder.decode(header.substring(7));
            Authentication authentication = converter.convert(jwt);
            accessor.setUser(authentication);
        }

        if (accessor.getCommand() == StompCommand.SUBSCRIBE) {
            if (!(accessor.getUser() instanceof JwtAuthenticationToken authentication)) {
                throw new MessagingException("Authentication required");
            }

            String destination = accessor.getDestination();
            if (destination != null && destination.startsWith("/topic/tenant/")) {
                String[] parts = destination.split("/");
                if (parts.length < 4) {
                    throw new MessagingException("Invalid tenant destination");
                }

                Object tenantClaim = authentication.getToken()
                        .getClaim(SecurityConstants.TENANT_ID_CLAIM);

                if (tenantClaim == null || !String.valueOf(tenantClaim).equals(parts[3])) {
                    throw new MessagingException("Tenant subscription denied");
                }
            }
        }

        return message;
    }
}
