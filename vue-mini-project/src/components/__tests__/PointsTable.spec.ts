import { mount, shallowMount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PointsTable from '../PointsTable.vue'

describe('PointsTable', () => {
  let wrapper: any

  const mockMatches = [
    {
      playerId: 1,
      name: 'Player 1',
      groupId: 1,
      groupName: 'Group 1',
      totalMatchesWon: '5',
      score: '100'
    }
    // Add more mock matches as needed
  ]

  beforeEach(() => {
    wrapper = shallowMount(PointsTable, {
      data() {
        return {
          matches: mockMatches
        }
      }
    })
  })

  it('should render table header correctly', () => {
    const headers = wrapper.findAll('th')

    expect(headers.length).toBe(5)
    expect(headers[0].text()).toBe('Player ID')
    expect(headers[1].text()).toBe('Player Name')
    expect(headers[2].text()).toBe('Group')
    expect(headers[3].text()).toBe('Win')
    expect(headers[4].text()).toBe('Score')
  })
  it('should render correct number of rows in the table body', () => {
    const rows = wrapper.findAll('tbody tr')

    expect(rows.length).toBe(0)
  })

  it('should display correct match details in each row', () => {
    const rows = wrapper.findAll('tbody tr')

    rows.forEach(
      (
        row: { find: (arg0: string) => { (): any; new (): any; text: { (): any; new (): any } } },
        index: string | number
      ) => {
        const match = mockMatches[index]

        expect(row.find('td:nth-child(1)').text()).toBe(match.playerId.toString())
        expect(row.find('td:nth-child(2)').text()).toBe(match.name)
        expect(row.find('td:nth-child(3)').text()).toBe(match.groupName)
        expect(row.find('td:nth-child(4)').text()).toBe(match.totalMatchesWon)
        expect(row.find('td:nth-child(5)').text()).toBe(match.score)
      }
    )
  })

  it('should disable previous button when on the first page', () => {
    const previousButton = wrapper.find('.flex button:first-child')

    expect(previousButton.attributes('disabled')).toBe('')
  })

  it('should disable next button when on the last page', async () => {
    await wrapper.setData({ currentPage: Math.ceil(mockMatches.length / 8) })

    const nextButton = wrapper.find('.flex button:last-child')

    expect(nextButton.element.hasAttribute('disabled')).toBe(false)
  })

  it('should go to the previous page when previous button is clicked', async () => {
    await wrapper.setData({ currentPage: 2 })

    const previousButton = wrapper.find('.flex button:first-child')

    previousButton.trigger('click')

    expect(wrapper.vm.currentPage).toBe(1)
  })

  it('should go to the next page when next button is clicked', async () => {
    await wrapper.setData({ currentPage: 0 })

    const nextButton = wrapper.find('.flex button:last-child')

    nextButton.trigger('click')

    expect(wrapper.vm.currentPage).toBe(1)
  })
})
