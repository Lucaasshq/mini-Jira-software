package com.lucas.org.gerenciador_de_tarefas.config.auth;

import com.lucas.org.gerenciador_de_tarefas.JWT.JwtUtils;
import com.lucas.org.gerenciador_de_tarefas.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // Atalho para rotas públicas: evita processamento pesado e logs desnecessários em endpoints abertos
        if (path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(JwtUtils.JWT_AUTHORIZATION);

        // Verifica se o cabeçalho de autorização está presente e segue o padrão Bearer
        if (header == null || !header.startsWith(JwtUtils.JWT_BEARER)) {
            logger.info("Acesso sem token detectado ou formato inválido.");
            filterChain.doFilter(request, response);
            return;
        }

        // Extrai apenas o hash do token, removendo o prefixo "Bearer "
        String token = header.substring(JwtUtils.JWT_BEARER.length());

        if (!JwtUtils.validarToken(token)){
            logger.warn("Token JWT expirado ou adulterado.");
            filterChain.doFilter(request, response);
            return;
        }

        // Recupera a identidade (email) encapsulada no payload do token
        String email = JwtUtils.extractEmail(token);

        // Se o token é válido, promovemos a autenticação manual no contexto do Spring Security
        toAuthentication(request, email);

        filterChain.doFilter(request, response);
    }

    private void toAuthentication(HttpServletRequest request, String email) {
        // Carrega os detalhes do usuário via banco de dados para garantir que a conta ainda está ativa
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        UsernamePasswordAuthenticationToken authenticationToken = UsernamePasswordAuthenticationToken
                .authenticated(userDetails, null, userDetails.getAuthorities());

        // Vincula detalhes da requisição (IP, Sessão) ao objeto de autenticação
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // Define o usuário como autenticado para o ciclo de vida desta requisição específica
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}