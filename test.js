const test = require('tape')

const execa = require('execa')

test('', async (t) => {
  t.plan(1)

  t.ok(true)
})

test('cli.js', async (t) => {
  t.plan(2)

  try {
    await execa('node', ['./cli.js', '-h'])
  } catch (e) {
    t.ok(e)

    t.equal(e.stdout.includes('Usage'), true)
  }
})
