using Microsoft.AspNetCore.Mvc;
using KYC_OPS.Api.Data.DTOs.Rol;
using KYC_OPS.Api.Services;

namespace KYC_OPS.Api.Controllers;

/// <summary>API de roles. CRUD y asignación de permisos.</summary>
[ApiController]
[Route("api/[controller]")]
public class RolController : ControllerBase
{
    private readonly IRolService _rolService;
    private readonly ILogger<RolController> _logger;

    public RolController(IRolService rolService, ILogger<RolController> logger)
    {
        ArgumentNullException.ThrowIfNull(rolService);
        ArgumentNullException.ThrowIfNull(logger);
        _rolService = rolService;
        _logger = logger;
    }

    /// <summary>Lista todos los roles.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<RolListDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<RolListDto>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _rolService.GetAllAsync(cancellationToken).ConfigureAwait(false);
        return Ok(list);
    }

    /// <summary>Obtiene un rol por ID con sus permisos.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(RolResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RolResponseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var rol = await _rolService.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (rol is null) return NotFound(new { message = "Rol no encontrado." });
        return Ok(rol);
    }

    /// <summary>Crea un rol.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(RolResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RolResponseDto>> Create([FromBody] RolCreateDto dto, CancellationToken cancellationToken)
    {
        var created = await _rolService.CreateAsync(dto, cancellationToken).ConfigureAwait(false);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Actualiza un rol y sus permisos.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(RolResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RolResponseDto>> Update(int id, [FromBody] RolUpdateDto dto, CancellationToken cancellationToken)
    {
        var updated = await _rolService.UpdateAsync(id, dto, cancellationToken).ConfigureAwait(false);
        if (updated is null) return NotFound(new { message = "Rol no encontrado." });
        return Ok(updated);
    }

    /// <summary>Asigna permisos a un rol (reemplaza los actuales).</summary>
    [HttpPut("{id:int}/permisos")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SetPermisos(int id, [FromBody] List<int> permisoIds, CancellationToken cancellationToken)
    {
        var ok = await _rolService.SetPermisosAsync(id, permisoIds ?? new List<int>(), cancellationToken).ConfigureAwait(false);
        if (!ok) return NotFound(new { message = "Rol no encontrado." });
        return NoContent();
    }
}
