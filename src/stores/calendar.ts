import { ChangeEvent, createRef } from 'react'
import { makeAutoObservable, runInAction } from 'mobx'
import axios from 'axios'
import { calcHeaderDate, getFirstDay, inDay, nightTime, isBorrowed, isInBoundary } from '../utils/dateCalculator'
import moment from 'moment'
import 'moment/locale/ko'
import { EventApi } from '@fullcalendar/react'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
moment.locale('ko')

interface EventData {
  id?: string
  title: string
  club: string
  start: string | Date
  end: string | Date
  startTime?: string
  endTime?: string
  startRecur?: string | Date
  endRecur?: string | Date
  daysOfWeek?: string[] | number[]
  groupId?: string | number
  allDay?: boolean
  color?: string
  creator?: string
}

const getAllIndex = (list: string | any[], value: string) => {
  let indexes = []
  let i = -1
  while (true) {
    i = list.indexOf(value, i + 1)
    if (i === -1) break
    indexes.push(i)
  }
  return indexes
}

export default class CalendarStore {
  root = null
  /* for display */
  data = []
  clubData = {
    악의꽃: [],
    막무간애: [],
    모여락: [],
  }
  adminData = []
  borrowPaddingBuffer = new Set()
  borrowPaddingOriginalBuffer = new Set()
  borrowedData = []
  /* for submit */
  updatedData = []
  addedData = []
  deletedData = []

  calendarApi = null
  currentDate = new Date()
  disableSubmitButton = true
  setTimeSlot = []
  setTimeIdx = 0
  clubCalendar = false
  headerDate = calcHeaderDate(new Date())
  ref = null
  firstLoad = true

  constructor(root) {
    this.root = root
    makeAutoObservable(this)
  }
  setFirstLoad = () => (this.firstLoad = false)

  getData = async (flag?: boolean) => {
    const cur = this.currentDate
    const from = new Date(cur.getFullYear(), cur.getMonth() - 1, 1).toISOString()
    const to = new Date(cur.getFullYear(), cur.getMonth() + 2, 0).toISOString()

    const res = await axios.get<EventData[]>(`api/?start__gte=${from}&start__lt=${to}`)
    const allClubData = res.data.filter((d: EventData) => d.creator !== 'admin')
    runInAction(() => {
      this.adminData = res.data.filter((d: EventData) => d.creator === 'admin')

      for (let club in this.clubData) this.clubData[club] = allClubData.filter((d: { club: string }) => d.club === club)

      this.borrowedData = res.data.filter((d: EventData) => isBorrowed(d.creator, d.club))

      if (this.root.page.userclub !== 'none' && this.clubCalendar) {
        this.data = res.data
          .filter((d: { club: any }) => d.club !== this.root.page.userclub)
          .concat(this.clubData[this.root.page.userclub])
        this.data.forEach(e => {
          /* admin or borrowed data */
          if (e.creator !== this.root.page.username) {
            e.color = '#777'
            e.editable = false
          }
        })
      } else {
        /* admin data or borrowed data */
        this.data = res.data.filter((e: EventData) => e.creator === 'admin' || isBorrowed(e.creator, e.club))
        if (!this.root.page.isSuper) this.data.map(e => (e.editable = false))
      }
      if (flag) {
        alert('data updated!')
      }
    })
  }

  setCalendarApi = (ref: React.RefObject<any>) => (this.calendarApi = ref)

  emptyBuffer = () => {
    if (this.clubCalendar) this.borrowPaddingBuffer.forEach(e => this.calendarApi.addEvent(e))
    else {
      this.borrowPaddingBuffer.forEach((e: EventApi) => e.remove())
      this.borrowPaddingOriginalBuffer.clear()
    }
    this.borrowPaddingBuffer.clear()
  }

  handleBorrowedEvents = () => {
    if (this.root.page.userclub === 'none' || !this.clubCalendar) return

    const events = this.calendarApi.getEvents()
    this.borrowedData.forEach(d => {
      let fromCalendar = true
      let e: EventApi = events.find((api: EventApi) => Number(api.id) === d.id)
      if (!e) {
        fromCalendar = false
        if (!isInBoundary(new Date(d.start), this.currentDate)) {
          this.borrowPaddingOriginalBuffer.forEach(e => this.calendarApi.addEvent(e))
          this.borrowPaddingOriginalBuffer.clear()
          return
        }
        e.setProp('title', d.title)
        e.setDates(new Date(d.start), new Date(d.end))
        e.setExtendedProp('creator', d.creator)
        e.setExtendedProp('club', d.club)
      }
      const club = e.extendedProps.club
      let newEvent = {
        title: 'null',
        start: null,
        end: null,
        color: '#777',
        extendedProps: {
          creator: 'admin',
          club: club,
        },
      }
      if (club === this.root.page.userclub) {
        events
          .filter((d: any) => d !== e)
          .forEach((event: EventApi) => {
            if (event.start <= e.start && e.start <= event.end && event.start.getTime() !== e.start.getTime()) {
              if (event.start <= e.end && e.end <= event.end) {
                newEvent = {
                  ...newEvent,
                  title: event.title,
                  start: e.end,
                  end: event.end,
                }
                this.borrowPaddingBuffer.add(this.calendarApi.addEvent(newEvent))
              }
              newEvent = {
                ...newEvent,
                title: event.title,
                start: event.start,
                end: e.start,
              }
              this.borrowPaddingBuffer.add(this.calendarApi.addEvent(newEvent))
              this.borrowPaddingOriginalBuffer.add(event)
              event.remove()
            } else if (event.start <= e.end && e.end <= event.end && event.end.getTime() !== e.end.getTime()) {
              newEvent = {
                ...newEvent,
                title: event.title,
                start: e.end,
                end: event.end,
              }
              this.borrowPaddingBuffer.add(this.calendarApi.addEvent(newEvent))
              this.borrowPaddingOriginalBuffer.add(event)
              event.remove()
            } else if (event.start.getTime() === e.start.getTime() && event.end.getTime() === e.end.getTime()) {
              this.borrowPaddingOriginalBuffer.add(event)
              event.remove()
            }
          })
        if (fromCalendar) e.remove()
      }
    })
  }

  setCurDate = () => {
    this.borrowPaddingBuffer.forEach((e: EventApi) => e.remove())
    this.borrowPaddingOriginalBuffer.forEach((e: EventApi) => e.remove())
    this.handleBorrowedEvents()
    this.headerDate = calcHeaderDate(this.currentDate)
  }

  currentDateChange = (date: Date) => {
    const y = this.currentDate.getFullYear()
    const m = this.currentDate.getMonth()
    this.currentDate = date
    this.calendarApi.gotoDate(date)
    this.updateMonthData(y, m, date)
    this.setCurDate()
  }

  moveToday = () => this.currentDateChange(new Date())

  moveRight = () => {
    const d = this.currentDate.getDate()
    this.currentDate.setDate(d + 7)
    const y = this.currentDate.getFullYear()
    const m = this.currentDate.getMonth()
    this.calendarApi.next()
    if (!this.root.page.setCalendarMode) this.updateMonthData(y, m, this.currentDate)
    this.setCurDate()
  }

  moveLeft = () => {
    const y = this.currentDate.getFullYear()
    const m = this.currentDate.getMonth()
    const d = this.currentDate.getDate()
    this.currentDate.setDate(d - 7)
    this.calendarApi.prev()
    if (!this.root.page.setCalendarMode) this.updateMonthData(y, m, this.currentDate)
    this.setCurDate()
  }

  updateMonthData = (y: number, m: number, date: Date) => {
    if (m !== date.getMonth() || y !== date.getFullYear()) {
      this.getData()
    }
  }

  updateData = (
    tar: { title: any; allDay: any; start: any; end: any; groupId: any },
    newEvent: { title: any; allDay: any; start: any; end: any },
    oldEvent: { start: any; end: any },
    data: any[],
  ) => {
    const { title, allDay, start, end } = newEvent
    tar.title = title
    tar.allDay = allDay
    tar.start = start || tar.start
    tar.end = end || tar.end
    if (tar.groupId) {
      for (let event of this.data.filter(e => e.groupId === tar.groupId)) {
        const startTime = start.getHours() + ':' + start.getMinutes()
        const endTime = end.getHours() + ':' + end.getMinutes()
        event.start = start || event.start
        event.end = end || event.end
        event.startTime = startTime
        event.endTime = endTime
        data.push(event)
      }
    } else data.push(tar)
    if (oldEvent && !this.root.page.isSuper) {
      if (!inDay(oldEvent.start, oldEvent.end)) {
        let start = nightTime(oldEvent.start, true)
        let end = nightTime(oldEvent.start, false)
        const event = this.adminData.find(
          e => new Date(e.start).getTime() === start.getTime() && new Date(e.end).getTime() === end.getTime(),
        )
        if (event) this.deletedData.push(event)
      }
    }
  }

  eventChange = (changeInfo: { event: EventApi; oldEvent: any }) => {
    const newEvent = changeInfo.event
    const oldEvent = changeInfo.oldEvent
    const isSuper = this.root.page.isSuper
    const storedEvent = this.data.find(e => String(e.id) === changeInfo.event.id)

    if (storedEvent) this.updateData(storedEvent, newEvent, oldEvent, this.updatedData)
    else {
      const start = newEvent.start
      const end = newEvent.end
      if (!isSuper) {
        if (!inDay(start, end))
          // night
          window.alert(
            '설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다.',
          )
      }
      const cur = this.setTimeSlot[oldEvent.groupId] || this.setTimeSlot[Number(oldEvent.id.slice(-1))]
      if (cur) {
        if (isSuper) {
          cur.startTime = `${('0' + start.getHours()).slice(-2)}:${('0' + start.getMinutes()).slice(-2)}`
          cur.endTime = `${('0' + end.getHours()).slice(-2)}:${('0' + end.getMinutes()).slice(-2)}`
          for (let event of this.addedData.filter(event => event.id === changeInfo.event.id)) {
            event.startTime = cur.startTime
            event.endTime = cur.endTime
          }
        } else {
          cur.startTime = start
          cur.endTime = end
        }
      } else {
        const registeredEvent = this.addedData.find(e => e.id === changeInfo.event.id)
        if (registeredEvent) {
          const idx = this.addedData.indexOf(registeredEvent)
          this.addedData.splice(idx, 1)
          this.updateData(registeredEvent, newEvent, null, this.addedData)
        }
      }
    }
    this.disableSubmitButton = false
  }

  eventClick = (event: EventApi) => {
    const isAdmin = this.root.page.isAdmin
    if (!isAdmin || event.extendedProps.creator !== this.root.page.username) {
      alert(
        event.title +
          '\n' +
          moment(event.start).format('M[월] D[일] A h[시] mm[분 ~ ]').replace('00분', '') +
          moment(event.end).format('M[월] D[일] A h[시] mm[분]').replace('00분', ''),
      )
    } else {
      const result = window.confirm(
        event.title +
          '\n' +
          moment(event.start).format('M[월] D[일] A h[시] mm[분 ~ ]').replace('00분', '') +
          moment(event.end).format('M[월] D[일] A h[시] mm[분\n\n]').replace('00분', '') +
          '이 일정을 삭제하시겠습니까?',
      )
      if (result) {
        this.deletedData.push(event)

        let start = new Date(event.start)
        let end = new Date(event.end)
        if (!inDay(start, end)) {
          start = nightTime(start, true)
          end = nightTime(end, false)
          const target = this.adminData.find(
            e => new Date(e.start).getTime() === start.getTime() && new Date(e.end).getTime() === end.getTime(),
          )
          if (target) this.deletedData.push(target)
        }
        this.submitData()
      }
    }
  }

  eventReceive = (event: EventApi) => {
    const color = {
      악의꽃: '#79A3F4',
      막무간애: '#FF6B76',
      모여락: '#CD9CF4',
      합주: '#79A3F4',
      '합주 테스트': '#FF6B76',
      공연: '#CD9CF4',
    }
    const date = event.start
    const username = this.root.page.username
    const isSuper = this.root.page.isSuper
    const start = event.start
    const end = event.end
    if (!isSuper) {
      if (!inDay(start, end)) {
        // night
        const result = window.confirm(
          '설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다. 계속하시겠습니까?',
        )
        if (!result) {
          event.remove()
          return
        }
      }
    }
    let jsonData: EventData = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      color: color[event.title],
      club: isSuper ? event.title : this.root.page.userclub,
      creator: username,
    }
    if (isSuper) {
      jsonData = {
        ...jsonData,
        groupId: event.title + date.toISOString(),
        daysOfWeek: [date.getDay()],
        startTime: event.start.getHours() + ':' + event.start.getMinutes(),
        endTime: event.end.getHours() + ':' + event.end.getMinutes(),
        startRecur: new Date(date.getFullYear(), date.getMonth(), 1),
        endRecur: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      }
    }
    this.addedData.push(jsonData)
    this.disableSubmitButton = false
  }

  submitData = () => {
    const isSuper = this.root.page.isSuper
    if (this.deletedData.length > 0) this.deletedData.map(data => axios.delete(`api/${data.id}`, data))

    if (this.updatedData.length > 0) {
      this.updatedData.forEach(data => {
        axios.patch(`api/${data.id}`, data)
        if (!isSuper) {
          const start = data.start
          const end = data.end
          if (!inDay(start, end)) this.submitNightData(data)
        }
      })
    }

    if (this.addedData.length > 0) {
      if (this.root.page.borrowTimeMode) {
        this.addedData.forEach(data => {
          data.club = data.title
        })
        this.root.page.disableBorrowTimeMode()
      } else if (this.root.page.setCalendarMode) this.root.page.disableSetCalendarMode()

      this.addedData.forEach(data => {
        axios.post(`api/`, data)
        if (!isSuper) {
          const start = data.start
          const end = data.end
          if (!inDay(start, end)) this.submitNightData(data)
        }
      })
    }

    this.disableSubmitButton = true
    this.updatedData = []
    this.addedData = []
    this.deletedData = []
    /** async is better way to prevent remained old data
     * 	but when delete/update data is large, it can be slow
     */
    setTimeout(() => this.getData(true), 1000)
  }

  submitNightData = (data: { start: any; end: any }) => {
    const start = nightTime(data.start, true)
    const end = nightTime(data.end, false)
    const clubColors = {
      악의꽃: '#79A3F4',
      막무간애: '#FF6B76',
      모여락: '#CD9CF4',
    }

    const event = {
      start: start,
      end: end,
      title: this.root.page.userclub,
      id: this.root.page.userclub + String(this.setTimeIdx),
      creator: 'admin',
      club: this.root.page.userclub,
      color: clubColors[this.root.page.userclub],
    }
    axios.post(`api/`, event)
  }

  enableSetCalendarMode = () => {
    this.setTimeSlot.push({
      isFirst: true,
      isLast: true,
      startTime: null,
      endTime: null,
    })
    if (this.root.page.isSuper) {
      this.currentDateChange(getFirstDay(1, this.currentDate))
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const from = new Date(year, month, 2).toISOString().substring(0, 10)
      const to = new Date(year, month, 9).toISOString().substring(0, 10)
      this.deletedData = this.data
        .filter(d => d.creator === 'admin')
        .filter(d => from <= d.start)
        .filter(d => d.start <= to)
      this.data = []
      this.setTimeSlot[0] = {
        ...this.setTimeSlot[0],

        /* mon tue wed thu fri sat sun */
        days: ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
      }
    } else {
      this.clubCalendar = true
      this.data = this.data
        .filter(d => d.club !== this.root.page.userclub)
        .concat(this.clubData[this.root.page.userclub])
      this.data.forEach(d => {
        if (this.root.page.username === d.creator) d.editable = true
        else {
          d.editable = false
          d.color = '#777'
        }
      })

      this.setTimeSlot[0] = {
        ...this.setTimeSlot[0],
        title: '',
      }
    }
  }

  disableSetCalendarMode = () => {
    this.currentDateChange(new Date())
    this.calendarApi.getEvents().map((e: { remove: () => any }) => e.remove())
    this.disableSubmitButton = true
    this.setTimeSlot = []
    this.setTimeIdx = 0
    this.getData()
  }

  displayTimeSlot = () => {
    const cur = this.setTimeSlot[this.setTimeIdx]
    const { startTime, endTime, title, days } = cur
    const isSuper = this.root.page.isSuper

    if (!startTime || !endTime) return

    if (isSuper) {
      const adminEvent = this.calendarApi
        .getEvents()
        .filter((e: { groupId: string }) => e.groupId === String(this.setTimeIdx))
      this.addedData = this.addedData.filter(e => e.groupId !== this.setTimeIdx)
      for (let e of adminEvent) e.remove()
    } else {
      const tar = this.calendarApi
        .getEvents()
        .find((e: { id: string }) => e.id === this.root.page.userclub + String(this.setTimeIdx))
      this.addedData = this.addedData.filter(e => e.id !== this.root.page.userclub + String(this.setTimeIdx))
      if (tar) tar.remove()
    }

    let event: EventData
    if (isSuper) {
      let time = this.currentDate

      const clubDays = [
        { club: '악의꽃', color: '#79A3F4', days: getAllIndex(days, '악의꽃') },
        { club: '막무간애', color: '#FF6B76', days: getAllIndex(days, '막무간애') },
        { club: '모여락', color: '#CD9CF4', days: getAllIndex(days, '모여락') },
      ]

      clubDays.forEach(c => {
        event = {
          startTime: startTime,
          endTime: endTime,
          startRecur: new Date(time.getFullYear(), time.getMonth(), 1),
          endRecur: new Date(time.getFullYear(), time.getMonth() + 1, 1),
          groupId: this.setTimeIdx,
          creator: this.root.page.username,

          title: c.club,
          club: c.club,
          start: time,
          end: time,
          daysOfWeek: c.days,
          color: c.color,
        }

        this.calendarApi.addEvent(event)
        this.addedData.push(event)
      })
    } else {
      event = {
        start: startTime,
        end: endTime,
        title: title,
        id: this.root.page.userclub + String(this.setTimeIdx),
        creator: this.root.page.username,
        club: this.root.page.userclub,
        //color: c.color
      }
      this.calendarApi.addEvent(event)
      this.addedData.push(event)
    }
    this.disableSubmitButton = this.calendarApi.getEvents().length === 0
  }

  nextTimeSlot = () => {
    const cur = this.setTimeSlot[this.setTimeIdx]
    if (cur.isLast) {
      cur.isLast = false
      this.setTimeSlot.push({
        isFirst: false,
        isLast: true,
        startTime: null,
        endTime: null,
      })
      const idx = this.setTimeSlot.length - 1
      if (this.root.page.username === 'admin') {
        this.setTimeSlot[idx] = {
          ...this.setTimeSlot[idx],
          days: ['null', 'null', 'null', 'null', 'null', 'null', 'null'],
        }
      } else {
        this.setTimeSlot[idx] = {
          ...this.setTimeSlot[idx],
          title: '',
        }
      }
    }
    this.setTimeIdx++
  }

  prevTimeSlot = () => this.setTimeIdx--

  changeStartTimeSlot = (time: string | Date) => {
    console.log(time, typeof time)
    const hour = typeof time === 'string' ? Number(time.slice(0, 2)) : time.getHours()
    if (!this.setTimeSlot[this.setTimeIdx].endTime || this.setTimeSlot[this.setTimeIdx].endTime > time) {
      if (!this.root.page.isSuper && this.setTimeSlot[this.setTimeIdx].endTime) {
        const end = this.setTimeSlot[this.setTimeIdx].endTime
        const endH = typeof end === 'string' ? Number(end.slice(0, 2)) : end.getHours()
        const endM = typeof end === 'string' ? Number(end.slice(3)) : end.getMinutes()
        const inDay = 6 <= hour && (6 <= endH || (endH === 0 && endM === 0))
        if (!inDay) {
          // night
          const result = window.confirm(
            '설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다. 계속하시겠습니까?',
          )
          if (!result) return
        }
      }
      this.setTimeSlot[this.setTimeIdx].startTime = time
      this.displayTimeSlot()
      return
    }
    alert('시작 시간이 끝 시간보다 나중입니다. 다시 설정해주세요.')
    return
  }

  changeEndTimeSlot = (time: string | Date) => {
    const hour = typeof time === 'string' ? Number(time.slice(0, 2)) : time.getHours()
    const min = typeof time === 'string' ? Number(time.slice(3)) : time.getMinutes()
    if (!this.setTimeSlot[this.setTimeIdx].startTime || this.setTimeSlot[this.setTimeIdx].startTime < time) {
      if (!this.root.page.isSuper && this.setTimeSlot[this.setTimeIdx].startTime) {
        const start = this.setTimeSlot[this.setTimeIdx].startTime
        const startH = typeof start === 'string' ? Number(start.slice(0, 2)) : start.getHours()
        const inDay = 6 <= startH && (6 <= hour || (hour === 0 && min === 0))
        if (!inDay) {
          // night
          const result = window.confirm(
            '설정한 시간이 철야 시간대에 포함됩니다. 철야 시간대에 등록된 일정은 전체 시간표에 동아리명으로 노출됩니다. 계속하시겠습니까?',
          )
          if (!result) return
        }
      }
      this.setTimeSlot[this.setTimeIdx].endTime = time
      this.displayTimeSlot()
      return
    }
    alert('끝 시간이 시작시간보다 먼저입니다. 다시 설정해주세요.')
    return
  }

  changeDays = (day: number, club: string) => {
    this.setTimeSlot[this.setTimeIdx].days[day] = club
    this.displayTimeSlot()
  }

  changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    this.setTimeSlot[this.setTimeIdx].title = event.target.value
    this.displayTimeSlot()
  }

  switchCalendar = () => {
    this.clubCalendar = !this.clubCalendar
    this.addedData = []
    this.deletedData = []
    this.updatedData = []
    this.getData()
  }
}
