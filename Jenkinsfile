// Jenkinsfile - Scripted Pipeline for sampleapp
node {
  // ---- config ----
  def IMAGE_NAME = "sample-node-app"
  def IMAGE_TAG = "${env.BUILD_NUMBER}"
  def EMAIL_RECIPIENTS = "dharunkumarsk04@gmail.com"/
  // ------------------

  try {
    stage('Checkout') {
      checkout scm
    }

    // stage('Install') {
    //   dir(appDir) {
    //     sh 'npm ci'
    //   }
    // }

    stage('Install & Test') {
    try {
      sh 'node -v'
      sh 'npm ci'
      sh 'npm test'
    } catch (err) {
      currentBuild.result = 'FAILURE'
      throw err
    }
  }

    stage('Build Docker Image') {
        try {
            sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
        } catch (err) {
            currentBuild.result = 'FAILURE'
            throw err
        }
    }

    stage('Deploy (run container)') {
        try {
            def containerName = "${IMAGE_NAME}"
            sh """
                if docker ps -q -f name=${containerName} | grep -q . ; then
                    echo "Stopping existing container ${containerName}..."
                    docker rm -f ${containerName} || true
                fi
                echo "Starting container ${containerName} from image ${imageName}:${IMAGE_TAG}..."
                docker run -d --name ${containerName} -p 3000:3000 ${imageName}:${IMAGE_TAG}
            """
        } catch (err) {
            currentBuild.result = 'FAILURE'
            throw err
        }
    }

    try {
    // If build reaches here without exception, it's success
    currentBuild.result = currentBuild.result ?: 'SUCCESS'
  } finally {
    // Email on success/failure using Email Extension plugin (emailext)
    def subject = "Build ${currentBuild.result}: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    def body = """\
Build: ${env.JOB_NAME} #${env.BUILD_NUMBER}
Result: ${currentBuild.result}
URL: ${env.BUILD_URL}
"""
    // If you need SMTP auth in runtime, you can use smtp-creds; usually SMTP is pre-configured in Jenkins global settings.
    try {
      emailext (
        subject: subject,
        body: body,
        to: EMAIL_RECIPIENTS
      )
    } catch (e) {
      echo "Failed to send email: ${e}"
    }
}
