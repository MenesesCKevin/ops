using Microsoft.AspNetCore.Mvc;
using KYC_OPS.Api.Data.DTOs.Permiso;
using KYC_OPS.Api.Services;

namespace KYC_OPS.Api.Controllers;

/// <summary>API de permisos. CRUD de rutas/permisos.</summary>
[ApiController]
[Route("api/[controller]")]
public class PermisoController : ControllerBase
{
    private readonly IPermisoService _permisoService;
    private readonly ILogger<PermisoController> _logger;

    public PermisoController(IPermisoService permisoService, ILogger<PermisoController> logger)
    {
        ArgumentNullException.ThrowIfNull(permisoService);
        ArgumentNullException.ThrowIfNull(logger);
        _permisoService = permisoService;
        _logger = logger;
    }

    /// <summary>Lista todos los permisos.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PermisoListDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PermisoListDto>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _permisoService.GetAllAsync(cancellationToken).ConfigureAwait(false);
        return Ok(list);
    }

    /// <summary>Obtiene un permiso por ID.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PermisoListDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PermisoListDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var permiso = await _permisoService.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (permiso is null) return NotFound(new { message = "Permiso no encontrado." });
        return Ok(permiso);
    }

    /// <summary>Crea un permiso.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(PermisoListDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PermisoListDto>> Create([FromBody] PermisoCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var created = await _permisoService.CreateAsync(dto, cancellationToken).ConfigureAwait(false);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Actualiza un permiso.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PermisoListDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PermisoListDto>> Update(int id, [FromBody] PermisoUpdateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var updated = await _permisoService.UpdateAsync(id, dto, cancellationToken).ConfigureAwait(false);
            if (updated is null) return NotFound(new { message = "Permiso no encontrado." });
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
