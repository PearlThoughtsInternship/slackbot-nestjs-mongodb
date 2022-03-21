pipeline {
  agent {label 'Message-Router-Server'}
  environment {
       Project_dir = '/srv/Message-Router-API3''
       pm2_process_name = 'Message-Router-3'
   }
  stages {
    stage('Deploy') {
      steps {
        sh "cd ${Project_dir}/ && git pull && yarn install && yarn build && pm2 restart ${pm2_process_name}" 
        }
    }
}
}
