import { describe, it, expect, beforeEach } from 'vitest'

type CampaignStatus = 'active' | 'paused' | 'ended'

interface Campaign {
  id: number
  owner: string
  title: string
  targetUrl: string
  budget: bigint
  spent: bigint
  status: CampaignStatus
}

interface Contract {
  admin: string
  campaignIdCounter: number
  campaigns: Map<number, Campaign>

  isAdmin: (caller: string) => boolean
  createCampaign: (caller: string, title: string, url: string, budget: bigint) => { value?: number; error?: number }
  pauseCampaign: (caller: string, id: number) => { value?: boolean; error?: number }
  resumeCampaign: (caller: string, id: number) => { value?: boolean; error?: number }
  endCampaign: (caller: string, id: number) => { value?: boolean; error?: number }
  recordSpend: (caller: string, id: number, amount: bigint) => { value?: boolean; error?: number }
}

const mockCampaignContract: Contract = {
  admin: 'ST1ADMIN000000000000000000000000000000000',
  campaignIdCounter: 1,
  campaigns: new Map(),

  isAdmin(caller: string): boolean {
    return caller === this.admin
  },

  createCampaign(caller, title, url, budget) {
    if (budget <= 0n) return { error: 103 }
    const id = this.campaignIdCounter++
    const newCampaign: Campaign = {
      id,
      owner: caller,
      title,
      targetUrl: url,
      budget,
      spent: 0n,
      status: 'active'
    }
    this.campaigns.set(id, newCampaign)
    return { value: id }
  },

  pauseCampaign(caller, id) {
    const campaign = this.campaigns.get(id)
    if (!campaign) return { error: 101 }
    if (caller !== campaign.owner) return { error: 104 }
    campaign.status = 'paused'
    return { value: true }
  },

  resumeCampaign(caller, id) {
    const campaign = this.campaigns.get(id)
    if (!campaign) return { error: 101 }
    if (caller !== campaign.owner) return { error: 104 }
    if (campaign.status === 'ended') return { error: 105 }
    campaign.status = 'active'
    return { value: true }
  },

  endCampaign(caller, id) {
    const campaign = this.campaigns.get(id)
    if (!campaign) return { error: 101 }
    if (caller !== campaign.owner) return { error: 104 }
    campaign.status = 'ended'
    return { value: true }
  },

  recordSpend(caller, id, amount) {
    if (!this.isAdmin(caller)) return { error: 100 }
    const campaign = this.campaigns.get(id)
    if (!campaign) return { error: 101 }
    if (campaign.status !== 'active') return { error: 102 }
    const newSpent = campaign.spent + amount
    if (newSpent > campaign.budget) return { error: 103 }
    campaign.spent = newSpent
    return { value: true }
  }
}

describe('Ad Campaign Contract', () => {
  const admin = mockCampaignContract.admin
  const user = 'ST2USER000000000000000000000000000000000'
  let campaignId: number

  beforeEach(() => {
    mockCampaignContract.campaignIdCounter = 1
    mockCampaignContract.campaigns = new Map()
  })

  it('should allow user to create campaign with valid budget', () => {
    const result = mockCampaignContract.createCampaign(user, 'Test Ad', 'https://ad.url', 1000n)
    expect(result.value).toBeDefined()
    if (typeof result.value === 'number') {
      campaignId = result.value
      expect(campaignId).toBe(1)
    }
  })

  it('should reject campaign with zero budget', () => {
    const result = mockCampaignContract.createCampaign(user, 'Bad Ad', 'https://bad.url', 0n)
    expect(result.error).toBe(103)
  })

  it('should pause and resume campaign by owner', () => {
    const create = mockCampaignContract.createCampaign(user, 'Ad', 'url', 500n)
    expect(create.value).toBeDefined()
    if (typeof create.value === 'number') {
      campaignId = create.value
      expect(mockCampaignContract.pauseCampaign(user, campaignId)).toEqual({ value: true })
      expect(mockCampaignContract.resumeCampaign(user, campaignId)).toEqual({ value: true })
    }
  })

  it('should end campaign by owner', () => {
    const create = mockCampaignContract.createCampaign(user, 'Ad', 'url', 500n)
    expect(create.value).toBeDefined()
    if (typeof create.value === 'number') {
      campaignId = create.value
      expect(mockCampaignContract.endCampaign(user, campaignId)).toEqual({ value: true })
    }
  })

  it('should allow admin to record spend within budget', () => {
    const create = mockCampaignContract.createCampaign(user, 'Ad', 'url', 1000n)
    expect(create.value).toBeDefined()
    if (typeof create.value === 'number') {
      campaignId = create.value
      const result = mockCampaignContract.recordSpend(admin, campaignId, 200n)
      expect(result).toEqual({ value: true })
    }
  })

  it('should reject spend beyond budget', () => {
    const create = mockCampaignContract.createCampaign(user, 'Ad', 'url', 100n)
    expect(create.value).toBeDefined()
    if (typeof create.value === 'number') {
      campaignId = create.value
      const result = mockCampaignContract.recordSpend(admin, campaignId, 500n)
      expect(result.error).toBe(103)
    }
  })
})
