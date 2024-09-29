"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EventCard = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.contestName || event.title}</DialogTitle>
        </DialogHeader>
        <div className="bg-[#222222] text-[#DEA03C] rounded-lg p-4 shadow-md">
          <p><strong>Time:</strong> {event.time || formatDate(event.start, { hour: 'numeric', minute: 'numeric' })}</p>
          <p><strong>Date:</strong> {event.date || formatDate(event.start, { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
          <p><strong>Duration:</strong> {event.duration || 'Not specified'}</p>
          <p><strong>Platform:</strong> {event.platform || 'Not specified'}</p>
          {event.link && <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Contest</a>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Calendar = () => {
  const defaultEvents = [
    {
      id: '1',
      title: 'Weekly Contest 413',
      start: new Date(2024, 8, 1, 8, 0), // September 1, 2024, 8:00 AM
      end: new Date(2024, 8, 1, 9, 30),
      contestName: 'Weekly Contest 413',
      time: '8:00 AM- 9:30 AM',
      date: '2024-09-01',
      duration: '1 hrs 30 mins',
      link: 'https://leetcode.com/contest/weekly-contest-413/',
      platform: 'LeetCode'
    },
    {
      id: '2',
      title: 'GFG Weekly - 170 [Rated Contest]',
      start: new Date(2024, 8, 1, 19, 0), // September 1, 2024, 7:00 PM
      end: new Date(2024, 8, 1, 20, 30),
      contestName: 'GFG Weekly - 170 [Rated Contest]',
      time: '7:00 PM- 8:30 PM',
      date: '2024-09-01',
      duration: '1 hrs 30 mins',
      link: 'https://practice.geeksforgeeks.org/contest/gfg-weekly-170-rated-contest',
      platform: 'GeeksForGeeks'
    },
    {
      id: '3',
      title: 'Codeforces Round 970 (Div. 3)',
      start: new Date(2024, 8, 1, 20, 5), // September 1, 2024, 8:05 PM
      end: new Date(2024, 8, 1, 22, 20),
      contestName: 'Codeforces Round 970 (Div. 3)',
      time: '8:05 PM- 10:20 PM',
      date: '2024-09-01',
      duration: '2 hrs 15 mins',
      link: 'https://codeforces.com/contest/2008',
      platform: 'CodeForces'
    },
    {
      id: '4',
      title: 'Codeforces Round 971 (Div. 4)',
      start: new Date(2024, 8, 3, 20, 5), // September 3, 2024, 8:05 PM
      end: new Date(2024, 8, 3, 22, 35),
      contestName: 'Codeforces Round 971 (Div. 4)',
      time: '8:05 PM- 10:35 PM',
      date: '2024-09-03',
      duration: '2 hrs 30 mins',
      link: 'https://codeforces.com/contest/2009',
      platform: 'CodeForces'
    },
    {
      id: '5',
      title: 'Starters 150 (Rated till 6 stars)',
      start: new Date(2024, 8, 4, 20, 0), // September 4, 2024, 8:00 PM
      end: new Date(2024, 8, 4, 22, 0),
      contestName: 'Starters 150 (Rated till 6 stars)',
      time: '8:00 PM- 10:00 PM',
      date: '2024-09-04',
      duration: '2 hrs',
      link: 'https://www.codechef.com/START150',
      platform: 'CodeChef'
    },
    {
      id: '6',
      title: 'Hiring MTS DSA Intern - Geeksforgeeks',
      start: new Date(2024, 8, 5, 20, 0), // September 5, 2024, 8:00 PM
      end: new Date(2024, 8, 5, 21, 30),
      contestName: 'Hiring MTS DSA Intern - Geeksforgeeks',
      time: '8:00 PM- 9:30 PM',
      date: '2024-09-05',
      duration: '1 hrs 30 mins',
      link: 'https://practice.geeksforgeeks.org/contest/hiring-mts-geeksforgeeks',
      platform: 'GeeksForGeeks'
    },
    {
      id: '7',
      title: 'Toyota Programming Contest 2024#9（AtCoder Beginner Contest 370）',
      start: new Date(2024, 8, 7, 17, 30), // September 7, 2024, 5:30 PM
      end: new Date(2024, 8, 7, 19, 10),
      contestName: 'Toyota Programming Contest 2024#9（AtCoder Beginner Contest 370）',
      time: '5:30 PM- 7:10 PM',
      date: '2024-09-07',
      duration: '1 hrs 40 mins',
      link: 'https://atcoder.jp/contests/abc370',
      platform: 'AtCoder'
    },
    {
      id: '8',
      title: 'Weekly Contest 414',
      start: new Date(2024, 8, 8, 8, 0), // September 8, 2024, 8:00 AM
      end: new Date(2024, 8, 8, 9, 30),
      contestName: 'Weekly Contest 414',
      time: '8:00 AM- 9:30 AM',
      date: '2024-09-08',
      duration: '1 hrs 30 mins',
      link: 'https://leetcode.com/contest/weekly-contest-414/',
      platform: 'LeetCode'
    },
    {
      id: '9',
      title: 'GFG Weekly - 171 [Rated Contest]',
      start: new Date(2024, 8, 8, 19, 0), // September 8, 2024, 7:00 PM
      end: new Date(2024, 8, 8, 20, 30),
      contestName: 'GFG Weekly - 171 [Rated Contest]',
      time: '7:00 PM- 8:30 PM',
      date: '2024-09-08',
      duration: '1 hrs 30 mins',
      link: 'https://practice.geeksforgeeks.org/contest/gfg-weekly-171-rated-contest',
      platform: 'GeeksForGeeks'
    },
    {
      id: '10',
      title: 'Starters 151',
      start: new Date(2024, 8, 11, 20, 0), // September 11, 2024, 8:00 PM
      end: new Date(2024, 8, 11, 22, 0),
      contestName: 'Starters 151',
      time: '8:00 PM- 10:00 PM',
      date: '2024-09-11',
      duration: '2 hrs',
      link: 'https://www.codechef.com/START151',
      platform: 'CodeChef'
    },
    {
      id: '11',
      title: 'Python-DS6',
      start: new Date(2024, 8, 14, 12, 0), // September 14, 2024, 12:00 PM
      end: new Date(2024, 8, 15, 0, 0),
      contestName: 'Python-DS6',
      time: '12:00 PM- 12:00 AM',
      date: '2024-09-14',
      duration: '221748 hrs',
      link: 'https://practice.geeksforgeeks.org/contest/python-ds6-1819',
      platform: 'GeeksForGeeks'
    },
    {
      id: '12',
      title: 'AtCoder Beginner Contest 371',
      start: new Date(2024, 8, 14, 17, 30), // September 14, 2024, 5:30 PM
      end: new Date(2024, 8, 14, 19, 10),
      contestName: 'AtCoder Beginner Contest 371',
      time: '5:30 PM- 7:10 PM',
      date: '2024-09-14',
      duration: '1 hrs 40 mins',
      link: 'https://atcoder.jp/contests/abc371',
      platform: 'AtCoder'
    },
    {
      id: '13',
      title: 'Biweekly Contest 139',
      start: new Date(2024, 8, 14, 20, 0), // September 14, 2024, 8:00 PM
      end: new Date(2024, 8, 14, 21, 30),
      contestName: 'Biweekly Contest 139',
      time: '8:00 PM- 9:30 PM',
      date: '2024-09-14',
      duration: '1 hrs 30 mins',
      link: 'https://leetcode.com/contest/biweekly-contest-139/',
      platform: 'LeetCode'
    },
    {
      id: '14',
      title: 'Codeforces Round 972 (Div. 2)',
      start: new Date(2024, 8, 14, 20, 5), // September 14, 2024, 8:05 PM
      end: new Date(2024, 8, 14, 22, 5),
      contestName: 'Codeforces Round 972 (Div. 2)',
      time: '8:05 PM- 10:05 PM',
      date: '2024-09-14',
      duration: '2 hrs',
      link: 'https://codeforces.com/contest/2005',
      platform: 'CodeForces'
    },
    {
      id: '15',
      title: 'Weekly Contest 415',
      start: new Date(2024, 8, 15, 8, 0), // September 15, 2024, 8:00 AM
      end: new Date(2024, 8, 15, 9, 30),
      contestName: 'Weekly Contest 415',
      time: '8:00 AM- 9:30 AM',
      date: '2024-09-15',
      duration: '1 hrs 30 mins',
      link: 'https://leetcode.com/contest/weekly-contest-415/',
      platform: 'LeetCode'
    },
    {
      id: '16',
      title: '11th Asprova Programming Contest（AtCoder Heuristic Contest 037）',
      start: new Date(2024, 8, 15, 15, 30), // September 15, 2024, 3:30 PM
      end: new Date(2024, 8, 15, 19, 30),
      contestName: '11th Asprova Programming Contest（AtCoder Heuristic Contest 037）',
      time: '3:30 PM- 7:30 PM',
      date: '2024-09-15',
      duration: '4 hrs',
      link: 'https://atcoder.jp/contests/ahc037',
      platform: 'AtCoder'
    },
    {
      id: '17',
      title: 'GFG Weekly - 172 [Rated Contest]',
      start: new Date(2024, 8, 15, 19, 0), // September 15, 2024, 7:00 PM
      end: new Date(2024, 8, 15, 20, 30),
      contestName: 'GFG Weekly - 172 [Rated Contest]',
      time: '7:00 PM- 8:30 PM',
      date: '2024-09-15',
      duration: '1 hrs 30 mins',
      link: 'https://practice.geeksforgeeks.org/contest/gfg-weekly-172-rated-contest',
      platform: 'GeeksForGeeks'
    },
    {
      id: '18',
      title: '2024 ICPC World Finals: JetBrains Tech Trek',
      start: new Date(2024, 8, 17, 10, 17), // September 17, 2024, 10:17 AM
      end: new Date(2024, 8, 17, 11, 0),
      contestName: '2024 ICPC World Finals: JetBrains Tech Trek',
      time: '10:17 AM- 11:00 AM',
      date: '2024-09-17',
      duration: '0 hrs 43 mins',
      link: 'https://codeforces.com/contest/2017',
      platform: 'CodeForces'
    },

    {
      id: '20',
      title: 'Starters 152 (Rated till 6 stars)',
      start: new Date(2024, 8, 18, 20, 0), // September 18, 2024, 8:00 PM
      end: new Date(2024, 8, 18, 22, 0),
      contestName: 'Starters 152 (Rated till 6 stars)',
      time: '8:00 PM- 10:00 PM',
      date: '2024-09-18',
      duration: '2 hrs',
      link: 'https://www.codechef.com/START152',
      platform: 'CodeChef'
    },
    {
      id: '21',
      title: 'Nutan College x GeeksforGeeks: Unlocking the Power of Data',
      start: new Date(2024, 8, 20, 9, 0), // September 20, 2024, 9:00 AM
      end: new Date(2024, 8, 20, 18, 0),
      contestName: 'Nutan College x GeeksforGeeks: Unlocking the Power of Data',
      time: '9:00 AM- 6:00 PM',
      date: '2024-09-20',
      duration: '9 hrs',
      link: 'https://practice.geeksforgeeks.org/contest/unlocking-the-power-of-data-your-first-step-into-data-science',
      platform: 'GeeksForGeeks'
    },
    {
      id: '22',
      title: 'Codeforces Round 973 (Div. 2)',
      start: new Date(2024, 8, 20, 20, 5), // September 20, 2024, 8:05 PM
      end: new Date(2024, 8, 20, 22, 5),
      contestName: 'Codeforces Round 973 (Div. 2)',
      time: '8:05 PM- 10:05 PM',
      date: '2024-09-20',
      duration: '2 hrs',
      link: 'https://codeforces.com/contest/2013',
      platform: 'CodeForces'
    },
    {
      id: '23',
      title: 'UNIQUE VISION Programming Contest 2024 Autumn (AtCoder Beginner Contest 372)',
      start: new Date(2024, 8, 21, 17, 30), // September 21, 2024, 5:30 PM
      end: new Date(2024, 8, 21, 19, 10),
      contestName: 'UNIQUE VISION Programming Contest 2024 Autumn (AtCoder Beginner Contest 372)',
      time: '5:30 PM- 7:10 PM',
      date: '2024-09-21',
      duration: '1 hrs 40 mins',
      link: 'https://atcoder.jp/contests/abc372',
      platform: 'AtCoder'
    },
    {
      id: '24',
      title: 'Job-A-Thon 37 Hiring Challenge',
      start: new Date(2024, 8, 21, 20, 0), // September 21, 2024, 8:00 PM
      end: new Date(2024, 8, 21, 22, 30),
      contestName: 'Job-A-Thon 37 Hiring Challenge',
      time: '8:00 PM- 10:30 PM',
      date: '2024-09-21',
      duration: '2 hrs 30 mins',
      link: 'https://practice.geeksforgeeks.org/contest/job-a-thon-37-hiring-challenge',
      platform: 'GeeksForGeeks'
    },
    {
      id: '25',
      title: 'Weekly Contest 416',
      start: new Date(2024, 8, 22, 8, 0), // September 22, 2024, 8:00 AM
      end: new Date(2024, 8, 22, 9, 30),
      contestName: 'Weekly Contest 416',
      time: '8:00 AM- 9:30 AM',
      date: '2024-09-22',
      duration: '1 hrs 30 mins',
      link: 'https://leetcode.com/contest/weekly-contest-416/',
      platform: 'LeetCode'
    },
    {
      id: '26',
      title: 'AtCoder Regular Contest 184',
      start: new Date(2024, 8, 22, 17, 30), // September 22, 2024, 5:30 PM
      end: new Date(2024, 8, 22, 19, 30),
      contestName: 'AtCoder Regular Contest 184',
      time: '5:30 PM- 7:30 PM',
      date: '2024-09-22',
      duration: '2 hrs',
      link: 'https://atcoder.jp/contests/arc184',
      platform: 'AtCoder'
    },
    {
      id: '27',
      title: 'Starters 153',
      start: new Date(2024, 8, 25, 20, 0), // September 25, 2024, 8:00 PM
      end: new Date(2024, 8, 25, 22, 0),
      contestName: 'Starters 153',
      time: '8:00 PM- 10:00 PM',
      date: '2024-09-25',
      duration: '2 hrs',
      link: 'https://www.codechef.com/START153',
      platform: 'CodeChef'
    },
    {
      id: '28',
      title: 'Codeforces Round 975 (Div. 2)',
      start: new Date(2024, 8, 27, 19, 5), // September 27, 2024, 7:05 PM
      end: new Date(2024, 8, 27, 21, 35),
      contestName: 'Codeforces Round 975 (Div. 2)',
      time: '7:05 PM- 9:35 PM',
      date: '2024-09-27',
      duration: '2 hrs 30 mins',
      link: 'https://codeforces.com/contest/2019',
      platform: 'CodeForces'
    },
    {
      id: '29',
      title: 'AtCoder Beginner Contest 373',
      start: new Date(2024, 8, 28, 17, 30), // September 28, 2024, 5:30 PM
      end: new Date(2024, 8, 28, 19, 10),
      contestName: 'AtCoder Beginner Contest 373',
      time: '5:30 PM- 7:10 PM',
      date: '2024-09-28',
      duration: '1 hrs 40 mins',
      link: 'https://atcoder.jp/contests/abc373',
      platform: 'AtCoder'
    },
    {
      id: '30',
      title: 'Biweekly Contest 140',
      start: new Date(2024, 8, 28, 20, 0), // September 28, 2024, 8:00 PM
      end: new Date(2024, 8, 28, 21, 30),
      contestName: 'Biweekly Contest 140',
      time: '8:00 PM- 9:30 PM',
      date: '2024-09-28',
      duration: '1 hrs 30 mins',
      link: 'https://leetcode.com/contest/biweekly-contest-140/',
      platform: 'LeetCode'
    },
    {
      id: '31',
      title: 'Starters 154',
      start: new Date(2024, 9, 2, 20, 0), // October 2, 2024, 8:00 PM
      end: new Date(2024, 9, 2, 22, 0),
      contestName: 'Starters 154',
      time: '8:00 PM- 10:00 PM',
      date: '2024-10-02',
      duration: '2 hrs',
      link: 'https://www.codechef.com/START154',
      platform: 'CodeChef'
    },
    {
      id: '32',
      title: 'KEYENCE Programming Contest 2024（AtCoder Beginner Contest 374）',
      start: new Date(2024, 9, 5, 17, 30), // October 5, 2024, 5:30 PM
      end: new Date(2024, 9, 5, 19, 10),
      contestName: 'KEYENCE Programming Contest 2024（AtCoder Beginner Contest 374）',
      time: '5:30 PM- 7:10 PM',
      date: '2024-10-05',
      duration: '1 hrs 40 mins',
      link: 'https://atcoder.jp/contests/abc374',
      platform: 'AtCoder'
    }
  ];

  const [currentEvents, setCurrentEvents] = useState(defaultEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    id: "",
    title: "",
    start: new Date(),
    end: new Date(),
    contestName: "",
    time: "",
    date: "",
    duration: "",
    link: "",
    platform: "",
  });
  const calendarRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      } else {
        setCurrentEvents(defaultEvents);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected) => {
    setNewEvent({
      ...newEvent,
      id: `${selected.startStr}-${Date.now()}`,
      start: selected.start,
      end: selected.end,
      date: formatDate(selected.start, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    });
  };

  const handleEventClick = (selected) => {
    const event = selected.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      contestName: event.extendedProps.contestName || event.title,
      time: event.extendedProps.time || formatDate(event.start, { hour: 'numeric', minute: 'numeric' }),
      date: formatDate(event.start, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      duration: event.extendedProps.duration || 'Not specified',
      link: event.extendedProps.link || '',
      platform: event.extendedProps.platform || event.title,
    });
  };

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    const calendarApi = calendarRef.current?.getApi();

    if (calendarApi) {
      calendarApi.addEvent({
        ...newEvent,
        title: newEvent.platform, // Title is now the platform name
      });
      setCurrentEvents([...currentEvents, newEvent]);
      setNewEvent({
        id: "",
        title: "",
        start: new Date(),
        end: new Date(),
        contestName: "",
        time: "",
        date: "",
        duration: "",
        link: "",
        platform: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const closeEventCard = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="bg-[#0f0f0f] text-[#DEA03C] min-h-screen">
      <div className="flex w-full px-10 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">
            Calendar Events
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <ul className="space-y-4">
              {currentEvents.length <= 0 && (
                <div className="italic text-center">No Events Present</div>
              )}

              {currentEvents.length > 0 &&
                currentEvents.map((event) => (
                  <li
                    className="border border-[#DEA03C] shadow px-4 py-2 rounded-md cursor-pointer hover:bg-[#1a1a1a]"
                    key={event.id}
                    onClick={() => handleEventClick({ event })}
                  >
                    <span className="text-white">{event.contestName || event.title}</span>
                    <br />
                    <label className="text-white">
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            ref={calendarRef}
            height={"85vh"}
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={currentEvents}
            displayEventTime={false}
            eventContent={(eventInfo) => (
              <div className="flex items-center overflow-hidden w-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                <div className="truncate text-xs">
                  {eventInfo.event.title}
                  {eventInfo.event.extendedProps.contestName && (
                    <span className="ml-1">
                      ({eventInfo.event.extendedProps.contestName})
                    </span>
                  )}
                </div>
              </div>
            )}
            dayCellDidMount={(args) => {
              args.el.classList.add('overflow-y-auto', 'max-h-full');
            }}
          />
        </div>
      </div>

      <Dialog open={!!newEvent.id} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddOrUpdateEvent}>
            <div>
              <label htmlFor="contestName" className="block text-sm font-medium text-gray-700">
                Contest Name:
              </label>
              <input
                type="text"
                id="contestName"
                name="contestName"
                value={newEvent.contestName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time:
              </label>
              <input
                type="text"
                id="time"
                name="time"
                value={newEvent.time}
                onChange={handleInputChange}
                placeholder="e.g., 8:00 AM - 9:30 AM"
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration:
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={newEvent.duration}
                onChange={handleInputChange}
                placeholder="e.g., 1 hr 30 mins"
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Link:
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={newEvent.link}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform:
              </label>
              <input
                type="text"
                id="platform"
                name="platform"
                value={newEvent.platform}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
              type="submit"
            >
              Add Event
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <EventCard event={selectedEvent} onClose={closeEventCard} />
    </div>
  );
};

export default Calendar;