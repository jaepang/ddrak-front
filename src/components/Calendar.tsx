import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'
import { useStore } from '../stores'
import styled from '@emotion/styled'
import FullCalendar, { EventChangeArg, EventClickArg } from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable, EventReceiveArg } from '@fullcalendar/interaction'
import moment from 'moment'
import 'moment/locale/ko'

const vh = (v: number) => {
  let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  return (v * h) / 100
}
moment.locale('ko')

const Calendar = observer(() => {
  const { calendar, page } = useStore()

  useEffect(() =>
    autorun(() => {
      if (calendar.firstLoad) {
        calendar.getData()
        calendar.setCalendarApi(React.createRef())
        calendar.setFirstLoad()
      }
      if (page.setCalendarMode) {
        const container = document.getElementById('externalEvents')
        new Draggable(container, {
          itemSelector: '.fc-event',
          eventData: eventEl => {
            const color = {
              악의꽃: '#79A3F4',
              막무간애: '#FF6B76',
              모여락: '#CD9CF4',
              합주: '#79A3F4',
              '합주 테스트': '#FF6B76',
              공연: '#CD9CF4',
            }
            return {
              id: eventEl.innerText + new Date().toISOString(),
              title: eventEl.innerText,
              duration: '02:00',
              color: color[eventEl.innerText],
            }
          },
        })
      }
      calendar.emptyBuffer()
      calendar.handleBorrowedEvents()
    }),
  )

  const handleEventClick = (info: EventClickArg) => calendar.eventClick(info.event)
  const handleEventReceive = (info: EventReceiveArg) => calendar.eventReceive(info.event)
  const handleEventChange = (info: EventChangeArg) => calendar.eventChange(info)
  const slotLabelFormat = (args: any) => moment(args.date).format('A h[시]')
  const dayHeaderContent = (args: any) => {
    ;<div>
      <p>{moment(args.date).format('ddd[ ]')}</p>
      <h2>{moment(args.date).format('D')}</h2>
    </div>
  }
  const eventTimeFormat = (args: any) =>
    moment.duration(moment(args.end).diff(moment(args.date))).asHours() >= 1.5 &&
    moment(args.date).format('A h[시] mm[분]').replace('00분', '')

  return (
    <Container>
      <FullCalendar
        ref={calendar.ref}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        firstDay={1}
        headerToolbar={false}
        allDaySlot={false}
        height={vh(89.8)}
        events={calendar.data}
        slotMinTime="06:00:00"
        slotMaxTime="30:00:00"
        editable={page.isAdmin}
        droppable={page.isAdmin}
        eventReceive={handleEventReceive}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
        slotDuration="00:30:00"
        slotLabelFormat={slotLabelFormat}
        dayHeaderContent={dayHeaderContent}
        eventTimeFormat={eventTimeFormat}
      />
    </Container>
  )
})

const Container = styled.div`
  flex: none;
  background-color: #fff;
  width: 75%;
  height: 100%;
  margin: 0;
  border: none;
`

export default Calendar
