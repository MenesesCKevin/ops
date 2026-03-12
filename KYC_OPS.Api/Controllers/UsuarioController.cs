using Microsoft.AspNetCore.Mvc;
using KYC_OPS.Api.Data.DTOs.Usuario;
using KYC_OPS.Api.Services;

namespace KYC_OPS.Api.Controllers;

/// <summary>
/// API de usuarios. Endpoints para login/SSO: obtener por registro, validar y refrescar permisos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;
    private readonly ILogger<UsuarioController> _logger;

    public UsuarioController(IUsuarioService usuarioService, ILogger<UsuarioController> logger)
    {
        ArgumentNullException.ThrowIfNull(usuarioService);
        ArgumentNullException.ThrowIfNull(logger);
        _usuarioService = usuarioService;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene un usuario por número de registro (SSO). Incluye rol y permisos.
    /// </summary>
    /// <param name="registro">Número de registro del empleado.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>Usuario o 404 si no existe.</returns>
    [HttpGet("registro/{registro}")]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UsuarioResponseDto>> GetUsuarioByRegistro(
        string registro,
        CancellationToken cancellationToken)
    {
        if (!int.TryParse(registro, out var reg))
        {
            return BadRequest(new { message = "Registro inválido." });
        }

        var user = await _usuarioService.GetByRegistroAsync(reg, cancellationToken).ConfigureAwait(false);
        if (user is null)
        {
            return NotFound(new { message = $"Usuario con registro {registro} no encontrado." });
        }

        if (!user.Activo)
        {
            _logger.LogInformation("Intento de acceso de usuario inactivo: registro {Registro}", reg);
            return NotFound(new { message = "Usuario inactivo." });
        }

        return Ok(user);
    }

    /// <summary>
    /// Valida el estado del usuario (activo) y devuelve rol y permisos actualizados.
    /// </summary>
    /// <param name="registro">Número de registro.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    [HttpGet("validate/{registro}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<object>> ValidateUserStatus(
        string registro,
        CancellationToken cancellationToken)
    {
        if (!int.TryParse(registro, out var reg))
        {
            return BadRequest(new { isValid = false, message = "Registro inválido." });
        }

        var user = await _usuarioService.GetByRegistroAsync(reg, cancellationToken).ConfigureAwait(false);
        if (user is null || !user.Activo)
        {
            return Ok(new { isValid = false, message = "Usuario no encontrado o inactivo." });
        }

        return Ok(new
        {
            isValid = true,
            message = "Usuario válido",
            usuario = new { rol = user.Rol?.Nombre ?? "", permisos = user.Permisos }
        });
    }

    /// <summary>
    /// Refresca permisos del usuario (reconsulta BD). Respuesta con rol y permisos actualizados.
    /// </summary>
    /// <param name="registro">Número de registro.</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    [HttpPost("refresh-permissions/{registro}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> RefreshUserPermissions(
        string registro,
        CancellationToken cancellationToken)
    {
        if (!int.TryParse(registro, out var reg))
        {
            return NotFound(new { success = false, message = "Usuario no encontrado." });
        }

        var user = await _usuarioService.GetByRegistroAsync(reg, cancellationToken).ConfigureAwait(false);
        if (user is null)
        {
            return NotFound(new { success = false, message = "Usuario no encontrado." });
        }

        return Ok(new
        {
            message = "Permisos actualizados",
            success = true,
            usuario = new { rol = user.Rol?.Nombre ?? "", permisos = user.Permisos }
        });
    }

    /// <summary>Lista todos los usuarios.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<UsuarioListDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<UsuarioListDto>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _usuarioService.GetAllAsync(cancellationToken).ConfigureAwait(false);
        return Ok(list);
    }

    /// <summary>Obtiene un usuario por ID.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UsuarioResponseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var user = await _usuarioService.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (user is null) return NotFound(new { message = "Usuario no encontrado." });
        return Ok(user);
    }

    /// <summary>Crea un usuario.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UsuarioResponseDto>> Create([FromBody] UsuarioCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _usuarioService.CreateAsync(dto, cancellationToken).ConfigureAwait(false);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Actualiza un usuario.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UsuarioResponseDto>> Update(int id, [FromBody] UsuarioUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await _usuarioService.UpdateAsync(id, dto, cancellationToken).ConfigureAwait(false);
            if (updated is null) return NotFound(new { message = "Usuario no encontrado." });
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Activa un usuario.</summary>
    [HttpPatch("{id:int}/activate")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Activate(int id, CancellationToken cancellationToken)
    {
        var ok = await _usuarioService.ActivateAsync(id, cancellationToken).ConfigureAwait(false);
        if (!ok) return NotFound(new { message = "Usuario no encontrado." });
        return NoContent();
    }

    /// <summary>Desactiva un usuario.</summary>
    [HttpPatch("{id:int}/deactivate")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deactivate(int id, CancellationToken cancellationToken)
    {
        var ok = await _usuarioService.DeactivateAsync(id, cancellationToken).ConfigureAwait(false);
        if (!ok) return NotFound(new { message = "Usuario no encontrado." });
        return NoContent();
    }
}
