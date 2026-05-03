package com.lucas.org.gerenciador_de_tarefas.JWT;

import com.lucas.org.gerenciador_de_tarefas.Repository.UserRepository;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import static io.jsonwebtoken.Jwts.builder;

@NoArgsConstructor
@Configuration
public class JwtUtils {


    UserRepository userRepository;

    public JwtUtils(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    private static final String SECRET = "63640264849a87c90356129d99ea165e37aa5fabc1fea46906df1a7ca50db492";
    public static final long EXPIRE_DAYS = 0;
    public static final long EXPIRE_HOURS = 2;
    public static final long EXPIRE_MINUTES = 30;
    public static final long EXPIRATION_REFRESH_TOKEN_DAYS = 7;
    public static final String JWT_AUTHORIZATION = "Authorization";
    public static final String JWT_BEARER = "Bearer ";


    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());




    public String gerarToken(UserDetails userDetails, Date expiration, String email) {
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .toList();

        Date limit = EXPIRATION_TOKEN(expiration);

        return builder()
                .setSubject(userDetails.getUsername())
                .claim("email", email)
                .claim("roles", roles)
                .setExpiration(limit)
                .signWith(KEY)
                .compact();
    }

    public static String extractEmail(String token){
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("email", String.class);
    }


    public Date EXPIRATION_TOKEN(Date start){
        LocalDateTime dateTime = start.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        LocalDateTime end = dateTime.plusDays(EXPIRE_DAYS).plusHours(EXPIRE_HOURS).plusMinutes(EXPIRE_MINUTES);
        return Date.from(end.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
