import { api } from '../utils/api'
import type { CustomLayout, LayoutElementInstance, LayoutTemplateType } from '../types/layout'

export interface LayoutUpsertInput {
  id?: string
  name: string
  template: LayoutTemplateType
  elements: LayoutElementInstance[]
  isPreset?: boolean
}

interface LayoutApiRow {
  id: string
  name: string
  template: LayoutTemplateType
  elements: LayoutElementInstance[]
  is_preset: number
  created_at: string
  updated_at: string
}

const toCustomLayout = (row: LayoutApiRow): CustomLayout => ({
  id: row.id,
  name: row.name,
  template: row.template,
  elements: row.elements,
  isPreset: row.is_preset === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const layoutService = {
  async list(): Promise<CustomLayout[]> {
    const rows = await api.get<LayoutApiRow[]>('/protected/layouts')
    return rows.map(toCustomLayout)
  },

  async get(id: string): Promise<CustomLayout> {
    const row = await api.get<LayoutApiRow>(`/protected/layouts/${encodeURIComponent(id)}`)
    return toCustomLayout(row)
  },

  async create(input: LayoutUpsertInput): Promise<CustomLayout> {
    const row = await api.post<LayoutApiRow>('/protected/layouts', input)
    return toCustomLayout(row)
  },

  async update(id: string, input: Omit<LayoutUpsertInput, 'id'>): Promise<CustomLayout> {
    const row = await api.put<LayoutApiRow>(`/protected/layouts/${encodeURIComponent(id)}`, input)
    return toCustomLayout(row)
  },

  async remove(id: string): Promise<void> {
    await api.delete<{ success: true }>(`/protected/layouts/${encodeURIComponent(id)}`)
  },
}
