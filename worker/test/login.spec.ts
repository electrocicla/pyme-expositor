import { describe, it, expect } from 'vitest'
import { processLoginPayload } from '../src/index'
import app from '../src/index'

const createTestEnv = (): { JWT_SECRET: string } => ({
  JWT_SECRET: 'test-secret'
})

describe('login handler (unit)', () => {
  it('returns 400 for invalid payloads', () => {
    const res = processLoginPayload(null)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 200 and user for correct password', () => {
    const res = processLoginPayload({ password: 'secretpassword' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('user')
  })

  it('returns 401 for wrong password', () => {
    const res = processLoginPayload({ password: 'wrong' })
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })
})

describe('login endpoint (integration)', () => {
  it('POST /api/login returns token for correct password', async () => {
    const request = new Request('https://test.example/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'secretpassword' }),
    })

    const response = await app.fetch(request, createTestEnv())
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toHaveProperty('token')
  })

  it('POST /api/login returns 401 for wrong password', async () => {
    const request = new Request('https://test.example/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'bad' }),
    })

    const response = await app.fetch(request, createTestEnv())
    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toHaveProperty('error')
  })
})
