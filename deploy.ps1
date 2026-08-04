$ErrorActionPreference = "Continue"

Write-Host "Creating Supabase project..."
$createOutput = npx supabase projects create "sam-fit" --org-id ieadkewvyaqglhgxhgui --db-password "SamFitDbPassword123!" --region ca-central-1 --output-format json
$project = $createOutput | ConvertFrom-Json
$ref = $project.id

if (-not $ref) {
    Write-Host "Failed to create project or parse JSON."
    exit 1
}

Write-Host "Project Created: $ref"
Write-Host "Waiting for project to become ACTIVE_HEALTHY..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 15
    $listStr = npx supabase projects list --output-format json
    
    # Try parsing JSON safely
    try {
        $listOutput = $listStr | ConvertFrom-Json
        $proj = $listOutput | Where-Object { $_.id -eq $ref }
        
        # Depending on CLI version, it might return array directly or wrapped in { projects: [] }
        if (-not $proj -and $listOutput.projects) {
            $proj = $listOutput.projects | Where-Object { $_.id -eq $ref }
        }
        
        Write-Host "Current status: $($proj.status)"
        if ($proj.status -eq "ACTIVE_HEALTHY") {
            $ready = $true
            break
        }
    } catch {
        Write-Host "Error parsing list JSON, retrying..."
    }
}

if (-not $ready) {
    Write-Host "Project did not become healthy in time."
    exit 1
}

Write-Host "Retrieving API keys..."
$apiKeys = npx supabase projects api-keys --project-ref $ref --output-format json | ConvertFrom-Json
$anonKey = ($apiKeys | Where-Object { $_.name -eq "anon" }).api_key
$url = "https://$ref.supabase.co"

Write-Host "Anon Key: $anonKey"
Write-Host "URL: $url"

Write-Host "Writing local .env.local..."
"NEXT_PUBLIC_SUPABASE_URL=$url`nNEXT_PUBLIC_SUPABASE_ANON_KEY=$anonKey" | Out-File -FilePath ".env.local"

Write-Host "Linking local project..."
npx supabase link --project-ref $ref --password "SamFitDbPassword123!"

Write-Host "Pushing database migrations..."
npx supabase db push --password "SamFitDbPassword123!"

Write-Host "Creating Vercel project and deploying..."
npx vercel link --yes
echo $url | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo $anonKey | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo $url | npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo $anonKey | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
echo $url | npx vercel env add NEXT_PUBLIC_SUPABASE_URL development
echo $anonKey | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

npx vercel --prod --yes
