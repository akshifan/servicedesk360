package com.servicedesk360.websocket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketConfig
    implements WebSocketMessageBrokerConfigurer {

    private final String origin;
    private final WebSocketAuthInterceptor interceptor;

    public WebSocketConfig(
        @Value("${app.cors.allowed-origin:http://localhost:5173}")
        String origin,
        WebSocketAuthInterceptor interceptor
    ) {
        this.origin = origin;
        this.interceptor = interceptor;
    }

    @Override
    public void configureClientInboundChannel(
        ChannelRegistration registration
    ) {
        registration.interceptors(interceptor);
    }

    @Override
    public void configureMessageBroker(
        MessageBrokerRegistry registry
    ) {
        registry.enableSimpleBroker(
            "/topic",
            "/queue"
        );

        registry.setApplicationDestinationPrefixes(
            "/app"
        );

        registry.setUserDestinationPrefix(
            "/user"
        );
    }

    @Override
    public void registerStompEndpoints(
        StompEndpointRegistry registry
    ) {

        String[] allowedOrigins =
            Arrays.stream(origin.split(","))
                .map(String::trim)
                .toArray(String[]::new);

        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns(
                allowedOrigins
            );
    }
}
