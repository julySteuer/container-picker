# CONPICK 
A declarative docker compose tool.

## Why this exists
If you read this you probably know  what i am talking about. You want to use docker compose but there are so many things to consider. at first you got to look for the right container and then use it in the yml structure for it to work. you may use the same name or port twice or some other mistake that can happen fast but can delay your deployment. This tool aims to solve that

## What is this tool
This tool is a cli which generates docker compose files. It (at the moment) generates just a skelton. You can specify names, ports and images. all of which are getting spellchecked before any error can happen.