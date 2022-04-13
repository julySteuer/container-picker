export async function portValidator(input) {
    if (!input){
        return true
    }
    let re = /\d+:\d+/
    return re.test(input)
}