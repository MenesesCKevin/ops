---
name: dotnet-best-practices
description: Asegura que el código .NET/C# del proyecto KYC_OPS cumpla buenas prácticas. Usar al escribir o revisar código en KYC_OPS.Api (controladores, servicios, datos, configuración).
---

# .NET/C# Best Practices – KYC_OPS

Aplicar estas prácticas al trabajar en **KYC_OPS.Api** (ASP.NET Core 8 Web API).

## Estructura y namespaces

- **Namespaces**: `KYC_OPS.Api.Controllers`, `KYC_OPS.Api.Services`, `KYC_OPS.Api.Data`, `KYC_OPS.Api.Models`, `KYC_OPS.Api.Middleware`, etc.
- **Documentación**: Incluir comentarios XML en clases, interfaces y miembros públicos (summary, param, returns cuando aplique).

```csharp
/// <summary>
/// Servicio de gestión de usuarios.
/// </summary>
public interface IUsuarioService
{
    /// <summary>Obtiene un usuario por número de registro.</summary>
    /// <param name="registro">Número de registro (SSO).</param>
    /// <returns>Usuario o null si no existe.</returns>
    Task<UsuarioDto?> GetByRegistroAsync(int registro, CancellationToken ct = default);
}
```

## Inyección de dependencias

- Preferir **primary constructors** para DI cuando sea claro: `public class UsuarioService(IApplicationDbContext db) : IUsuarioService`
- O constructores clásicos con validación: lanzar `ArgumentNullException.ThrowIfNull(dependency)` para dependencias requeridas.
- Registrar servicios con el ciclo de vida adecuado:
  - **Scoped**: DbContext, servicios que usan DbContext (p. ej. `IUsuarioService`).
  - **Transient**: operaciones sin estado compartido.
  - **Singleton**: cachés, clientes HTTP reutilizables (con cuidado).
- Definir **interfaces** para los servicios (prefijo `I`) para testabilidad y desacoplamiento.

## Controladores (ASP.NET Core Web API)

- Heredar de `ControllerBase`; usar `[ApiController]` y `[Route("api/[controller]")]`.
- Devolver `ActionResult<T>` o `ActionResult`; usar `Ok()`, `NotFound()`, `BadRequest()` en lugar de códigos manuales.
- Mantener controladores delgados: lógica en servicios, no en el controller.
- Validar entrada (model binding, `ModelState`, o validación manual) y devolver respuestas de error consistentes (p. ej. `{ message = "..." }`).

```csharp
[HttpGet("registro/{registro}")]
public async Task<ActionResult<UsuarioDto>> GetByRegistro(string registro, CancellationToken ct)
{
    if (!int.TryParse(registro, out var reg))
        return BadRequest(new { message = "Registro inválido" });
    var user = await _usuarioService.GetByRegistroAsync(reg, ct);
    if (user is null) return NotFound(new { message = "Usuario no encontrado" });
    return Ok(user);
}
```

## Async / Await

- Usar `async`/`await` en operaciones I/O (BD, HTTP, archivos).
- Firmas: `Task` o `Task<T>`; aceptar `CancellationToken` en métodos async cuando tenga sentido (p. ej. servicios y controladores).
- Usar `ConfigureAwait(false)` solo en librerías; en ASP.NET Core no suele ser necesario en controladores/servicios.

## Configuración

- Usar **appsettings.json** y `IConfiguration`; preferir clases fuertes con `IOptions<T>`/`IOptionsSnapshot<T>` cuando haya varias opciones.
- Connection strings y config por entorno en **appsettings.Development.json** (y otros entornos).
- Validar configuración al arranque si es crítica (p. ej. connection string presente).

## Manejo de errores y logging

- Usar **Microsoft.Extensions.Logging** (ILogger); inyectar `ILogger<T>` en servicios y controladores.
- Logs con contexto útil (p. ej. IDs, nombres de entidad); evitar loguear datos sensibles.
- Lanzar excepciones concretas con mensajes claros; capturar solo donde se pueda manejar o transformar en respuesta HTTP.
- En APIs: middleware de excepciones global para devolver respuestas JSON consistentes (p. ej. 500 con `{ message }`).

## Seguridad y validación

- Validar y sanitizar entradas; usar **data annotations** en DTOs/models cuando aplique (`[Required]`, `[Range]`, etc.).
- Acceso a datos: **consultas parametrizadas** (EF Core las usa por defecto); nunca concatenar SQL con entrada de usuario.
- CORS: configurar explícitamente orígenes permitidos; en producción no usar `AllowAnyOrigin()` con credenciales.

## Calidad de código

- Respetar **SOLID**; interfaces pequeñas y cohesivas.
- Evitar duplicación: extraer a servicios compartidos o helpers.
- Nombres que reflejen el dominio (KYC, usuario, permisos, etc.).
- Métodos cortos y con una responsabilidad clara; tipos en carpetas lógicas (Models, DTOs, Services).

## Base de datos (cuando se use EF Core)

- DbContext en **Scoped**; usar `IApplicationDbContext` u otra interfaz si se quiere abstraer para tests.
- Consultas async: `ToListAsync()`, `FirstOrDefaultAsync()`, etc.
- Migraciones en carpeta **Migrations**; no modificar código generado a mano.

## Testing (cuando se añadan pruebas)

- Framework: **xUnit**, **NUnit** o **MSTest**; assertions con **FluentAssertions** si se usa.
- Mocking: **Moq** o **NSubstitute** para interfaces.
- Patrón **AAA** (Arrange, Act, Assert); tests de éxito y de error; validar parámetros nulos cuando aplique.

## Resumen rápido

| Área            | Práctica                                                                 |
|-----------------|---------------------------------------------------------------------------|
| Namespaces      | `KYC_OPS.Api.{Controllers|Services|Data|Models|Middleware}`                 |
| DI              | Primary constructors o constructor + `ThrowIfNull`; interfaces con `I`    |
| Controladores   | Delgados, `ActionResult<T>`, validación de entrada                        |
| Async           | `Task`/`Task<T>`, `CancellationToken` en servicios/APIs                  |
| Config          | appsettings, `IConfiguration`, `IOptions<T>` para opciones tipadas        |
| Logging         | `ILogger<T>`, mensajes con contexto, sin datos sensibles                  |
| Seguridad       | Validación de entrada, consultas parametrizadas, CORS explícito           |
