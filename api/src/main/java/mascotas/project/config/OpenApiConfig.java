package mascotas.project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${app.swagger.server.url:}")
    private String serverUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("Pata Solidaria API")
                        .version("1.0")
                        .description("API para la aplicación Pata Solidaria"));

        // Si hay URL configurada (Railway), agregarla como servidor
        if (serverUrl != null && !serverUrl.isEmpty()) {
            openAPI.servers(List.of(
                    new Server().url(serverUrl).description("Production Server")
            ));
        }

        return openAPI;
    }
}
