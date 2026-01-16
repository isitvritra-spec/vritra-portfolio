---
title: "Why Hackers CAN’T TOUCH .NET APIs With These 4 Auth Methods!"
excerpt: "Authentication and authorization are essential parts of all web applications. Wrapping one’s head around the terminology and methods…"
publishedDate: "2025-05-21"
category: ".NET"
readTime: "21"
image: "https://cdn-images-1.medium.com/max/800/0*2Ulpjim4r3OCzDfO.jpg"
---

Authentication and authorization are essential parts of all web applications. Wrapping one’s head around the terminology and methods within the .NET ecosystem can be especially daunting. Traditionally, these areas have been some of the bigger pain points within .NET, and many developers find implementing proper auth mechanisms unnecessarily difficult compared to other technologies.

However, understanding just a few core principles and methods can make it a lot easier to approach. In this article, we’re going to look at four of the most common authorization approaches and guide you through understanding and choosing the method most appropriate to your needs.

## Difference between authorization and authentication

Before we explore the different methods for handling authentication and authorization, it’s important to clarify the distinction between these two concepts. Although they are often used interchangeably, authentication and authorization serve distinct purposes within the realm of access control.

**Authentication** means identifying who you are. When we authenticate or log in to a system, we are essentially making a claim to the authenticating entity that we are who we say we are. This is typically done using a username/email and password. Once the system has validated that this individual or entity is who they claim to be, authentication is complete, and access is granted.

**Authorization** refers to what you, as an authenticated entity, are allowed to do. After the system confirms your identity, it then determines whether you have the appropriate permissions to access a particular resource.

This article will primarily focus on authorization and the mechanisms that facilitate it. Authentication typically involves storing user data and validating passwords with techniques such as hashing and salting. This is a subject of its own, however, and in this article, we’re focusing mainly on the authorization aspects.

## 1. Json Web Tokens

## What is a Json Web Token?

To understand JWT usage, we need to cover a few basic principles.

JWT, an open standard (RFC 7519), is designed to securely transfer data in the form of JSON objects between two parties. This data is digitally signed with a key, allowing it to be verified and trusted by other parties that have the key. This makes it an ideal technology for facilitating authorization. Once the client has been authenticated, they will be issued a JWT. Every subsequent request to the server will contain the token, which the server will verify. Based on the information contained within the payload, the server will then allow the client access to specific routes and resources.

JWT’s are an extremely popular method for handling authorization and is a great tool to have in your arsenal.

A JWT consists of three parts, separated by a dot (.).

```typescript
xxxxx.yyyyy.zzzzz
```

These parts are called the header, the payload and the signature.

**1. Header**

The header contains information about the type of token and the signing algorithm:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**2. Payload**

The payload contains the actual data or *claims* about a certain entity that we wish to exchange between the two communicating parties. The payload will usually contain user data:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}
```

**3. Signature**

Finally, the signature is used to verify that the JWT has not been altered or manipulated. It does this by signing the encoded header, payload, and secret using the algorithm specified in the header. If data contained within the JWT is changed, it will be detected by the server’s signature verification and rejected.

## Authorization flow

The tamper-evident nature of JWTs makes them ideal for securely exchanging information between two parties. Because the tokens are signed, we can verify the senders identity and detect if the data included within the token has been altered.

A typical authorization flow using JWT looks like this:

- **Login**: The client sends a request with credentials such as username and password to the server.
- **Token generation**: The server verifies the credentials. Typically this involves checking the password against the password hash in the database. If valid, the server generates a JWT containing user information and sends it back to the client.
- **Token storage**: The client stores the JWT, typically in a cookie.
- **Subsequent requests**: For any future requests, the client sends the JWT in the HTTP Authorization header.
- **Token verification**: The server verifies the JWT’s signature and extracts the user information from the token payload to authenticate the request.

## Setting up JWT authorization in a .NET API

Setting up Json Web Token authentication can be done fairly simply. Let’s look at an example.

- **Installing the necessary packages**.

```typescript
Install-Package Microsoft.AspNetCore.Authentication.JwtBearer
Install-Package Microsoft.IdentityModel.Tokens
Install-Package Microsoft.IdentityModel.JsonWebTokens
```

**2. Configure the Json Web Token authentication services in Program.cs.**

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var key = "this is my custom Secret key for authentication"; // This should be stored securely, e.g., in environment variables
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

First, we define a secret key that will be used for the token signature.

**Note:** Ensure that the secret key is stored securely. For demonstration purposes, it’s defined in plain text here, but in a production application, it should be stored and accessed securely, such as through environment variables or a secret management service.

We then set up the authentication services and specify that we wish to use JSON Web Tokens. We set `ValidateIssuerSigningKey` to `true` to check that the token was signed with the correct key. This ensures that the token hasn't been tampered with and is coming from a trusted source. Finally, we specify the signing key using the secret key we defined earlier.

**3. Create a Controller for the Login Endpoint**

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace JsonWebTokens.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly string _key;
        public AuthController(IConfiguration config)
        {
            _key = "this is my custom Secret key for authentication";
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin userLogin)
        {
            if (userLogin.Username == "test" && userLogin.Password == "password")
            {
                var token = GenerateJwtToken(userLogin.Username);
                return Ok(new { token });
            }
            return Unauthorized();
        }
        private string GenerateJwtToken(string username)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    public class UserLogin
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
```

In this example, a simple POST endpoint accepts a `UserLogin` object in the body. We then check if the provided credentials match what is expected. In a real production application, you would typically read the user from a database and check the provided password against a hashed version stored in the database. If the credentials are valid, we generate and return a token to the client. The token payload stores the user's name, and its expiration is set to 30 minutes.

**4. Protecting Endpoints with Authorization**

We can now go ahead and add authorization to the endpoints we wish to protect:

```csharp
[Route("api/[controller]")]
[ApiController]
public class WeatherForecastController : ControllerBase
{
    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(new { message = "This is a protected endpoint" });
    }
}
```

We decorate the controllers we wish to protect with the `[Authorize]` attribute to instruct the controller to use the authentication configuration we defined earlier. If no token is provided, the user will be rejected with a 401 status code.

JSON Web Tokens are appropriate for situations where you need more granular control over your authorization mechanism. Thanks to the token payload, we can extract information about the user and restrict access to certain resources based on this information, making it an ideal and highly popular technology for authorization.

## 2. OAuth 2.0

## What is OAuth 2.0?

OAuth 2.0 is an open standard designed to allow an application secure access to services or resources hosted on third-party services, on behalf of a user. It is widely used and can be considered the de facto industry standard for online authorization. OAuth 2.0 provides several flows or “recipes” for how authorization should be handled for different scenarios. These flows are also known as grant types and dictate how authorization should be handled for various situations.

OAuth 2.0 is an authorization protocol only and does not deal with user authentication. It is designed to provide access to certain resources and employs access tokens to do so. Most commonly, a JWT will be used for this purpose. As such, JWT and OAuth 2.0 are not two distinct, mutually exclusive technologies. Rather, JWT is a format that can be integrated and used within an OAuth 2.0 flow.

## Roles

Roles within OAuth 2.0 refer to the different components of the OAuth system. These are important to understand.

- **Resource Owner**: The user or system who authorizes a client to access resources that they own.
- **Client**: The application that wants to access a certain resource on *behalf *of the resource owner.
- **Authorization Server**: The server that authenticates the resource owner and issues access tokens to the client.
- **Resource Server**: The server hosting the protected resources (often APIs) that the client wants to access.

## Authorization using the client credentials grant

As described above, OAuth 2.0 offers different grant types or flows for handling various authorization situations. One such grant type is the Client Credentials Grant, which we will focus on in this article. This flow is used for machine-to-machine (M2M) communication, where no user is involved. It is an extremely common approach that you will likely encounter in one way or another. In the client credentials grant scenario, the client acts on its own behalf, meaning the client itself needs access to a certain resource. For example, this could be a backend application (client) that needs to access an external API (resource server) to fetch data for internal processing.

The client credentials grant is very common and perhaps the simplest of the grant types. A typical flow looks like this:

- **Client authentication: **The backend application (client) has its client ID and client secret, which it uses to authenticate with the authorization server.
- **Access token request: **The backend application sends a POST request to the token endpoint of the authorization server with its client ID, client secret, and the grant type.
- **Access token response: **The authorization server validates the client’s credentials and responds with an access token.
- **Resource request**: The backend application uses the access token to request data from the external API (resource server).
- **Resource response**: The resource server validates the access token and responds with the requested data.

## Example

In this small .NET example, we will create a single application acting as both the authorization server and the resource server. Often, these two entities are separated, but for smaller and more integrated applications, a combined approach can be effective and will reduce complexity and latency. Consider the trade-offs between the combined and separated approaches for your particular situation.

- **Like before, we start by installing the necessary packages.**

```typescript
Install-Package Microsoft.AspNetCore.Authentication.JwtBearer
Install-Package Microsoft.IdentityModel.Tokens
Install-Package Microsoft.IdentityModel.JsonWebTokens
```

**2. Once again we create the necessary JWT configurations in Program.cs**

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var key = "this is my custom Secret key for authentication"; // This should be stored securely, e.g., in environment variables
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost:7232",
            ValidAudience = "https://localhost:7232",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

In this scenario, we enable the `ValidateIssuer` and `ValidateAudience` options. This adds an extra layer of security to our tokens by ensuring that our application encodes both the issuing and receiving entities into the token. By validating the issuer and audience, we make it harder for a potential attacker to misuse a stolen token. This is particularly important in scenarios where you know the specific application that will be authorized to interact with your application beforehand.

**3. We create the token endpoint.**

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace OAuth2._0.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private const string ClientId = "1";
        private const string ClientSecret = "secret";
        private const string Issuer = "https://localhost:7232";
        private const string Audience = "https://localhost:7232";
        private const string Key = "this is my custom Secret key for authentication";
        [HttpPost("token")]
        public IActionResult Token([FromForm] string client_id, [FromForm] string client_secret)
        {
            if (client_id == ClientId && client_secret == ClientSecret)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(Key);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] { new Claim("sub", client_id) }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    Issuer = Issuer,
                    Audience = Audience,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
                return Ok(new
                {
                    access_token = tokenString,
                    token_type = "Bearer",
                    expires_in = 3600, // 1 hour in seconds
                });
            }
            return BadRequest("Invalid client credentials");
        }
    }
```

In a production application, there will usually be an underlying system storing the Client ID and Client Secret. These two values are then issued to trusted systems (Clients) that wish to gain access to resources. In this small example, we simply hardcode these two values, but understand that this should be handled more elegantly in a production application.

We accept `client_id` and `client_secret` in a `multipart/form-data` request and check if these values match what is expected. If all is good, we proceed to create a token and add the necessary claims. Note that we add Issuer and Audience in this situation.

A response is returned to the client in this format:

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmJmIjoxNzIzMDE4MDM5LCJleHAiOjE3MjMwMjE2MzksImlhdCI6MTcyMzAxODAzOSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzIzMiIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcyMzIifQ.0HpnhsU-Ud2zO8owCHeK5xcSIDJzU4OTLmi0LsifMx0",
    "token_type": "Bearer",
    "expires_in": 3600
}
```

Here we can see that the authorization server has issued us (the client) a Bearer token that expires in one hour.

**4. We can now use the token access protected resources.**

```csharp
[Route("api/[controller]")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {
            return Ok("Protected resource data");
        }
    }
```

## Usage

OAuth 2.0 is an industry-standard framework for handling authorization across various scenarios. In the simple example above, we’ve demonstrated how to handle authorization in a typical machine-to-machine scenario, but this is just one of many use cases. OAuth 2.0 can be used in multiple environments, including web applications, mobile apps, and IoT devices, providing a unified approach to authorization regardless of platform. It is well-documented and widely adopted, making it much easier for developers to implement. Additionally, there are many tools and libraries available for different programming languages that simplify the OAuth 2.0 integration process.

## 3. Basic authentication

## What is basic auth?

In the first two chapters, we’ve looked at some more complex and scalable authorization mechanisms. For smaller applications that don’t have the same scalability and flexibility requirements, basic authentication offers a much simpler and straightforward, albeit less secure and scalable, method for enforcing access control to web resources.

Basic authentication is built into the HTTP specification and lets a client authenticate itself with a server by sending a username and password encoded in a specific format.

## How Basic Authentication Works

A typical flow using Basic Authentication looks like this.

- **Client Response**: The client then sends a request with an Authorization header containing the credentials (username and password) encoded as base64.
- **Server Validation**: The server decodes the base64 string to retrieve the username and password and then validates these credentials.
- **Access Granted/Denied**: If the credentials are valid, the server grants access to the requested resource. If not, the server responds with 401 unauthorized.

The idea is that the username and password are sent this way for every request to the resource server. The server will then decode and validate these credentials to determine if the client should be allowed access.

This is an extremely simple solution but should be used with caution, as it presents some serious security risks. Base64 is just simple encoding and can be easily reversed, which means we’re essentially sending credentials in plain text.

If you do decide to go with this approach, always ensure that you use HTTPS to encrypt the credentials over the network.

## Example

1. We start by creating an authentication handler

```csharp
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;

public class BasicAuthenticationHandler : AuthenticationHandler
{
    public BasicAuthenticationHandler(
        IOptionsMonitor options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }
    protected override async Task HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return AuthenticateResult.Fail("Missing Authorization Header");
        }
        try
        {
            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':');
            var username = credentials[0];
            var password = credentials[1];
            // Validate the username and password (this is just an example, you should validate against a user store)
            if (username == "admin" && password == "password")
            {
                var claims = new[] {
                    new Claim(ClaimTypes.Name, username)
                };
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);
                return AuthenticateResult.Success(ticket);
            }
            else
            {
                return AuthenticateResult.Fail("Invalid Username or Password");
            }
        }
        catch
        {
            return AuthenticateResult.Fail("Invalid Authorization Header");
        }
    }
}
```

This is fairly straightfoward. This handler will attempt to extract the Authorization header. If no authorization header is set, we deny access. We then attempt to grab the base64 string from the header, and extract the username and password. Once again we simply validate the credentials against hardcoded values for illustration purposes. Normally you would check against some user store.

If all is good we create a simple claim and authenticate succesfully.

2. Register the handler in Program.cs

```csharp
using BasicAuth.Handlers;
using Microsoft.AspNetCore.Authentication;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddAuthentication("BasicAuthentication")
    .AddScheme("BasicAuthentication", null);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

Here we configure our application to use the Basic Authentication scheme, and specify our handler.

3. We can now secure our endpoints

```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok("Protected resource data");
    }
}
```

## Usage

As described above, basic authentication offers an extremely simple method for authenticating requests to your application. However, this approach should never be used to facilitate actual access control in a production environment due to its obvious drawbacks.

In the past, I have used basic authentication to provide access to test environments in simple scenarios where security and scalability are not a priority. Basic auth is quick and simple but should be used with caution and only in appropriate situations. Consider if other approaches are more suitable for your particular situation.

## 4. API Key authorization

## What is API Key authorization?

API Key authorization is a straightforward and widely used method for controlling access to APIs. This method is ideal for scenarios where you need to issue access to one or more endpoints but do not require granular control over the user’s actual identity. This approach is often employed when you need to access a restricted API, typically after signing up for it. Upon signing up, an API key is usually issued to the client, which can then be stored and used to access specific resources. The issuing entity retains the ability to revoke and invalidate the API key as needed.

In essence, an API key is a unique identifier assigned to a client. The client includes this key in their API requests to gain access to the service. The API key is usually sent to the server in the `x-api-key` header, where it is extracted and validated using custom logic.

The beauty of API keys lies in the flexibility they offer developers in implementing authorization logic. Typically, client information is stored in a database along with their respective API key and any other relevant information. For instance, you might store the client’s IP address and validate that the request comes from the expected client. Alternatively, you might invalidate the API key after a certain period.

The point is that all the business logic surrounding the authorization can be freely configured by the developer and can be as complex or simple as needed. This makes API key authorization a good choice for many applications where simplicity and flexibility are desired over more complex authorization methods.

## How API key authorization works

A typical API key authorization flow looks like this:

- **API key generation**: The server generates a unique key for each client. This key is usually a long string of alphanumeric characters.
- **Client usage**: The client includes this key in the request header.
- **Server verification**: The server receives the request and checks the key against a stored list of valid keys.
- **Authorization**: If the key is valid, the server processes the request. Otherwise, access is denied.

As mentioned above the server verification step can be implemented as the developer chooses.

## Example

The API key sent by the client will usually be extracted in a piece of middleware, that will intercept the API call and execute the authorization logic.

- We start by creating the authorization middleware.

```csharp
public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private const string API_KEY_HEADER_NAME = "X-Api-Key";

public ApiKeyMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue(API_KEY_HEADER_NAME, out var extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("API Key is missing.");
            return;
        }
        var apiKey = "SuperSecret"; // Will normally come from a store/configuration/database
        if (!apiKey.Equals(extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized client.");
            return;
        }
        await _next(context);
    }
}
```

Here we start by injecting the RequestDelegate that we use to either send the request onwards in the HTTP request pipeline if all goes well or terminate the request if the authorization fails.

We then attempt to extract the API key from the appropriate header and check it against the expected API key. Once again, the API keys should normally be handled in some form of storage, but for this simple illustration we simply hardcode it.

If the key does not match we return 401. If all is well, we call _next to send the request to the next middleware in the request pipeline.

2. Register the middleware in Program.cs

```csharp
using APIKey.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseMiddleware();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseRouting();
app.MapControllers();
app.Run();
```

That is all. For every request the API receives, the middleware will extract the API key and ensure it’s valid before allowing the request to continue down the request pipeline.

## Usage

As discussed above, API key authorization is a good approach in situations where we need to issue a key to a certain client without requiring very granular identity management. This is suitable for machine-to-machine communication and can be extended to accommodate specific use cases. In the above example, we looked at the simplest possible solution, but the authorization mechanism can be configured to your needs. Unlike basic auth, we do not need to store credentials in the actual token, making it a more secure approach to handle authorization.

## Summary

In this article, we’ve looked at four popular approaches to handle authorization in a .NET API, each with its own pros and cons. We discussed JWT (JSON Web Tokens), OAuth, Basic Authentication, and API Key Authorization. Understanding these methods is vital and can help you select the right one for your specific application needs.

Authorization can be challenging to grasp, but hopefully, this article provides a simple and straightforward starting point for you to build upon.
