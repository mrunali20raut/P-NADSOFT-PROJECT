to run the project locally
clone the repo-> git clone https://github.com/pranav511/nadsoft-full-stack.git
docker --version
docker compose version
go inside where the docker-compose file exist
Start Application -> docker compose up --build
it must contain .env file
Why .env is Important
Backend uses it for:
DB connection
Port
JWT secret
API configs

Without it backend cannot start.

Check If Developer Provided .env.example
dir nadsoft-backend
If No Env File Exists
in VS code
Ctrl + Shift + F   -> search -> process.env
or-> findstr /S /I "process.env" nadsoft-backend\*.js

Create Backend .env File

Go inside:

F:\Mr\P-nadsoft-project\nadsoft-full-stack\nadsoft-backend

Create a new file named:

.env

add below content in .env
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin
DB_NAME=nadsoft

Why These Values?

Because your docker-compose.yml already contains:
mysql:
  image: mysql:8

  environment:
    MYSQL_ROOT_PASSWORD: admin
    MYSQL_DATABASE: nadsoft

run this cammand -> docker compose up --build 
it will pull the images

Expected Result
You should see:

mysql      Started
backend    Started
frontend   Started

Then Verify

Open browser:

Frontend
http://localhost:3000
Backend
http://localhost:5000/students


If Any Container Fails

Run:
docker compose logs backend
OR
docker compose logs mysql

==================================

deploy this project on AWS env in Kubernetes:
==============================================

1. create ec2 instance ->ubuntu AMI -> 4gb storage (instance type: c7i-flex.large)
2.  install java
sudo apt update
sudo apt install fontconfig openjdk-21-jre
java - -version
3. install Jenkins
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins
start jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins

5. add port 8080 TCp in security grp (edit inbound rule)
6. paste public ip in browser : 8080
7. for admin pass – sudo cat /var/lib/jenkins/secrets/initialAdminPassword 
67cadeed3bcb4f77bc8e2a0cf8dc4ef1
8. set user pass for Jenkins: Admin   Admin@123   email-mrunali20raut 
Admin   @123
Jenkin url : http://13.234.20.68:8080/ 
9. as I am doing for java application we have to install maven (we can do it in two ways by directly installing in machine or as a global tool in jenkins machine) I am doing it by using as a global tool in Jenkins (manage Jenkins->tools->add maven)
Note : version Maven-3.9.14,  Jenkins-2.541.13
10.  setup docker using Jenkins
curl -fsSL get.docker.com | /bin/bash
11.add user to docker group
sudo usermod -aG docker jenkins
12: restart Jenkins
sudo systemctl restart Jenkins
13.  Create EKS Management Host in AWS
1.	Launch new Ubuntu VM using AWS Ec2 ( t2.micro )
2.	Connect to machine and install kubectl using below commands
This machine is used to launch EKS cluster in AWS
Kubectl is a cli which is use to communicate with kubernetes cluster
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --short –client
14. Install AWS CLI latest version using below commands
sudo apt install unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws –version
15. Install eksctl using below commands
Ekctl is a command line utilty to create the k8 cluster from the cli
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version
16. Create IAM role & attach to EKS Management Host
AdministratorAccess

AmazonEC2FullAccess

AmazonVPCFullAccess

AWSCloudFormationFullAccess

IAMFullAccess

1.	Create New Role using IAM service ( Select Usecase - ec2 )
2.	Add above permissions for the role
o	Administrator - acces
3.	Enter Role Name (eksroleec2)
4.	Attach created role to EKS Management Host (Select EC2 => Actions=>Click on Security => Modify IAM Role => attach IAM role we have created)
5.	Attach created role to Jenkins Machine (Select EC2 => Click on Security => Modify IAM Role => attach IAM role we have created)
17. Create EKS Cluster using eksctl
=> eksctl create cluster --name mr-cluster --region ap-south-1 --node-type c7i-flex.large --zones ap-south-1a,ap-south-1b

=> node-type is nothing but the instance type
it is going to communicate with EKS service and it is going to create cluster
it will create the cloud formation stack, EKS cluster, worker nodes and attached the worker node tour control plane which is provided by AWS EKS

	Kubectl get nodes
	kubectl get all
18. Install AWS CLI in JENKINS Server
sudo apt install unzip 
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
if unzip not found u can install it with sudo apt install unzip 
sudo ./aws/install
aws –version
19. Install Kubectl in JENKINS Server
So that jenkins will connect with the k8 cluster by using kubectl for deployment process
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --short --client
20. Update EKS Cluster Config File in Jenkins Server
Integrating Jenkins and k8 cluster for that we need to take the k8 cluster config file and we need to configure into jenkins machine, why because my Jenkins machine should communicate wirh the k8 cluster to do the deployment, 
how the Jenkins machine will know whre is the k8 cluster-> cluster configuration we need to update in the Jenkins machine , cluster configuration will be available in kube config file if you keep this file in Jenkins machine then Jenkins will know whr is the k8 cluster then Jenkins machine will deploy in K8 directly
kubeconfig file contains k8cluster info
1.	 Execute below command in Eks Management host & copy kube config file data
 cat .kube/config
2.	Execute below commands in Jenkins Server and paste kube config file
 cd /var/lib/jenkins
 sudo mkdir .kube
 sudo vi .kube/config
3.	Go in insert mode by i key
4.	Paste the data of  .kube/config file save and exit by esc :wq enter 
5.	Execute below commands in Jenkins Server and paste kube config file for ubuntu user to check EKS Cluster info
aws eks update-kubeconfig --region ap-south-1 --name <your-eks-cluster-name>
aws eks update-kubeconfig --region ap-south-1 --name mr-cluster

=> kubectl get nodes
look for details in chatgpt's page K8s Deployment Prerequisites

21. Create Jenkins CI CD Job
create jenkinsfile and kubernetes manifest files
repo/
│
├── nadsoft-backend/
├── nadsoft-frontend/
├── k8/
│   ├── namespace.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
jenkinsfile


22. Apply Kubernetes Files Manually First

Before Jenkins automation,
verify deployment manually.
23. to check it first clone git repo inside jenkins server instance
git clone <YOUR_GITHUB_REPO_URL>
cd nadsoft-full-stack
=> kubectl apply -f k8/
24. Verify Deployment
kubectl get all -n nadsoft



====================================
Configure DockerHub Credentials

Go to:

Jenkins
→ Manage Jenkins
→ Credentials
→ Global
→ Add Credentials
Add:
Field	Vd	Username with password
Username	DockerHub username
Password	DockerHub password/tokenalue
ID	dockerhub-creds

IMPORTANT:

Use ID exactly:

dockerhub-creds

because Jenkinsfile will use this.




======================================
credential for Rds database
nadsoft-mysql
user-admin
pass - Admin123

==================================
25. Create AWS RDS MySQL Database
Because backend deployment requires DB connection.
we use:

AWS RDS MySQL

Benefits:

✅ Managed database
✅ Automated backups
✅ Better production architecture
✅ Persistent storage
✅ High availability possible

Why RDS Must Be Created First

Your backend pod uses:

DB_HOST
DB_USER
DB_PASSWORD
DB_NAME

Without RDS:
backend pod will crash.

26. Update backend deployment YAML with RDS endpoint.
This Endpoint Becomes Your DB_HOST

Update backend deployment YAML:

- name: DB_HOST
  value: nadsoft-mysql.c7abcxyz123.ap-south-1.rds.amazonaws.com


27. push deployment.yml file to git 
28. kubectl apply -f k8/
29. From Jenkins server OR EKS management host:
    Run:kubectl get nodes
30. verify deployment From Jenkins server or EKS management host:
    kubectl get all -n nadsoft
    
    You should see:
✅ frontend pods
✅ backend pods
✅ services
31. Check Logs
kubectl logs -f deployment/backend-deployment -n nadsoft

32. SSH Into Jenkins Server

Go to project folder:

cd P-NADSOFT-PROJECT/nadsoft-full-stack

Login DockerHub

docker login
DockerHub username
DockerHub password/token
Step 3 — Build Backend Image
docker build -t mrunali2010/nadsoft-backend:latest ./nadsoft-backend
Step 4 — Push Backend Image
docker push mrunali2010/nadsoft-backend:latest
Step 5 — Build Frontend Image
docker build -t mrunali2010/nadsoft-frontend:latest ./nadsoft-frontend
Step 6 — Push Frontend Image
docker push mrunali2010/nadsoft-frontend:latest
Step 7 — Restart Kubernetes Deployments

After images pushed:

kubectl rollout restart deployment backend-deployment -n nadsoft

kubectl rollout restart deployment frontend-deployment -n nadsoft
Step 8 — Verify Pods
kubectl get pods -n nadsoft

Expected:

Running

instead of:

ImagePullBackOff
Step 9 — Check Frontend LoadBalancer

You already got:

a3bfbebedf78f450d84ad3dc6d90afd5-1090310502.ap-south-1.elb.amazonaws.com

Once pods become Running:

Open:

http://a3bfbebedf78f450d84ad3dc6d90afd5-1090310502.ap-south-1.elb.amazonaws.com

Your React app should open.
=============================
33. We will create:
Final Production Jenkinsfile
with stages:

Checkout
Build Backend
Build Frontend
Docker Login
Push Images
Deploy To Kubernetes
Verify Deployment

fully automated CI/CD.


======================
if needed

. After running the CICD
 loadbalancer will create because in yml file provided type: LoadBalancer
Which will expose the application check for the DNS name in loadbalancer
To access the application on browser use DNS name from loadbalancer/<context path>
http://<LB-DNS>/<context-path>
context path is war file name(this also available in dockerfile for java applications)
or you can get it from command
kubectl exec -it <pod-name> -- ls /usr/local/tomcat/webapps

kubectl get pods
kubectl get services

cleanup steps
Delete EKS Cluster FIRST Takes 10–15 minutes
eksctl delete cluster --name mr-cluster --region ap-south-1
