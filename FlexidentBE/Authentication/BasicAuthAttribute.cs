using Flexident.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class BasicAuthAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var user = (User)context.HttpContext.Items["User"];
        if (user == null)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        await next();
    }
}