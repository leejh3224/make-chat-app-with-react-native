import Main from 'Main'
import { YellowBox } from 'react-native'

/**
 * Turn off some warnings
 */
YellowBox.ignoreWarnings([
	'Require cycle:',
	'Remote debugger',
	'Setting a timer',
])

export default Main
