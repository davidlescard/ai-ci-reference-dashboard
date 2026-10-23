pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds(abortPrevious: true)
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Prepare') {
            steps {
                script {
                    // BUILD_TAG contains characters Docker names do not allow.
                    env.QGL_ID = env.BUILD_TAG.replaceAll('[^A-Za-z0-9_.-]', '-').toLowerCase()
                }
                sh './build.sh install'
            }
        }

        stage('Compile') {
            steps {
                sh './build.sh compile'
            }
        }

        stage('Unit tests') {
            steps {
                sh './build.sh test-junit'
            }
        }

        stage('Build') {
            steps {
                sh './build.sh build'
            }
        }

        stage('Container image') {
            steps {
                sh '''
                    docker build -t "quality-gate-lab:${QGL_ID}" .
                    docker run -d --name "qgl-${QGL_ID}" "quality-gate-lab:${QGL_ID}"
                    for attempt in $(seq 1 30); do
                        status=$(docker inspect --format '{{.State.Health.Status}}' "qgl-${QGL_ID}")
                        if [ "$status" = "healthy" ]; then exit 0; fi
                        sleep 2
                    done
                    echo "Container did not become healthy" >&2
                    exit 1
                '''
            }
        }

        stage('Playwright E2E') {
            steps {
                sh 'pnpm --filter ai-ci-reference-e2e exec playwright install chromium'
                sh 'pnpm --filter ai-ci-reference-e2e test'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'apps/api/test-results/mocha.xml, e2e/test-results/junit.xml'
            sh 'docker logs "qgl-${QGL_ID}" > container.log 2>&1 || true'
            archiveArtifacts artifacts: 'container.log, e2e/playwright-report/**, e2e/test-results/**', allowEmptyArchive: true
            sh '''
                docker rm -f "qgl-${QGL_ID}" || true
                docker rmi "quality-gate-lab:${QGL_ID}" || true
            '''
            cleanWs()
        }
    }
}
