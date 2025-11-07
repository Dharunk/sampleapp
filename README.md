# sampleapp

1. CI/CD Pipeline with Jenkins + Docker

    <!-- To build docker image -->
    docker build -t sampleapp:v5 .   

    <!-- To install jenkins in docker -->
    docker exec -it jenkins1 bash -c "whoami; id; ls -l /var/run/docker.sock; /usr/bin/docker -H unix:///var/run/docker.sock --version; /usr/bin/docker -H unix:///var/run/docker.sock ps"

    <!-- jenkins bash -->
    docker exec -it --user root jenkins1 bash

2. Kubernetes Deployment with kind cluster

    <!-- Create kind cluster -->
    kind create cluster --config kind-config.yaml

    <!-- add host mapping (mac/linux)-->
    sudo sh -c "echo '127.0.0.1 sampleapp.local' >> /etc/hosts"

    <!-- To load image from local machine to k8s cluster -->
    kind load docker-image sampleapp:v5 --name kind

    <!-- To deploy in k8s -->
    kubectl apply -f deployment.yaml   
    kubectl apply -f service.yaml
    kubectl apply -f ingress.yaml

3. GitOps-Style Local Workflow with Argo

    <!-- Create argocd -->
    kubectl create namespace argocd\
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml\
    kubectl -n argocd get pods

    <!-- forwarding the port -->
    kubectl -n argocd port-forward svc/argocd-server 8080:443

4. End-to-End CI/CD: GitHub Actions + Docker + K8s

    workflow file is in .github/workflows/ci-cd.yaml