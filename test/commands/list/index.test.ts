import {expect, test} from '@oclif/test'

describe('hello', () => {
  test
  .stdout()
  .command(['list'])
  .it('runs list', ctx => {
    expect(ctx.stdout).to.contain('')
  })
})
