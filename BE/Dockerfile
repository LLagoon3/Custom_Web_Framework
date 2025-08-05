# MySQL 공식 이미지를 기반으로 생성
FROM mysql:latest

# 환경 변수는 Docker Compose에서 전달되므로 이곳에서 따로 설정할 필요 없음
# MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD는 Compose에서 설정됨

COPY ./init.sql /docker-entrypoint-initdb.d/

# MySQL의 기본 포트(3306) 노출
EXPOSE 3306

# MySQL 서버 실행
CMD ["mysqld"]
