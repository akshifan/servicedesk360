package com.servicedesk360.websocket;

import com.servicedesk360.security.JwtAuthenticationConverter;
import com.servicedesk360.security.SecurityConstants;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtDecoder decoder;
    private final JwtAuthenticationConverter converter;

    public WebSocketAuthInterceptor(JwtDecoder decoder) {
        this.decoder = decoder;
        this.converter = new JwtAuthenticationConverter();
    }

    @Override
    public Message<?> preSend(
        Message<?> message,
        MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
            MessageHeaderAccessor.getAccessor(
                message,
                StompHeaderAccessor.class
            );

        if (accessor == null) {
            return message;
        }

        StompCommand command = accessor.getCommand();

        /*
         * ============================
         * STOMP CONNECT
         * ============================
         */
        if (StompCommand.CONNECT.equals(command)) {

            String authorization =
                accessor.getFirstNativeHeader("Authorization");

            if (authorization == null
                || !authorization.startsWith("Bearer ")) {

                throw new MessagingException(
                    "Bearer token required"
                );
            }

            String token =
                authorization.substring(7);

            Jwt jwt = decoder.decode(token);

            JwtAuthenticationToken authentication =
                (JwtAuthenticationToken) converter.convert(jwt);

            if (authentication == null) {
                throw new MessagingException(
                    "Invalid authentication"
                );
            }

            /*
             * This is the important part.
             * Spring associates this principal with
             * the WebSocket/STOMP session.
             */
            accessor.setUser(authentication);

            System.out.println(
                "[WS AUTH] CONNECT authenticated: "
                    + authentication.getName()
            );

            return message;
        }

        /*
         * ============================
         * STOMP SUBSCRIBE
         * ============================
         */
        if (StompCommand.SUBSCRIBE.equals(command)) {

            Principal principal = accessor.getUser();

            System.out.println(
                "[WS AUTH] SUBSCRIBE user: "
                    + principal
            );

            if (principal == null) {
                throw new MessagingException(
                    "Authentication required"
                );
            }

            String destination =
                accessor.getDestination();

            /*
             * ============================
             * TENANT TOPIC
             * ============================
             */
            if (destination != null
                && destination.startsWith("/topic/tenant/")) {

                String[] parts =
                    destination.split("/");

                if (parts.length < 4) {
                    throw new MessagingException(
                        "Invalid tenant destination"
                    );
                }

                if (!(principal
                    instanceof JwtAuthenticationToken authentication)) {

                    throw new MessagingException(
                        "JWT authentication required"
                    );
                }

                Object tenantClaim =
                    authentication.getToken()
                        .getClaim(
                            SecurityConstants.TENANT_ID_CLAIM
                        );

                if (tenantClaim == null) {
                    throw new MessagingException(
                        "Tenant information missing"
                    );
                }

                String requestedTenantId =
                    parts[3];

                String authenticatedTenantId =
                    String.valueOf(tenantClaim);

                if (!authenticatedTenantId.equals(
                    requestedTenantId
                )) {

                    throw new MessagingException(
                        "Tenant subscription denied"
                    );
                }

                System.out.println(
                    "[WS AUTH] Tenant subscription allowed: "
                        + requestedTenantId
                );
            }
        }

        return message;
    }
}
