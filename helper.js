import inquirer from "inquirer"

export function splitLocalPort(portString){
    let ports = portString.split(",")
    let localPorts = []
    for (let port in ports){
        localPorts.push(ports[port].split(":")[1])
    }
    return localPorts
}

export async function promptNewName(newWord){
    return await inquirer.prompt([
        {
            name: "newName",
            message: `It looks like a service is already named like this maybe change it to ${newWord} ?`,
            type: "input"
        }
    ])
}

export async function promptNewPortRequest(port) {
    return await inquirer.prompt([
        {
            name: "newPortRequest",
            message: `The port you specified (${port}) was already given to another container is this intentional ?`,
            type: "confirm"
        }
    ])
}

export async function promptNewPort(port){
    return await inquirer.prompt([
        {
            name: "newPort",
            message: `How about you try ${parseInt(port)+1} or with something completely else (type in like <container port>:<local port>) ?`,
            type: "input"
        }
    ])
}