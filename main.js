#!/usr/bin/env node
import {search} from "./dockerProc.js"
import inquirer from "inquirer"
import inquirerPrompt from "inquirer-autocomplete-prompt"
import {bootstrap, addImage, addLocalImage, addPort} from "./dockerComposeFunc.js"
import ora from 'ora';
import fs from 'fs'
import { portValidator } from "./validators.js";
import fetch from "node-fetch"
import { promptNewName, promptNewPort, promptNewPortRequest, splitLocalPort } from "./helper.js";

inquirer.registerPrompt('autocomplete', inquirerPrompt)

let imagesWithNames = []
let names = []
let ports = []

let {version} = await inquirer.prompt([
    {
        name: "version",
        message: "Specify the docker compose version",
        type: "input"
    }
])

let file = bootstrap(version)
let {buildLocal} = await inquirer.prompt([
    {
        name: "buildLocal",
        message: "Do you want to build a Local Dockerfile ?",
        type: "confirm"
    }
])

if (buildLocal){
    let bundle = await inquirer.prompt([
        {
            name: "path",
            message: "Specify the path of the Local Dockerfile",
            type: "input"
        },
        {
            name: "name",
            message: "Service name",
            type: "input"
        },
        {
            name: "port",
            message: "Specify the port (<container port>:<local port>,...) defaults to None",
            type: "input",
            validate: portValidator
        }
    ])

    file += addLocalImage(bundle)
    names.push(bundle["name"])
    if (bundle["port"]){
        ports = ports.concat(splitLocalPort(bundle["port"]))
        file += addPort(bundle["port"].split(","))
    }
}

while (true){
    let {container} = await inquirer.prompt([
        {
            name: "container",
            message: "Which container do you want to use",
            type: "autocomplete",
            source: async function(ans, inp) {return (await search(inp)).map((elem) => {return elem.name})}
        },
    ])
    if (container == "X"){
        break;
    } else {
        let {name, port} = await inquirer.prompt([
            {
                name: "name",
                message: "Service name",
                type: "input"
            },
            {
                name: "port",
                message: "Specify the port (<container port>:<local port>,...) defaults to None",
                type: "input",
                validate: portValidator
            }
        ])
        if (names.includes(name)){
            while(names.includes(name)){
                let response = await fetch("https://random-word-api.herokuapp.com/word")
                let randomWord = await response.json()
                let newWord = name + "-" + randomWord
                let newName = await promptNewName(newWord)
                name = newName['newName']
            }
        } 
        let splitPort = splitLocalPort(port)[0]
        if (ports.includes(splitPort)){
            while(ports.includes(splitPort)){
                let newPortRequest = await promptNewPortRequest(splitLocalPort(port)[0])
                if (!newPortRequest['newPortRequest']){
                    let newPort = await promptNewPort(port)
                    port = newPort['newPort'] 
                }   
                else {
                    break
                }
            }
        }
        names.push(name)
        ports = ports.concat(splitLocalPort(port))
        imagesWithNames.push({"container": container, "name": name, "port": port})
    }
}

imagesWithNames.forEach(elem => {
    file += addImage(elem)
    if (elem["port"]){
        file += addPort(elem["port"].split(","))
    }
})

const spinner = ora("Writing to file").start()
fs.writeFile('./docker-compose.yml', file, err => {
    if (err){
        console.error("error occurred aborting ...")
        console.error(err)
    }
})
spinner.text = "Finished !!!"
spinner.stop()