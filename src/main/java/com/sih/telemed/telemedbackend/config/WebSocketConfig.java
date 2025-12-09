package com.sih.telemed.telemedbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // tighten this later
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // client subscribes to /topic/** or /queue/**
        registry.enableSimpleBroker("/topic", "/queue");
        // messages sent to /app/** will be routed to @MessageMapping
        registry.setApplicationDestinationPrefixes("/app");
    }

}
