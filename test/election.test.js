import Computer from 'bitcoin-computer'
import Mnemonic from 'bsv/mnemonic'

test('should initialize computer', () => {
    const computer = new Computer()
    expect(computer).toBeDefined()
    console.log(computer.db.wallet.mnemonic.toString())
})
test('should run election', () => {
    const bsv = 'BSV'
    const computerElection = new Computer({chain:bsv})
    console.log(computerElection)
})