const cheerio = require('cheerio')
const { val } = require('cheerio/lib/api/attributes')
const fs = require('fs')



function getUserOutput() {
    return new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })
        readline.question('Enter exact path of following index.html:', (followingLink) => {
            readline.question('Enter exact path of followers index.html:', (followersLink) => {
                resolve([followingLink, followersLink])
                readline.close();
            })
        })
    })
}

async function execute() {
    const output = await getUserOutput()
    const followingLink = output[0]
    const followersLink = output[1]


    const follwingData = fs.readFileSync(followingLink, 'utf-8')
    const $follwing = cheerio.load(follwingData)

    let follwingArray = []
    $follwing('div.pam a').each((i, el) => {
        const item = $follwing(el).text();
        follwingArray.push(item)
    })

    console.log('total following:', follwingArray.length)

    const follwersData = fs.readFileSync(followersLink, 'utf-8')
    const $follwers = cheerio.load(follwersData)

    let follwersArray = []
    $follwers('div.pam a').each((i, el) => {
        const item = $follwers(el).text();
        follwersArray.push(item)
    })
    console.log('total followers', follwersArray.length)

    const notFollowingBackArr = []

    function checkFollowing(user) {
        if (follwersArray.includes(user)) {
            return true
        } else {
            notFollowingBackArr.push(user)
            return false
        }
    }

    const followebackArray = follwingArray.filter(checkFollowing)

    const followersAnalysis = {
        followingBack: followebackArray,
        notFollowingBack: notFollowingBackArr
    }


    const writeStream = fs.createWriteStream('Followers_Ananlysis.csv')
    writeStream.write(`Following Back, Non-followers aka Celebrity \n`)
    writeStream.write(`(${followersAnalysis.followingBack.length}), (${followersAnalysis.notFollowingBack.length}) \n\n`)

    const nonFollowArr = [...followersAnalysis.notFollowingBack]

    followersAnalysis.followingBack.forEach((fried) => {
        writeStream.write(`${fried} `)
        if (nonFollowArr.length > 0) {
            writeStream.write(`, ${nonFollowArr.shift()} \n`)
        } else {
            writeStream.write('\n')
        }
    })

    console.log('Complete. File Stored as CSV')

}


execute()











