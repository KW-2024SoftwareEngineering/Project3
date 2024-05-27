package com.se2024.motoo.token;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    // Http 요청이 들어오면 가장 먼저 거치는 filter
    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        // Header에서 Token 가져오기
        String token = jwtProvider.resolveToken(request);

        // 토큰이 유효하다면,
        if (token != null && jwtProvider.validateToken(token)) {
            // 토큰으로부터 인증 정보를 받아
            Authentication authentication = jwtProvider.getAuthentication(token);
            // SecurityContext 객체에 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response); // 다음 filter 실행
    }
}
