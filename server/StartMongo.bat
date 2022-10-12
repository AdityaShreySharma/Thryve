@echo off
cd "C:\Program Files\MongoDB\Server\4.0\bin"
start mongod.exe
timeout 4
start mongo.exe
exit