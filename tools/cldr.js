#!/usr/bin/env node

// This is an internal dev tool to generate the CLDR data.


import * as fs from 'fs'
import fg from "fast-glob"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))


//
// prepare environment
//

const cldrPath = `${__dirname}/cldr`

if (!fs.existsSync(cldrPath)) {
    fs.mkdirSync(cldrPath)
}

fg.sync("*", { cwd: cldrPath }).forEach(file => fs.unlinkSync(`${cldrPath}/${file}`))


//
// create firstday file
//

const cldrFirstDay = JSON.parse(fs.readFileSync(`${__dirname}/../node_modules/cldr-core/supplemental/weekData.json`))
    .supplemental.weekData.firstDay

// days in cldrFirstDay are mon,sun … we need numbers however
const firstDays = { sun: "0", mon: "1", fri: "5", sat: "6" }

Object.keys(cldrFirstDay).forEach(country => {
    if (country.match(/^[A-Z]{2}$/))
        cldrFirstDay[country] = firstDays[cldrFirstDay[country]]
    else
        delete cldrFirstDay[country]
})

fs.writeFileSync(`${cldrPath}/_firstday.json`, JSON.stringify(cldrFirstDay))


//
// create new language files
//

const cldrDataPath = `${__dirname}/../node_modules/cldr-dates-modern/main`
const cldrFiles = fg.sync("**/ca-gregorian.json", { cwd: cldrDataPath })


cldrFiles.forEach(file => {
    const locale = file.replace(/\/.*$/, "")
    const country = locale.split("-")[1]
    const cldr = JSON.parse(fs.readFileSync(`${cldrDataPath}/${file}`).toString())

    const extract = {
        days: cldr.main[locale].dates.calendars.gregorian.days["stand-alone"].wide,
        daysShort: cldr.main[locale].dates.calendars.gregorian.days["stand-alone"].abbreviated,
        months: cldr.main[locale].dates.calendars.gregorian.months["stand-alone"].wide,
        monthsShort: cldr.main[locale].dates.calendars.gregorian.months["stand-alone"].abbreviated
    }

    const data = {
        days: {
            "_\u0004Monday": extract.days.mon,
            "_\u0004Tuesday": extract.days.tue,
            "_\u0004Wednesday": extract.days.wed,
            "_\u0004Thursday": extract.days.thu,
            "_\u0004Friday": extract.days.fri,
            "_\u0004Saturday": extract.days.sat,
            "_\u0004Sunday": extract.days.sun
        },
        daysShort: {
            "_\u0004Mon": extract.daysShort.mon,
            "_\u0004Tue": extract.daysShort.tue,
            "_\u0004Wed": extract.daysShort.wed,
            "_\u0004Thu": extract.daysShort.thu,
            "_\u0004Fri": extract.daysShort.fri,
            "_\u0004Sat": extract.daysShort.sat,
            "_\u0004Sun": extract.daysShort.sun
        },
        months: {
            "_\u0004January": extract.months[1],
            "_\u0004February": extract.months[2],
            "_\u0004March": extract.months[3],
            "_\u0004April": extract.months[4],
            "_\u0004May": extract.months[5],
            "_\u0004June": extract.months[6],
            "_\u0004July": extract.months[7],
            "_\u0004August": extract.months[8],
            "_\u0004September": extract.months[9],
            "_\u0004October": extract.months[10],
            "_\u0004November": extract.months[11],
            "_\u0004December": extract.months[12]
        },
        monthsShort: {
            "_\u0004Jan": extract.monthsShort[1],
            "_\u0004Feb": extract.monthsShort[2],
            "_\u0004Mar": extract.monthsShort[3],
            "_\u0004Apr": extract.monthsShort[4],
            "_\u0004May": extract.monthsShort[5],
            "_\u0004Jun": extract.monthsShort[6],
            "_\u0004Jul": extract.monthsShort[7],
            "_\u0004Aug": extract.monthsShort[8],
            "_\u0004Sep": extract.monthsShort[9],
            "_\u0004Oct": extract.monthsShort[10],
            "_\u0004Nov": extract.monthsShort[11],
            "_\u0004Dec": extract.monthsShort[12]
        }
    }

    fs.writeFileSync(`${cldrPath}/${locale}.json`, JSON.stringify(data))
})
