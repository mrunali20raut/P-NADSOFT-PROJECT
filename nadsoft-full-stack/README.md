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

