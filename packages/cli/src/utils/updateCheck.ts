import checkForUpdate from 'update-check'
import ms from 'ms'
import chalk from 'chalk'
import { error } from './error'
import { info } from './info'
import { Package } from 'normalize-package-data'
import { prerelease } from 'semver'
const commandExistsSync = require('command-exists').sync

type Update = { latest: string }

function yarnUpdateMessage(
	_version: string,
	distTag: string /* , update: Update */
): string | undefined {
	if (commandExistsSync('yarn')) {
		return chalk`Get it by running {greenBright yarn global upgrade element-cli@${distTag}}`
	}
}

// fallback
function npmUpdateMessage(_version: string, distTag: string /* , update: Update */): string {
	return chalk`Get it by running {greenBright npm -g update element-cli@${distTag}}`
}

function printUpdateMessage(version: string, distTag: string, update: Update) {
	const releaseChannel = distTag === 'latest' ? 'stable' : distTag

	console.log(
		info(
			chalk`{bgRed UPDATE AVAILABLE} The latest ${releaseChannel} version of element-cli is ${update?.latest}`
		)
	)

	const updateMsg =
		[yarnUpdateMessage(version, distTag), npmUpdateMessage(version, distTag)].find((x) => !!x) ||
		'unreachable'

	console.log(info(updateMsg))
}

export async function updateCheck(pkg: Package) {
	if (!process.stdout.isTTY) return

	if (!pkg.name) {
		console.error(error(`Failed to read package.json while checking for update`))
		return
	}

	try {
		// 1.0.1 -> latest
		// 1.0.1-beta.1 -> beta
		const validDistTags = ['latest', 'beta']
		let distTag = 'latest'

		const versionParts = prerelease(pkg.version) || []
		if (versionParts) {
			if (validDistTags.includes(versionParts[0])) distTag = versionParts[0]
		}

		const update = await checkForUpdate(pkg, {
			interval: ms('1d'),
			distTag,
		})

		if (update) {
			printUpdateMessage(pkg.version, distTag, update)
		}
	} catch (err) {
		console.error(error(`Checking for updates failed`))

		console.error(err)
	}
}
