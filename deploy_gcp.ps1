$ErrorActionPreference = "Stop"

$PROJECT_ID = "decisiontwin-499410"
$REGION = "us-central1"
$API_IMAGE = "$REGION-docker.pkg.dev/$PROJECT_ID/decisiontwin-repo/decisiontwin-api"
$UI_IMAGE = "$REGION-docker.pkg.dev/$PROJECT_ID/decisiontwin-repo/decisiontwin-ui"

Write-Host "Configuring Google Cloud CLI..."
gcloud config set project $PROJECT_ID

Write-Host "Enabling required Google Cloud APIs (this is a one-time setup and may take 1-2 minutes)..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

Write-Host "Fetching project metadata..."
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
$ACTIVE_ACCOUNT = gcloud config get-value account

Write-Host "Configuring IAM permissions to prevent 403 / Permission Denied errors..."
# 1. Grant Compute Engine Default Service Account access to Cloud Storage (so Cloud Build can read sources)
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/storage.objectViewer" `
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/logging.logWriter" `
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/artifactregistry.writer" `
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
    --role="roles/aiplatform.user" `
    --quiet


# 2. Ensure active user has Cloud Build Editor permissions
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="user:$ACTIVE_ACCOUNT" `
    --role="roles/cloudbuild.builds.editor" `
    --quiet

# 3. Ensure Cloud Build service account has Artifact Registry Writer permissions
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" `
    --role="roles/artifactregistry.writer" `
    --quiet

# 4. Check and create Artifact Registry repository if it doesn't exist
Write-Host "Checking Artifact Registry repository..."
$REPO_EXISTS = gcloud artifacts repositories list --location=$REGION --filter="name:projects/$PROJECT_ID/locations/$REGION/repositories/decisiontwin-repo" --format="value(name)"
if (-not $REPO_EXISTS) {
    Write-Host "Creating Artifact Registry repository 'decisiontwin-repo'..."
    gcloud artifacts repositories create decisiontwin-repo --repository-format=docker --location=$REGION --description="Docker repository for Decision Twin" --quiet
}

Write-Host "IAM Configuration completed. Waiting 5 seconds for policy propagation..."
Start-Sleep -Seconds 5

Write-Host "Building and deploying Backend API..."
Push-Location .\decisiontwin-api
gcloud builds submit --tag $API_IMAGE
$API_URL = gcloud run deploy decisiontwin-api `
    --image $API_IMAGE `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --set-env-vars="AI_ENABLED=true,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION" `
    --format="value(status.url)"
Pop-Location

Write-Host "Backend API deployed at: $API_URL"

Write-Host "Building and deploying Frontend UI..."
Push-Location .\decisiontwin-ui

# 1. Re-create the .env file with VITE_FASTAPI_URL for the Vite build
Write-Host "Writing environment variables to .env for build time..."
$envFileContent = "VITE_FASTAPI_URL=$API_URL`n"
$envFileContent | Out-File -FilePath .\.env -Encoding utf8 -Force

# 2. Build and push frontend image
gcloud builds submit --tag $UI_IMAGE

# 3. Deploy to Cloud Run
Write-Host "Injecting Vertex AI environment variables into Cloud Run runtime environment..."
$ENV_VARS = "VITE_FASTAPI_URL=$API_URL,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION"

$UI_URL = gcloud run deploy decisiontwin-ui `
    --image $UI_IMAGE `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --set-env-vars=$ENV_VARS `
    --format="value(status.url)"
Pop-Location

Write-Host "Frontend UI deployed at: $UI_URL"
Write-Host "Deployment Complete!"
