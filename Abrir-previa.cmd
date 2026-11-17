@echo off
cd /d "%~dp0"
python -X utf8 tools\preview.py
if errorlevel 1 pause
