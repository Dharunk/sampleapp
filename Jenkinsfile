node {

    deleteDir()

    def IMAGE_NAME = "sample-node-app"
    def IMAGE_TAG = "${env.BUILD_NUMBER ?: 'local'}"
    def EMAIL_RECIPIENTS = "dharunkumarsk04@gmail.com"

    def nodeHome = tool name: 'nodejs-18', type: 'nodejs'
    env.PATH = "${nodeHome}/bin:${env.PATH}"

    stage('Checkout') {
      checkout scm
    }


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
          set -euxo pipefail
          # stop & remove existing container if present
          if docker ps -q -f name=${containerName} | grep -q .; then
            echo "Stopping existing container ${containerName}..."
            docker rm -f ${containerName} || true
          fi

          echo "Starting container ${containerName} from image ${IMAGE_NAME}:${IMAGE_TAG}..."
          docker run -d --name ${containerName} -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}
        """
        sh 'sleep 2'
        // sh 'curl -f http://localhost:3000/health || (docker logs ${IMAGE_NAME} && exit 1)'
      } catch (err) {
        buildResult = 'FAILURE'
        // best-effort cleanup, then fail
        sh "docker rm -f ${IMAGE_NAME} || true"
        error "Deploy failed: ${err}"
      }
    }

    try {
    currentBuild.result = currentBuild.result ?: 'SUCCESS'
  } finally {
    def subject = "Build ${currentBuild.result}: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    def body = """\
Build: ${env.JOB_NAME} #${env.BUILD_NUMBER}
Result: ${currentBuild.result}
URL: ${env.BUILD_URL}
"""
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
}
