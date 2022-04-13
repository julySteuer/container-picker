import util from "util"
import {exec as ex} from 'child_process'

const exec = util.promisify(ex);
class Image {
    constructor(name, description){
        this.name = name
        this.description = description
    }
}

export async function search(term){
    if (!term) {
        return [new Image("X", "No more Containers")]
    }
    const {stdout} = await exec(`docker search ${term}`, { encoding: 'utf-8' });
    let output = stdout
    let imageOut = []
    let out = output.split("\n")
    out.shift()
    out.pop()
    for (let i = 0;i <= out.length-1;i++){
        let t = out[i].split(/ {2,}/)
        imageOut.push(new Image(t[0], t[1]))
    }
    imageOut.unshift(new Image("X", "No more Containers"))
    return imageOut
}  