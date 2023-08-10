pipeline {
    agent any
     environment {
        registry = "341654418433.dkr.ecr.us-east-1.amazonaws.com/nodeapp_dockerization"
    }

    stages {
        stage('Clone') {
            steps {
                // Clone the repository to the workspace
                git branch: 'main', url:'https://github.com/ramanaperuri/nodejs-app-deployment.git'
            }
        }

        stage('Build') {
            steps {
                  script {
                   dockerImage = docker.build registry
                   }
                // Build the Docker image and tag it
                //sh 'docker build -t nodeapp_dockerization:latest .'
                
            }
        }

        stage('Push to AWS ECR') {
            steps {
                // Push the Docker image to AWS ECR (if you are using ECR to store your Docker images)
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'node_app', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 341654418433.dkr.ecr.us-east-1.amazonaws.com'
                    //sh 'docker tag my-nodejs-app:v2 341654418433.dkr.ecr.us-east-1.amazonaws.com/nodeapp_dockerization/my-nodejs-app:latest'
                    sh 'docker push 341654418433.dkr.ecr.us-east-1.amazonaws.com/nodeapp_dockerization:latest'
                }
            }
        }

         stage('Docker Run') {
              steps{
                   script {
                sh 'docker run -d -p 8000:8000 --rm --name myContainer 341654418433.dkr.ecr.us-east-1.amazonaws.com/nodeapp_dockerization:latest'
            
      }
    }
        }

        stage('Deploy to ECS') {
              steps {
                    script {
                        def awsRegion = 'us-east-1'
                        def ecsCluster = 'test-cluster'
                        def ecsService = 'test-service'
                        def taskDefinition = ''test_task_definition
                        sh "aws ecs update-service --cluster ${ecsCluster} --service ${ecsService} --force-new-deployment --task-definition ${taskDefinition}"
                    }
                } 
           }
    }
}
