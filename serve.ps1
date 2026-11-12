$port = 8088
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Server started at $prefix"

$baseDir = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "app") {
            $urlPath = "index.html"
        } elseif ($urlPath -eq "admin" -or $urlPath -eq "dashboard") {
            $urlPath = "admin.html"
        } elseif ($urlPath -eq "login") {
            $urlPath = "login.html"
        } elseif ($urlPath -eq "bsaaevent") {
            $urlPath = "bsaaevent.html"
        }

        $localPath = Join-Path $baseDir $urlPath
        if (-not (Test-Path $localPath -PathType Leaf) -and (Test-Path (Join-Path $baseDir ($urlPath + ".html")))) {
            $localPath = Join-Path $baseDir ($urlPath + ".html")
        }

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/manifest+json; charset=utf-8" }
                ".jpeg" { "image/jpeg" }
                ".jpg"  { "image/jpeg" }
                ".png"  { "image/png" }
                ".svg"  { "image/svg+xml" }
                ".woff2" { "font/woff2" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length

            # Enterprise Anti-Theft & Security Headers
            $response.Headers.Add("X-Content-Type-Options", "nosniff")
            $response.Headers.Add("X-Frame-Options", "SAMEORIGIN")
            $response.Headers.Add("X-XSS-Protection", "1; mode=block")
            $response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin")

            # High-Performance Caching Optimization
            if ($ext -eq ".html") {
                $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.Headers.Add("Pragma", "no-cache")
            } else {
                $response.Headers.Add("Cache-Control", "public, max-age=86400")
            }

            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # Continue on client abort
    }
}
