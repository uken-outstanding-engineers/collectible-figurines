package uken.collectible_figurines.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

  private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

  public String generateToken(Long userId, String username, String email, String permission, String avatarUrl) {
    String avatar = (avatarUrl != null) ? avatarUrl : "";

    return Jwts.builder()
      .setSubject(username)
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 1000 * 30
      .addClaims(Map.of(
        "id", userId,
        "email", email,
        "permission", permission,
        "avatarUrl", avatar
      ))
      .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
      .compact();
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public String extractPermission(String token) {
    return extractClaim(token, claims -> (String) claims.get("permission"));
  }

  public boolean isTokenValid(String token, String username) {
    return username.equals(extractUsername(token)) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    return extractClaim(token, Claims::getExpiration).before(new Date());
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    try {
      Claims claims = Jwts.parserBuilder()
        .setSigningKey(SECRET_KEY)
        .build()
        .parseClaimsJws(token)
        .getBody();
      return claimsResolver.apply(claims);
    } catch (JwtException | IllegalArgumentException e) {
      System.out.println("Error: " + e.getMessage());
      return null;
    }
  }
}
