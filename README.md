# Azure AKS Web Application with CI/CD Pipeline

This project provides a complete end-to-end solution for deploying a containerized web application to Azure Kubernetes Service (AKS) with automated CI/CD from GitHub to Azure.

## 🏗️ Architecture Overview

```
GitHub Repository
    ↓ (Push/PR)
GitHub Actions CI/CD
    ↓ (Build & Push)
Azure Container Registry (ACR)
    ↓ (Pull Images)
Azure Kubernetes Service (AKS)
    ↓ (Expose)
Load Balancer / Ingress
```

## 📦 What's Included

### Infrastructure (Terraform)
- **Azure Resource Group**: Container for all resources
- **Azure Kubernetes Service (AKS)**: Managed Kubernetes cluster
- **Azure Container Registry (ACR)**: Private container image registry
- **Service Principal**: Authentication for GitHub Actions
- **RBAC Permissions**: Proper role assignments for ACR and AKS integration

### Application
- **Node.js Web Application**: Production-ready Express.js app with health checks
- **Docker Container**: Optimized multi-stage build with security best practices
- **Kubernetes Manifests**: Deployment, Service, and Ingress configurations

### CI/CD Pipeline
- **GitHub Actions Workflow**: Automated build, test, and deployment
- **Container Image Management**: Automatic tagging and registry push
- **Blue-Green Deployments**: Zero-downtime deployment strategy

## 🚀 Quick Start

### Prerequisites

1. **Azure CLI** installed and authenticated
2. **Terraform** (v1.5+) installed
3. **kubectl** installed
4. **GitHub repository** with Actions enabled
5. **Azure subscription** with appropriate permissions

### 1. Deploy Infrastructure

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

-----------------------------------------------------------------------------
# Run the following commands to deploy the infrastructure using Terraform:
To use the automated script ./scripts/deploy.sh to deploy infrastructure, you generally need to prepare your local environment, grant execute permissions to the script, configure authentication, and then run it from your terminal. 

# Prerequisites:
Permissions: You must have the necessary permissions in your cloud provider (Azure, in your case) to create and manage resources.
Authentication: Your local environment needs to be authenticated with Azure (e.g., via Azure CLI using az login) and potentially other tools the script uses (like Terraform, kubectl).
Dependencies: The required tools, such as terraform, az CLI, kubectl, etc., must be installed on your local machine and accessible in your system's PATH.
Configuration: The script likely uses environment variables or configuration files to determine which infrastructure to deploy. Ensure these are set correctly. 

# Step-by-Step Execution
1. Open your terminal or command prompt.
2. Navigate to the root directory of your repository (or wherever the scripts folder is located).
3. Grant Execute Permissions (if needed):
If the script does not already have execute permissions, you'll need to grant them using the chmod command:
bash
chmod +x ./scripts/deploy.sh
Use code with caution.

4. Run the script:
Execute the script directly from the command line:
bash
./scripts/deploy.sh
Use code with caution.

If the script accepts arguments (e.g., for different environments like dev, staging, prod), you would include them:
bash
./scripts/deploy.sh [environment-name]
Use code with caution.

5. Monitor the Output:
The script will output its progress to the console. It will likely:
Initialize Terraform ( terraform init).
Generate an execution plan ( terraform plan).
Prompt for confirmation or automatically apply the changes ( terraform apply) to provision the infrastructure.
6. Follow Prompts:
If the script is interactive, follow any on-screen instructions, such as typing yes to confirm the Terraform apply operation. 
# Troubleshooting
"Permission denied" error: Run chmod +x ./scripts/deploy.sh (Step 3).
Missing commands (e.g., terraform: command not found): Ensure all required dependencies are installed and their paths are correctly added to your system's PATH environment variable.
Authentication failures: Re-authenticate with your cloud provider using the Azure CLI or check that your credentials/environment variables are correctly configured. 
This local execution runs the script from your machine. For automated, repeatable deployments within a team setting, you should integrate this process into a GitHub Actions workflow, as described in the previous answer, so it runs automatically when code is pushed to your repository.-----------------------------------------------------------------------------
or manually run the following commands:

# Initialize Terraform
terraform init

# Review the deployment plan
terraform plan

# Deploy the infrastructure
terraform apply
```

### 2. Configure GitHub Secrets

After Terraform deployment, configure these GitHub repository secrets:

```bash
# Get the required values from Terraform outputs
terraform output -json
```

Add these secrets to your GitHub repository:

| Secret Name | Description | Source |
|------------|-------------|--------|
| `AZURE_CREDENTIALS` | Service Principal credentials | Combine client_id, client_secret, tenant_id, subscription_id |
| `ACR_LOGIN_SERVER` | Container registry URL | `acr_login_server` output |
| `ACR_USERNAME` | Registry admin username | `acr_admin_username` output |
| `ACR_PASSWORD` | Registry admin password | `acr_admin_password` output |
| `RESOURCE_GROUP` | Resource group name | `resource_group_name` output |
| `CLUSTER_NAME` | AKS cluster name | `aks_cluster_name` output |

**AZURE_CREDENTIALS format:**
```json
{
  "clientId": "<client_id_from_output>",
  "clientSecret": "<client_secret_from_output>",
  "subscriptionId": "<subscription_id_from_output>",
  "tenantId": "<tenant_id_from_output>"
}
```

### 3. Deploy Application

Push your code to the `main` branch to trigger the CI/CD pipeline:

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### 4. Access Your Application

```bash
# Get the application URL
kubectl get ingress webapp-demo-ingress -n webapp-demo

# Or use port forwarding for immediate access
kubectl port-forward svc/webapp-demo-service 8080:80 -n webapp-demo

# if you can not access via ingress, you need to use:


A LoadBalancer service

Right now, you have no way to access the app externally.

✅ Option 1 — Convert your Service to LoadBalancer (fastest way)

Create/update your service YAML to:

apiVersion: v1
kind: Service
metadata:
  name: webapp-demo-service
  namespace: webapp-demo
spec:
  type: LoadBalancer            # ← CHANGE THIS From ClusterIP to LoadBalancer
  selector:
    app: webapp-demo
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000


Save  and push the changes to github to trigger the pipeline, or apply it directly:
kubectl apply -f k8s/deployment.yaml

Then wait for few minutes to get the external IP, after that run:
kubectl get svc -n webapp-demo


You should eventually get:

EXTERNAL-IP: 20.55.x.x
Then access your app at: http://<EXTERNAL-IP>


```

## 🛠️ Configuration

### Terraform Variables

Customize your deployment by creating a `terraform.tfvars` file:

```hcl
# Basic Configuration
resource_group_name = "rg-my-webapp"
location           = "West US 2"
environment        = "production"
project_name       = "My WebApp"

# AKS Configuration
aks_cluster_name   = "aks-my-webapp"
kubernetes_version = "1.28"
node_count        = 3
node_vm_size      = "Standard_D2s_v3"

# ACR Configuration
acr_name = "acrmywebapp"
acr_sku  = "Standard"

# Application Configuration
app_name      = "my-webapp"
app_namespace = "production"
```

### Application Configuration

The Node.js application supports these environment variables:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port (default: 3000)
- Custom environment variables can be added to the Kubernetes deployment

## 🚀 Application Features

The included sample application demonstrates:

- ✅ **Health Checks**: `/health` endpoint for Kubernetes probes
- ✅ **Structured Logging**: Request logging with Morgan
- ✅ **Security Headers**: Helmet.js for security best practices
- ✅ **CORS Support**: Cross-origin resource sharing
- ✅ **API Endpoints**: RESTful API examples
- ✅ **Error Handling**: Proper error responses and logging
- ✅ **Production Ready**: Optimized for containerized deployment

### API Endpoints

- `GET /` - Application dashboard
- `GET /health` - Health check endpoint
- `GET /api/info` - Application information
- `GET /api/users` - Sample API endpoint

## 🔧 Development

### Local Development

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Building Locally

```bash
# Build Docker image
docker build -t webapp-demo ./app

# Run container
docker run -p 3000:3000 webapp-demo
```

### Kubernetes Development

```bash
# Get AKS credentials
az aks get-credentials --resource-group rg-aks-webapp --name aks-webapp-cluster

# Apply manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n webapp-demo
kubectl logs -f deployment/webapp-demo -n webapp-demo
```

## 🔒 Security Best Practices

### Infrastructure Security
- **Service Principal**: Least-privilege access for GitHub Actions
- **RBAC**: Proper role assignments for AKS and ACR
- **Network Security**: Kubernetes network policies ready
- **Secret Management**: Sensitive outputs marked as sensitive

### Application Security
- **Non-root User**: Container runs as non-privileged user
- **Security Headers**: Helmet.js security middleware
- **Health Checks**: Kubernetes liveness and readiness probes
- **Resource Limits**: CPU and memory constraints defined

### Container Security
- **Alpine Base**: Minimal attack surface with Alpine Linux
- **Multi-stage Build**: Reduced image size and attack surface
- **Security Scanning**: Ready for vulnerability scanning integration

## 📊 Monitoring and Logging

### Application Monitoring
- Health check endpoint at `/health`
- Structured request logging
- Kubernetes readiness and liveness probes

### Infrastructure Monitoring
- AKS cluster metrics via Azure Monitor
- Container insights for pod-level monitoring
- ACR vulnerability scanning (with Premium SKU)

## 🚨 Troubleshooting

### Common Issues

**1. GitHub Actions Authentication Failed**
```bash
# Verify service principal credentials
az ad sp show --id <client_id>

# Check role assignments
az role assignment list --assignee <client_id>
```

**2. Container Image Pull Errors**
```bash
# Check ACR permissions
az acr check-health --name <acr_name>

# Verify AKS can pull from ACR
kubectl describe pod <pod_name> -n webapp-demo
```

**3. Application Not Accessible**
```bash
# Check service and ingress status
kubectl get svc,ingress -n webapp-demo

# Check pod logs
kubectl logs -f deployment/webapp-demo -n webapp-demo
```

### Debugging Commands

```bash
# Check cluster status
kubectl cluster-info

# Get all resources in namespace
kubectl get all -n webapp-demo

# Describe failing resources
kubectl describe deployment webapp-demo -n webapp-demo

# View recent events
kubectl get events -n webapp-demo --sort-by='.lastTimestamp'
```

## 🧹 Cleanup

To remove all resources:

```bash
# Delete Kubernetes resources
kubectl delete namespace webapp-demo

# Destroy Terraform infrastructure
terraform destroy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Additional Resources

- [Azure Kubernetes Service Documentation](https://docs.microsoft.com/en-us/azure/aks/)
- [Azure Container Registry Documentation](https://docs.microsoft.com/en-us/azure/container-registry/)
- [Terraform Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.