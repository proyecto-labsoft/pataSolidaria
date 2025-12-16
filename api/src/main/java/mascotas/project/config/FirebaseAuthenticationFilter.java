package mascotas.project.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import mascotas.project.services.interfaces.FireBaseAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.google.firebase.auth.FirebaseToken;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FireBaseAuthService fireBaseAuthService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                // Obtener el token completo con los custom claims
                FirebaseToken decodedToken = fireBaseAuthService.getTokenInfo(token);
                
                if (decodedToken != null) {
                    String firebaseUid = decodedToken.getUid();
                    
                    // Extraer el rol del custom claim
                    String rol = (String) decodedToken.getClaims().get("rol");
                    
                    // Crear las authorities (roles) de Spring Security
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    
                    if ("admin".equals(rol)) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                        logger.info("🔑 Usuario autenticado como ADMIN: " + firebaseUid);
                    } else {
                        logger.info("🔑 Usuario autenticado como USER: " + firebaseUid);
                    }
                    
                    // Todos los usuarios autenticados tienen ROLE_USER
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    firebaseUid,
                                    null,
                                    authorities  // ✅ AHORA INCLUYE LOS ROLES
                            );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                logger.error("Error al verificar token de Firebase: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
