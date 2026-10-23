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
        IMAGE_REPO = 'ghcr.io/davidlescard/ai-ci-reference-dashboard'
        // The staging stack publishes port 3001 on the Docker host; Jenkins reaches the host by this name.
        STAGING_URL = 'http://host.docker.internal:3001'
    }

    stages {
        stage('Prepare') {
            steps {
                script {
                    // BUILD_TAG contains characters Docker names do not allow.
                    env.QGL_ID = env.BUILD_TAG.replaceAll('[^A-Za-z0-9_.-]', '-').toLowerCase()
                    env.VERSION = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
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

        stage('Publish image') {
            when { branch 'main' }
            steps {
                sh 'docker tag "quality-gate-lab:${QGL_ID}" "quality-gate-lab:${VERSION}"'
                withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_PASS')]) {
                    sh '''
                        if [ -z "$GHCR_PASS" ]; then
                            echo "No GHCR token configured; skipping the registry push"
                            exit 0
                        fi
                        echo "$GHCR_PASS" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
                        docker tag "quality-gate-lab:${VERSION}" "${IMAGE_REPO}:${VERSION}"
                        docker tag "quality-gate-lab:${VERSION}" "${IMAGE_REPO}:latest"
                        docker push "${IMAGE_REPO}:${VERSION}"
                        docker push "${IMAGE_REPO}:latest"
                        docker logout ghcr.io
                    '''
                }
            }
        }

        stage('Deploy to staging') {
            when { branch 'main' }
            steps {
                sh 'APP_IMAGE="quality-gate-lab:${VERSION}" docker compose -f docker-compose.staging.yml up -d --wait'
            }
        }

        stage('Post-deploy smoke') {
            when { branch 'main' }
            steps {
                sh '''
                    BASE_URL="${STAGING_URL}" \
                    PLAYWRIGHT_JUNIT_OUTPUT_FILE=test-results-post-deploy/junit.xml \
                    PLAYWRIGHT_HTML_REPORT=playwright-report-post-deploy \
                    pnpm --filter ai-ci-reference-e2e exec playwright test --grep @post-deploy --output=test-results-post-deploy
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'apps/api/test-results/mocha.xml, e2e/test-results/junit.xml, e2e/test-results-post-deploy/junit.xml'
            sh 'docker logs "qgl-${QGL_ID}" > container.log 2>&1 || true'
            script {
                if (env.BRANCH_NAME == 'main') {
                    writeFile file: 'deployment.txt', text: "version=${env.VERSION}\nimage=quality-gate-lab:${env.VERSION}\ncommit=${env.GIT_COMMIT}\nurl=http://localhost:3001\nresult=${currentBuild.currentResult}\n"
                    currentBuild.description = "${env.VERSION} to staging: ${currentBuild.currentResult}"
                }
            }
            archiveArtifacts artifacts: 'container.log, deployment.txt, e2e/playwright-report*/**, e2e/test-results*/**', allowEmptyArchive: true
            sh '''
                docker rm -f "qgl-${QGL_ID}" || true
                docker rmi "quality-gate-lab:${QGL_ID}" || true
            '''
            cleanWs()
        }
    }
}
