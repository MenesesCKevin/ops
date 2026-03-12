using Microsoft.AspNetCore.Mvc;

namespace KYC_OPS.Api.Controllers;

/// <summary>
/// Endpoint de salud de la API.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>Indica que la API está en ejecución.</summary>
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "healthy", application = "KYC_OPS.Api" });
}
