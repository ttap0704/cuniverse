#!/bin/bash
REPOSITORY=/home/ubuntu/cuniverse # 배포된 프로젝트 경로.

cd $REPOSITORY

sudo pm2 start ecosystem.config.js