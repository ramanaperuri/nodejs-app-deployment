pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                // Clone the repository to the workspace
                git branch: 'main', url:'https://github.com/ramanaperuri/nodejs-app-deployment.git'
            }
        }

        stage('Build') {
            steps {
                // Build the Docker image and tag it
                sh 'docker build -t my-nodejs-app .'
            }
        }

        stage('Push to AWS ECR') {
            steps {
                // Push the Docker image to AWS ECR (if you are using ECR to store your Docker images)
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'node_app', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 341654418433.dkr.ecr.us-east-1.amazonaws.com'
                    sh 'docker tag my-nodejs-app:latest 341654418433.dkr.ecr.us-east-1.amazonaws.com/nodeapp_dockerization/my-nodejs-app:latest'
                    sh 'docker push 341654418433.dkr.ecr.us-east-1.amazonaws.com/nodeapp_dockerization/my-nodejs-app:v1'
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                // Connect to your EC2 instance and deploy the app
                sshagent(['your-ssh-credentials-id']) {
                    sh 'ssh -o StrictHostKeyChecking=no ec2-user@your-ec2-instance-ip "docker pull your-aws-account-id.dkr.ecr.your-aws-region.amazonaws.com/your-ecr-repo/your-nodejs-app:latest && docker run -dit -p 8000:8000 --name your-nodejs-app-container your-aws-account-id.dkr.ecr.your-aws-region.amazonaws.com/your-ecr-repo/your-nodejs-app:latest"'
                }
            }
        }
    }
}
