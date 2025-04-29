#!/bin/bash

# Configuration
REGISTRY="ghcr.io/shanelkapramuditha/Eatzilla-food-ordering-and-delivery-system"
TAG="latest"
NAMESPACE="eatzilla"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building and deploying Eatzilla microservices to Kubernetes${NC}"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl is not installed. Please install kubectl first.${NC}"
    exit 1
fi

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Build and push Docker images for each service
build_and_push() {
    service=$1
    directory=$2
    dockerfile=$3

    echo -e "${YELLOW}Building ${service} image...${NC}"
    docker build -t ${REGISTRY}/eatzilla-${service}:${TAG} -f ${directory}/${dockerfile} ${directory}/..
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Successfully built ${service} image${NC}"
        
        echo -e "${YELLOW}Pushing ${service} image to registry...${NC}"
        docker push ${REGISTRY}/eatzilla-${service}:${TAG}
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Successfully pushed ${service} image${NC}"
        else
            echo -e "${RED}Failed to push ${service} image${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Failed to build ${service} image${NC}"
        exit 1
    fi
}

# Create namespace
echo -e "${YELLOW}Creating Kubernetes namespace...${NC}"
kubectl apply -f kubernetes/namespace.yaml

# Apply ConfigMaps
echo -e "${YELLOW}Applying ConfigMaps...${NC}"
kubectl apply -f kubernetes/configmaps/

# Build and push all services
cd server

build_and_push "api-gateway" "apps/api-gateway" "Dockerfile.prod"
build_and_push "order-service" "apps/order" "Dockerfile.prod"
build_and_push "payment-service" "apps/payment" "Dockerfile.prod"
build_and_push "restaurant-service" "apps/restaurant" "Dockerfile.prod"
build_and_push "delivery-service" "apps/delivery" "Dockerfile.prod"
build_and_push "alert-service" "apps/alert" "Dockerfile.prod"

cd ..

# Deploy application services
echo -e "${YELLOW}Deploying application services...${NC}"
kubectl apply -f kubernetes/deployments/api-gateway.yaml
kubectl apply -f kubernetes/deployments/order-service.yaml
kubectl apply -f kubernetes/deployments/payment-service.yaml
kubectl apply -f kubernetes/deployments/restaurant-service.yaml
kubectl apply -f kubernetes/deployments/delivery-service.yaml
kubectl apply -f kubernetes/deployments/alert-service.yaml

# Wait for application services to be ready
echo -e "${YELLOW}Waiting for application services to be ready...${NC}"
kubectl rollout status deployment/api-gateway -n ${NAMESPACE}
kubectl rollout status deployment/order-service -n ${NAMESPACE}
kubectl rollout status deployment/payment-service -n ${NAMESPACE}
kubectl rollout status deployment/restaurant-service -n ${NAMESPACE}
kubectl rollout status deployment/delivery-service -n ${NAMESPACE}
kubectl rollout status deployment/alert-service -n ${NAMESPACE}

echo -e "${GREEN}All services have been successfully deployed to Kubernetes!${NC}"
echo -e "${YELLOW}You can access the API Gateway at the following URL:${NC}"
kubectl get service api-gateway -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
echo