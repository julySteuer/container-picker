const tab = '   '

export function bootstrap(version){
    return (
        `version: "${version}" \n` +
        "services:" + "\n"
    )
}

export function addPort(ports) {
    return (
        tab + tab + "ports:" + "\n" +
        ports.map((port) => {
            return tab + tab + tab + "-" + " " + `"${port}"`
        }).join("\n") + "\n"
    )
}

export function addImage(image){
    let im = (
        tab + image["name"] + ":" + "\n" + 
        tab + tab + `image: ${image['container']}` + "\n"
    )
    return im
}

export function addLocalImage(image) {
    let im = (
        tab + image["name"] + ":" + "\n" + 
        tab + tab + `build: ${image["path"]}` + "\n"
    )
    return im
}