// Creates db.json from xx.json
// - Replaces image paths with 16x16 base64 encoded strings
// - Creates the names array automatically
// - Does linking with the id fields

'use strict'

const fs = require('fs')
const sharp = require('sharp')
const init = require('./db_init.json')

const SIZE = 16

async function main() {
    let res = {
        mods: [],
        groups: []
    }
    
    for (const [mod_name, mod] of Object.entries(init)) {
        let mods = []
    
        for (const [img_name, wildcards] of Object.entries(mod.mods)) {
            mods.push({
                id: img_name,
                img: await base64_encode(`./icons/${mod_name}/${img_name}.png`),
                wildcards
            })
        }
        res.mods.push({
            id: res.mods.length,
            base_url: mod.base_url,
            mods
        })
        res.groups.push({
            id: res.groups.length,
            title: mod.title,
            img: await base64_encode(`./icons/${mod_name}/icon.png`)
        })
    }
    
    fs.writeFileSync('db.json', JSON.stringify(res, null, 4))    
}

main()

async function base64_encode(filepath) {
    return (await sharp(filepath)
        .resize(SIZE, SIZE)
        .toBuffer()
    ).toString('base64')
}
