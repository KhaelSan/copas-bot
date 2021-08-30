const { WAConnection: _WAConnection, Browsers } = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const fs = require("fs-extra")
const figlet = require('figlet')
const { uncache, nocache } = require('./lib/loader')
const setting = JSON.parse(fs.readFileSync('./setting.json'))
const welcome = require('./message/group')
const simple = require('./lib/simple.js')
const WAConnection = simple.WAConnection(_WAConnection)
baterai = 'unknown'
charging = 'unknown'

//nocache
require('./copas.js')
nocache('../copas.js', module => console.log(color('[WATCH]', 'cyan'), color(`'${module}'`, 'green'), 'File is updated!'))
require('./message/group.js')
nocache('../message/group.js', module => console.log(color('[WATCH]', 'cyan'), color(`'${module}'`, 'green'), 'File is updated!'))

const starts = async (copass = new WAConnection()) => {
	copass.logger.level = 'warn'
	console.log(color(figlet.textSync('COPAS BOT', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('[ COPAS ]', 'cyan'), color('KAMI HANYALAH SEORANG COPASTER', 'green'))
	console.log(color('[ COPAS ]', 'cyan'), color(`\nCOPAS-TEAM:\n\nLord Yudha\nKhael\nZakkyTod\nFboy`, 'red'))
	copass.browserDescription = ["COPAS - BOT", "Firefox", "3.0.0"];

	// Menunggu QR
	copass.on('qr', () => {
		console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color('Scan Kode QR nya kak'))
	})

	// Menghubungkan
	fs.existsSync(`./${setting.sessionName}.json`) && copass.loadAuthInfo(`./${setting.sessionName}.json`)
	copass.on('connecting', () => {
		console.log(color('[ INFO ]', 'cyan'), color(' ⏳ menyambungkan...'));
	})

	//connect
	copass.on('open', () => {
		console.log(color('[ INFO ]', 'cyan'), color('Succes Terhubung'));
	})

	// session
	await copass.connect({
		timeoutMs: 30 * 1000
	})
	fs.writeFileSync(`./${setting.sessionName}.json`, JSON.stringify(copass.base64EncodedAuthInfo(), null, '\t'))

	// Baterai
	copass.on('CB:action,,battery', json => {
		global.batteryLevelStr = json[2][0][1].value
		global.batterylevel = parseInt(batteryLevelStr)
		baterai = batterylevel
		if (json[2][0][1].live == 'true') charging = true
		if (json[2][0][1].live == 'false') charging = false
		console.log(json[2][0][1])
		console.log('Baterai : ' + batterylevel + '%')
	})
	global.batrei = global.batrei ? global.batrei : []
	copass.on('CB:action,,battery', json => {
		const batteryLevelStr = json[2][0][1].value
		const batterylevel = parseInt(batteryLevelStr)
		global.batrei.push(batterylevel)
	})

	// welcome
	copass.on('group-participants-update', async (anu) => {
		await welcome(copass, anu)
	})

	copass.on('chat-update', async (message) => {
		require('./copas.js')(copass, message)
	})
}

starts()